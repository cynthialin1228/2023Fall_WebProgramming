import { db } from "@/db";
import { documentsTable, usersToDocumentsTable } from "@/db/schema";

export const createDocument = async (userId: string) => {
    "use server";
    console.log("[createDocument]");

    const newDocId = await db.transaction(async (tx) => {
        const [newDoc] = await tx
            .insert(documentsTable)
            .values({
                title: "New Chat Room",
                content: "This is a new chat room",
            })
            .returning();
        await tx.insert(usersToDocumentsTable).values({
            userId: userId,
            documentId: newDoc.displayId,
        });
        return newDoc.displayId;
    });
    return newDocId;
};
