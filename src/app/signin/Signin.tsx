"use client"
import { useForm } from "react-hook-form"
import z from "zod"
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io"
import {toast,ToastContainer} from "react-toastify"
import { signinschema } from "~/schemas/auth"
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react";
type FormValues = z.infer<typeof signinschema>

const Signin = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(signinschema) })
    const router=useRouter()
    const onSubmit = async(data: FormValues) => {
        const response=await signIn("credentials", {
            redirect: false,
            callbackUrl: "/dashboard",
            email: data.email,
            password: data.password
        })
        if(response?.error){
            toast.error(response.error)
        }else{
            router.push("/dashboard")
        }
    };

    return (
        <div className="flex h-screen items-center justify-center px-4">
            <div className="flex flex-col gap-4 w-full max-w-sm">
                <div className="border rounded-xl shadow-lg p-6 bg-white w-full">
                    <h2 className="text-2xl font-bold mb-1">Sign in</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Enter your email and password below.
                    </p>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <input
                                {...register("email", { required: "Email is required" })}
                                id="email"
                                type="email"
                                placeholder="mail@gmail.com"
                                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <input
                                {...register("password", { required: "Password is required" })}
                                id="password"
                                type="password"
                                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white rounded py-2 text-sm hover:bg-blue-700 transition">
                                Sign in
                            </button>
                            <Link href="/signup" className="text-center text-sm text-blue-600 hover:underline">
                                Create Your Account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer/>
        </div>
    )
}
export default Signin;