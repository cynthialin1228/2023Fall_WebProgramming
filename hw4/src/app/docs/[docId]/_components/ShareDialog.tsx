import { RxAvatar } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { auth } from "@/lib/auth";

import {getDocumentAuthors } from "./actions";

type Props = {
  docId: string;
};
async function ShareDialog({ docId }: Props) {
  const session = await auth();
  if (!session?.user?.id) return null;
  //   const userId = session.user.id;

  const authors = await getDocumentAuthors(docId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Authors</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat room</DialogTitle>
          <DialogDescription>A chat room between the people below</DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col gap-1">
          <h1 className="w-full font-semibold text-slate-900">Authors</h1>
          {authors.map((author, index) => (
            <form key={index} className="flex w-full items-center gap-2">
              <RxAvatar size={30} />
              <div className="flex grow flex-col ">
                <p className="text-xs text-gray-600">{author.email}</p>
              </div>
            </form>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShareDialog;
