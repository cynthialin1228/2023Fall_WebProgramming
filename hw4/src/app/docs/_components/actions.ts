"use server"
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { documentsTable, usersToDocumentsTable, usersTable, messagesTable, documentToMessagesTable, documentsToMessagesRelations } from "@/db/schema";

export async function getDocumentAuthors(docId: string) {
  const dbAuthors = await db.query.usersToDocumentsTable.findMany({
    where: eq(usersToDocumentsTable.documentId, docId),
    with: {
      user: {
        columns: {
          displayId: true,
          email: true,
        },
      },
    },
    columns: {},
  });

  const authors = dbAuthors.map((dbAuthor) => {
    const author = dbAuthor.user;
    return {
      id: author.displayId,
      email: author.email,
    };
  });

  return authors;
}

export const addDocumentAuthor = async (docId: string, email: string) => {
  // Find the user by email
  const [user] = await db
    .select({
      displayId: usersTable.displayId,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (!user) {
    return false;
  }

  await db.insert(usersToDocumentsTable).values({
    documentId: docId,
    userId: user.displayId,
  });
};

export const createDocument = async (userId: string) => {
    "use server";
    console.log("[createDocument]");
    const newDocId = await db.transaction(async (tx) => {
        const [newDoc] = await tx
            .insert(documentsTable)
            .values({
              title: "untitled",
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

export const getDocuments = async (userId: string) => {
    "use server";
  
    const documents = await db.query.usersToDocumentsTable.findMany({
      where: eq(usersToDocumentsTable.userId, userId),
      with: {
        document: {
          columns: {
            displayId: true,
            title: true,
          },
        },
      },
    });
    return documents;
  };
export const deleteDocument = async (documentId: string) => {
    "use server";
    console.log("[deleteDocument]");
    await db
        .delete(documentsTable)
        .where(eq(documentsTable.displayId, documentId));
    return;
};
export const getMessage = async (displayId: string) => {
  "use server";
  const message = await db.query.messagesTable.findFirst({
    where: eq(messagesTable.displayId, displayId),
    columns: {
      id: true,
      documentId: true,
      userId: true,
      content: true,
      timestamp: true,
    },
  });

  return message;
};