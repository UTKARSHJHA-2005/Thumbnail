"use server"
import Signout from "../signout";
import Thumbnailcreate from "../thumbnailcreate";
import { db } from "~/server/db";
import { auth } from "~/server/auth";
// import Recent from "../recent";

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
                <div className="flex flex-col px-10 md:mt-10">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Hi there
                    </h1>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Want to create a thumbnail?
                    </h1>
                    <Thumbnailcreate />
                </div>
        </div>
    );
};

export default Page;