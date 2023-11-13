import { RxAvatar } from "react-icons/rx";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import { addDocumentAuthor, getDocumentAuthors, createDocument, getDocuments, deleteDocument } from "./actions";


async function AddChatRoom() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = session.user.id;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Add</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a chat room</DialogTitle>
          <DialogDescription>Who do you what to chat with?</DialogDescription>
        </DialogHeader>
        <form
          action={async (e) => {
            "use server";
            const email = e.get("email");
            if (!email) return;
            if (typeof email !== "string") return;
            const documents = await getDocuments(userId);

            for (const doc of documents) {
              const authors = await getDocumentAuthors(doc.document.displayId);
              if (authors.some(author => author.email === email)) {
                // TODO: tell the user: 'Chat already exists');
                redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/docs/${doc.document.displayId}`);
                return;
              }
            }
            const newDocId = await createDocument(userId);
            const result = await addDocumentAuthor(newDocId, email);
            if (!result) {
              redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/docs/${newDocId}`);
            }
            revalidatePath(`${publicEnv.NEXT_PUBLIC_BASE_URL}/docs/${newDocId}`);
          }}
          className="flex flex-row gap-4"
        >
          <Input placeholder="Email" name="email" />
          <Button type="submit">Add</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddChatRoom;
