"use server"

import getServerSession from "next-auth"
import { authConfig } from "~/server/auth/config"
import { db } from "~/server/db"

const Credits = async () => {
    const serversession = await getServerSession(authConfig)
    const email=serversession.user.email;
    const user = await db.user.findUnique({
        where: {
            email,
        },
        select: {
            credits: true,
        },
    });
}
export default Credits