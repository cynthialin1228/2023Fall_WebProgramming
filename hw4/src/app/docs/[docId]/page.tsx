"use client";

import { useState } from "react";
import { useDocument } from "@/hooks/useDocument";

function DocPage() {
  const { title, setTitle, content, setContent } = useDocument();
  const [textareaValue, setTextareaValue] = useState("");
  const handleButtonClick = () => {
    setContent(textareaValue); // Append the t extarea value to the content array
    setTextareaValue(""); // Optionally clear the textarea after adding the content
  };
  return (
    <div className="w-full">
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
      <section className="w-full px-4 py-4 rounded">
        <text>{content}</text>
      </section>

      <div className="border rounded flex w-full px-4 py-4">
        <input
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            className="rounded w-full outline-0"
            placeholder="Enter content here"
        />
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={handleButtonClick}
        >
          Save
        </button>
      </div>
      <section className="w-full px-4 py-4">
        <textarea
          value={content || ""}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          className="h-[90vh] w-full outline-0 "
        />
      </section>
      </div>
    )
}

export default DocPage;
