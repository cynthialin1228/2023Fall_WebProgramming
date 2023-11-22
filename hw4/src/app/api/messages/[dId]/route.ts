import { NextResponse, type NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { documentsTable, messagesTable, documentToMessagesTable} from "@/db/schema";
import { auth } from "@/lib/auth";
import { updateDocSchema } from "@/validators/updateDocument";
import { Document, Message } from "@/lib/types/db";
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      dId: string;
    };
  },
) {
  try {

    // Get the document
    console.log("params.dId", params.dId)
    const messages = await db.query.documentToMessagesTable.findMany({
        // where: eq(messagesTable.documentId, params.documentId),
        where: and(
            eq(documentToMessagesTable.messageId, messagesTable.displayId),
            eq(documentToMessagesTable.documentId, params.dId),
          ),
        with: {
            message: {
                columns: {
                    id: true,
                    documentId: true,
                    userId: true,
                    content: true,
                    timestamp: true,
                },
            },  
        },
    });
    console.log("messages", messages)
    if (messages.length === 0) {
        return NextResponse.json({ error: "Messages Not Found" }, { status: 404 });
    }

    return NextResponse.json(
        { messages},
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
  { params }: { params: { dId: string } },
) {
  try {
    // Get user from session
    const session = await auth();
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // Parse the request body
    const reqBody = await req.json();
    let validatedReqBody: Partial<Omit<Document, "id">> & { messageContent?: string };
    try {
      validatedReqBody = updateDocSchema.parse(reqBody);
    } catch (error) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }
    if(!validatedReqBody.messageContent) {
      return NextResponse.json({ error: "No Message Body"}, {status: 404});
    }
    console.log("validatedReqBody.messageContent", validatedReqBody.messageContent)
    const [createMessage] = await db
        .insert(messagesTable)
        .values({
          documentId: params.dId,
          userId: userId,
          content: validatedReqBody.messageContent,
        })
        .returning();
      // return {
      //   documentId: createMessage.documentId,
      //   id: createMessage.displayId,
      //   content: createMessage.content,
        
      // };
    console.log("createMessage", createMessage)
    return NextResponse.json(
      {
        message: createMessage,
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
