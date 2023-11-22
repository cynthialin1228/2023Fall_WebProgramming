import { NextResponse, type NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { documentsTable, usersToDocumentsTable, messagesTable, documentToMessagesTable} from "@/db/schema";
import { auth } from "@/lib/auth";
import { updateDocSchema } from "@/validators/updateDocument";
import { Document, Message } from "@/lib/types/db";
// GET /api/documents/:documentId
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      documentId: string;
    };
  },
) {
  try {
    // Get user from session
    const session = await auth();
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // Get the document
    const dbDocument = await db.query.usersToDocumentsTable.findFirst({
      where: and(
        eq(usersToDocumentsTable.userId, userId),
        eq(usersToDocumentsTable.documentId, params.documentId),
      ),
      with: {
        document: {
          columns: {
            displayId: true,
            title: true,
          },
        },
      },
    });
    if (!dbDocument?.document) {
      return NextResponse.json({ error: "Doc Not Found" }, { status: 404 });
    }
    // const dbMessages = await db.query.documentToMessagesTable.findMany({
    //   where: eq(documentToMessagesTable.documentId, dbDocument.document.displayId),
    // });

    // Check if there are no messages, return just the document details
    // if (!dbMessages || dbMessages.length === 0) {
    //   return NextResponse.json(
    //     {
    //       id: dbDocument.document.displayId,
    //       title: dbDocument.document.title,
    //     },
    //     { status: 200 },
    //   );
    // }

    // // Map messages to the desired format
    // const messages: Message[] = dbMessages.map((message) => ({
    //   id: message.id,
    //   documentId: message.documentId,
    //   userId: message.userId,
    //   content: message.content,
    //   timestamp: message.timestamp,
    // }));

    return NextResponse.json(
      {
        id: dbDocument.document.displayId,
        title: dbDocument.document.title,
        // messages,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { documentId: string } },
) {
  try {
    // Get user from session
    const session = await auth();
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // Check ownership of document
    const [doc] = await db
      .select({
        documentId: usersToDocumentsTable.documentId,
      })
      .from(usersToDocumentsTable)
      .where(
        and(
          eq(usersToDocumentsTable.userId, userId),
          eq(usersToDocumentsTable.documentId, params.documentId),
        ),
      );
    if (!doc) {
      return NextResponse.json({ error: "Doc Not Found" }, { status: 404 });
    }

    // Parse the request body
    const reqBody = await req.json();
    let validatedReqBody: Partial<Omit<Document, "id">> & { messageContent?: string };
    try {
      validatedReqBody = updateDocSchema.parse(reqBody);
    } catch (error) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const [updatedDoc] = await db
      .update(documentsTable)
      .set({title: validatedReqBody.title,})
      .where(eq(documentsTable.displayId, params.documentId))
      .returning();
    // let newMessage: any; // Define newMessage with an 'any' type
    // Check if there's message content to add
    // if (validatedReqBody.messageContent) {
    //   newMessage = await db.insert(messagesTable).values({
    //     documentId: params.documentId,
    //     userId: userId,
    //     content: validatedReqBody.messageContent,
    //   });
    //   await db.insert(documentToMessagesTable).values({
    //     documentId: newMessage[0].documentId, 
    //     messageId: newMessage[0].messageId, 
    //   });
    // }
    
    return NextResponse.json(
      {
        id: updatedDoc.displayId,
        title: updatedDoc.title,
        // message: newMessage,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
