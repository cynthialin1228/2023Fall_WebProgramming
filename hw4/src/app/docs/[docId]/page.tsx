"use client";
import { auth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { useDocument } from "@/hooks/useDocument";
import { redirect } from "next/navigation";
import { publicEnv } from "@/lib/env/public";
import MessageComponent from "@/components/MessageComponent";
function DocPage() {
  const {document, title, setTitle, updateUserDocument, messages, userId} = useDocument();
  const [textareaValue, setTextareaValue] = useState("");
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      updateUserDocument(textareaValue);
      setTextareaValue(""); // Clear the textarea after adding the content
    }
  };
  return (
    <div className="flex flex-col h-screen justify-between">
      <nav className="sticky top-0 flex w-full justify-between p-2 shadow-sm">
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        placeholder="Document Title"
        className="rounded-lg px-2 py-1 text-slate-700 outline-0 focus:bg-slate-100"
        />
        </nav>
        <section className="w-full px-4 py-4 overflow-auto">
          {messages.map((message) => (
            <MessageComponent
              key={message.id}
              message={message}
              userId={userId? userId : ""}
            />
          ))}
        </section>
        <div className="border rounded flex w-full px-4 py-4">
        <input
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          onKeyDown={handleKeyDown} // Listen for key down
          className="rounded w-full outline-0"
          placeholder="Enter your message here"
        />
      </div>
    </div>
    )
}

export default DocPage;
