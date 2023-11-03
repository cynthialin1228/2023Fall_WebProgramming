"use client";
import { useRef, useState, useEffect} from "react";
import { ChevronDown } from "lucide-react";
import GrowingTextarea from "@/components/GrowingTextarea";
import UserAvatar from "@/components/UserAvatar";
import { Separator } from "@/components/ui/separator";
import useTweet from "@/hooks/useTweet";
import useUserInfo from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils";

export default function ActivityInput() {
  const { handle } = useUserInfo();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { postTweet, loading } = useTweet();
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleAddActivity = async () => {
    const content = textareaRef.current?.value;
    if (!content) return;
    if (!handle) return;

    try {
      await postTweet({
        handle,
        content,
      });
      textareaRef.current.value = "";
      // this triggers the onInput event on the growing textarea
      // thus triggering the resize
      // for more info, see: https://developer.mozilla.org/en-US/docs/Web/API/Event
      textareaRef.current.dispatchEvent(
        new Event("input", { bubbles: true, composed: true }),
      );
    } catch (e) {
      console.error(e);
      alert("Error posting tweet");
    }
  };
  const activityInputRef = useRef<HTMLDivElement>(null);
  const addActivityButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activityInputRef.current && 
        !activityInputRef.current.contains(event.target as Node) &&
        addActivityButtonRef.current !== event.target
      ) {
        setShowAddActivity(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
      showAddActivity? 
      <>
      <div className="flex gap-4 top-0 right-0 px-4" ref={activityInputRef}>
      <UserAvatar className="h-12 w-12" />
      <div className="flex w-full flex-col px-2">
        <div className="mb-2 mt-6">
          <GrowingTextarea
            ref={textareaRef}
            className="bg-transparent outline-none placeholder:text-gray-500"
            placeholder="Want to add event?"
          />
        </div>
        <Separator />
        <div className="flex justify-end">
          <button
            className={cn(
              "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
              "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
            )}
            onClick={handleAddActivity}
            disabled={loading}
            ref={addActivityButtonRef}
          >
            Add Activity
          </button>
        </div>
      </div>
    </div>
    </> : <>
      <button 
        onClick={() => setShowAddActivity(true)}
        className = "py-2 px-4 bg-green-500 text-white rounded"
      >新增活動</button></>
  );
}
