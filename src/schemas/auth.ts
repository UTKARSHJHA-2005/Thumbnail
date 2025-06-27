import {object,string} from "zod";
export const signinschema=object({
    email:string({required_error:"Email is required"}).min(1,"Email is required").email("Invalid Email"),
    password:string({required_error:"Password is required"})
    .min(1,"Password is required")
    .min(8,"Password should minimum of 8 characters")
    .max(32,"Password should be limit to 32 only")
})