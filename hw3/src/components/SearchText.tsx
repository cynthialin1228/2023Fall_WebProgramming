"use client";
import React, { useState, useEffect } from 'react';
import Activity from "@/components/Activity";
type SearchTextProps = {
  searchText: string // Prop to send the search text back to the parent component
  activities: {
    id: number;
    content: string;
    username: string;
    handle: string;
    likes: number;
    createdAt: Date | null;
    liked: boolean;
}[]
    username?: string;
    handle?: string;
};

const SearchText: React.FC<SearchTextProps> = ( {searchText, activities, username, handle}:SearchTextProps) => {
  const [text, setText] = useState("");

    useEffect(() => {
        searchText = text;
    }, [text]);
    const handleClickSearch = () => {
        searchText = text;
    };
  return (
    <>
    <div className="flex justify-between items-center mb-4">
      <input
        value={text}
        onChange={(e) => {
            setText(e.target.value);
          }}
        placeholder="Search for activities"
        className="border p-2 rounded"
      />
      <button onClick={handleClickSearch}>Search</button>
    </div>
    {(activities && activities.filter(
        (activity) => activity.content.toLowerCase().includes(text.toLowerCase())
        )).map((activity) => (
          // console.log("activities = ",activities),
          // console.log("activity = ",activity),
        <Activity
          key={activity.id}
          id={activity.id}
          username={username}
          handle={handle}
          authorName={activity.username}
          authorHandle={activity.handle}
          content={activity.content}
          likes={activity.likes}
          liked={activity.liked}
          createdAt={activity.createdAt!}
        />
      ))}
    </>
  );
};

export default SearchText;