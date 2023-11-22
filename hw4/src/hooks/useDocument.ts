import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Document } from "@/lib/types/db";
import { useDebounce } from 'use-debounce';
export const useDocument = () => {
  const { docId} = useParams();
  const documentId = Array.isArray(docId) ? docId[0] : docId;
  const [document, setDocument] = useState<Document | null>(null);
  const [debouncedDocument] = useDebounce(document, 300);
  const router = useRouter();
  useEffect(() => {
    const updateDocument = async () => {
      if (!debouncedDocument) return;
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: debouncedDocument.title,
          content: debouncedDocument.content,
        }),
      });
      if (!res.ok) {
        return;
      }
      // Update the navbar
      router.refresh();
    };
    updateDocument();
  }, [debouncedDocument, documentId, router]);


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
  const content = document?.content || "";
  const setContent = (newContent: string) => {
    if (document === null) return;
    setDocument({
      ...document,
      // content: newContent,
      content: content + "\n" + newContent,
    });
  };
  return {
    documentId,
    document,
    title,
    setTitle,
    content,
    setContent,
  };
};
