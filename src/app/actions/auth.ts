"use server"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { signinschema } from "~/schemas/auth"
import { db } from "~/server/db"
export const signup=async (email:string,password:string)=>{
    const isvalid=signinschema.safeParse({email,password})
    if(isvalid.error) return "Error";
    const user=await db.user.findUnique({
        where:{
            email:isvalid.data.email
        }
    })
    if (user) return "User already exists"
    const hash=await bcrypt.hash(isvalid.data.password,10)
    await db.user.create({
        data:{
            email:isvalid.data.email,
            password:hash,
        }
    })
    redirect("/signin")
}