"use server"
import Signout from "../signout";
import Thumbnailcreate from "../thumbnailcreate";
import { db } from "~/server/db";
import { auth } from "~/server/auth";

const Page = async () => {
    const serversession = await auth();
    const id = serversession?.user?.id;
    const sessionuser = await db.user.findUnique({
        where: {
            id,
        },
        select: {
            credits: true,
        },
    });

    return (
        <div>
            <Signout />
            <Thumbnailcreate />
        </div>
    );
};

export default Page;