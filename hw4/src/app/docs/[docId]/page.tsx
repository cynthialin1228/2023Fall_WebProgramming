"use client";

import { useState } from "react";
import { useDocument } from "@/hooks/useDocument";

function DocPage() {
  const { title, setTitle, content, setContent } = useDocument();
  const [textareaValue, setTextareaValue] = useState("");
  const handleButtonClick = () => {
    setContent(textareaValue); // Append the textarea value to the content array
    setTextareaValue(""); // Optionally clear the textarea after adding the content
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents the default action of the enter key (e.g., form submission)
      handleButtonClick();
    }
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
      <section className="w-full px-4 py-4 rounded" style={{ whiteSpace: 'pre-wrap' }}>
        <text>{content}</text>
      </section>

      <div className="border rounded flex w-full px-4 py-4">
        <input
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            className="rounded w-full outline-0"
            onKeyDown={handleKeyDown}
            placeholder="Enter content here and click enter to save"
        />
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={handleButtonClick}
        >
          Send
        </button>
      </div>
      {/* <section className="w-full px-4 py-4">
        <textarea
          value={content || ""}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          className="h-[90vh] w-full outline-0 "
        />
      </section> */}
      </div>
    )
}

export default DocPage;
