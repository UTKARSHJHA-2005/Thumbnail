"use client"
import React from 'react'
import { PiSignOutLight } from "react-icons/pi";
import { signOut } from 'next-auth/react'

export default function Signout() {
    return (
        <div><PiSignOutLight
            onClick={() => signOut()}
            className="h-6 w-6 cursor-pointer"
        /></div>
    )
}
