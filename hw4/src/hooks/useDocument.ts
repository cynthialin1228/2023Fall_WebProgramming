import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Document } from "@/lib/types/db";

export const useDocument = () => {
  const { docId} = useParams();
  const documentId = Array.isArray(docId) ? docId[0] : docId;
  const [document, setDocument] = useState<Document | null>(null);
  const router = useRouter();
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
  return {
    documentId,
    document,
  };
};
