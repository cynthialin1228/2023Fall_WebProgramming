import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Document, Message } from "@/lib/types/db";
import { useDebounce } from 'use-debounce';
import { getMessage } from "@/app/docs/_components/actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { publicEnv } from "@/lib/env/public";

export const useDocument = () => {
  const { docId} = useParams();
  const documentId = Array.isArray(docId) ? docId[0] : docId;
  const [document, setDocument] = useState<Document | null>(null);
  const [debouncedDocument] = useDebounce(document, 300);
  // const messages: Message[] = [];
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  // const messages: Message[] = [];
  // TODO:get the messages with the documentid in the messages table
  const router = useRouter();
  const updateUserDocument = async (newMessageContent: string) => {
    if (!document || !documentId) return;
    // Send PUT request to update the document and add a new message
    const res = await fetch(`/api/messages/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // title: document.title,
        messageContent: newMessageContent, // Send new message content
      }),
    });

    if (!res.ok) {
      return; // Handle error
    }
    const updatedData = await res.json();
    // Update the state with the new message (if available)
    if (updatedData.message) {
      setMessages((messages) => [...messages, updatedData]);
      console.log("updatedData.message", updatedData.message);
    }
  };

  // useEffect(() => {
  //   const updateDocument = async () => {
  //     if (!debouncedDocument) return;
  //     // const res = await fetch(`/api/documents/${documentId}`, {
  //     //   method: "PUT",
  //     //   headers: {
  //     //     "Content-Type": "application/json",
  //     //   },
  //     //   body: JSON.stringify({
  //     //     title: debouncedDocument.title,
  //     //   }),
  //     // });
  //     // if (!res.ok) {
  //     //   return;
  //     // }
  //     const res_m = await fetch(`/api/messages/${documentId}`, {
  //       method: "GET",
  //     });
  //     if (!res_m.ok) {
  //       return;
  //     }
  //     const msgs = await res_m.json();
      
  //     setMessages((messages) => [...messages, msgs.message]);
  //     console.log("messages", messages);
  //     router.refresh();
  //   };
  //   updateDocument();
  // }, [debouncedDocument, documentId, router]);
  

  useEffect(() => {
    if (!documentId) return;
    const fetchDocument = async () => {
      const res = await fetch(`/api/documents/${documentId}`);
      if (!res.ok) {
        setDocument(null);
        router.push("/docs");
        return;
      }
      const data = await res.json();
      setDocument(data);
    };
    fetchDocument();
  }, [documentId, router]);
  const title = document?.title || "";
  const setTitle = (newTitle: string) => {
    if (document === null) return;
    setDocument({
      ...document,
      title: newTitle,
    });
  };
  return {
    documentId,
    document,
    title,
    setTitle,
    updateUserDocument,
    messages,
    userId
  };
};
