import { AiFillDelete, AiFillFileAdd, AiFillFileText } from "react-icons/ai";
import { RxAvatar, RxPlus } from "react-icons/rx";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createDocument, getDocuments } from "./actions";
import { PlusIcon } from "@radix-ui/react-icons";

async function Navbar() {
    const session = await auth();
    if (!session || !session?.user?.id) {
        redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
    }
    const userId = session.user.id;
    const documents = await getDocuments(userId);
    return (
        <nav className="flex w-full flex-col overflow-y-scroll bg-slate-100 pb-10">
        <nav className="sticky top-0 flex flex-col items-center justify-between border-b bg-slate-100 pb-2">
        <div className="flex w-full items-center justify-between px-3 py-1">
            <div className="flex items-center gap-2">
                <RxAvatar />
                <h1 className="text-sm font-semibold">
                {session?.user?.email ?? "User"}
                </h1>
            </div>
            <Link href={`/auth/signout`}>
                <Button
                    variant={"ghost"}
                    type={"submit"}
                    className="hover:bg-slate-200"
                >
                    Sign Out
                </Button>
            </Link>
        </div>

        <form 
            className="w-full hover:bg-slate-200"
            action={async () => {
                "use server";
                await createDocument(userId);
            }}
        >
            <button
                type="submit"
                className="flex w-full items-center gap-2 px-3 py-1 text-left text-sm text-slate-500"
            >
                <RxPlus size={16} />
                <p>Create Chat Room</p>
            </button>
        </form>
        </nav>
        <section className="flex w-full flex-col pt-3">
            {documents.map((doc, i) => {
            return (
                <div
                key={i}
                className="group flex w-full cursor-pointer items-center justify-between gap-2 text-slate-400 hover:bg-slate-200 "
                >
                <Link
                    className="grow px-3 py-1"
                    href={`/docs/${doc.document.displayId}`}
                >
                    <div className="flex items-center gap-2">
                    <AiFillFileText />
                    <span className="text-sm font-light ">
                        {doc.document.title}
                    </span>
                    </div>
                </Link>
                <form className="hidden px-2 text-slate-400 hover:text-red-400 group-hover:flex">
                    <button type={"submit"}>
                    <AiFillDelete size={16} />
                    </button>
                </form>
                </div>
            );
            })}
        </section>
        </nav>
    );
}

export default Navbar;