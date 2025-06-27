import { PrismaAdapter } from "@auth/prisma-adapter";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signinschema } from "~/schemas/auth";
import bcrypt from "bcryptjs"
import type { JWT } from "next-auth/jwt";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			// add more fields here if needed
		} & DefaultSession["user"];
	}


	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}
declare module "next-auth/jwt" {
	interface JWT {
		id?: string;
	}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: "Credentials",
			// `credentials` is used to generate a form on the sign in page.
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				username: {},
				password: {}
			},
			async authorize(credentials) {
				try {
					const { email, password } = await signinschema.parseAsync(credentials);
					const user = await db.user.findUnique({
						where: {
							email: email,
						},
					}) as {
						id: string;
						name: string | null;
						email: string | null;
						image: string | null;
						emailVerified: Date | null;
						password: string; // 👈 add password manually
					};
					if (!user) {
						throw new Error("No User Found")
					}
					const validPassword = await bcrypt.compare(password, user.password);
					if (!validPassword) {
						throw new Error("Invalid password");
					} else {
						return user;
					}
				} catch (error) {
					return null
				}
			}
		})
		/**
		 * ...add more providers here.
		 *
		 * Most other providers require a bit more work than the Discord provider. For example, the
		 * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
		 * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
		 *
		 * @see https://next-auth.js.org/providers/github
		 */
	],
	pages: {
		signIn: "/signin",
	},
	secret: process.env.AUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	adapter: PrismaAdapter(db),
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id!; // Or safely assert if needed
			return session;
		}
	}
} satisfies NextAuthConfig;
