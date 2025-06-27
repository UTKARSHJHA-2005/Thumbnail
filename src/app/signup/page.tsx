"use server";

import getServerSession from "next-auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { authConfig } from "~/server/auth/config";
import Signup from "./signup";

const Page = async () => {
    const session = getServerSession(authConfig) as unknown as Session | null;

    if (session?.user) {
        redirect("/dashboard");
    }

    return (
    <>
        <Signup/>
    </>
    )
};

export default Page;
