"use client";
import { useRef, useState, useEffect} from "react";
import { ChevronDown } from "lucide-react";
import GrowingTextarea from "@/components/GrowingTextarea";
import UserAvatar from "@/components/UserAvatar";
import { Separator } from "@/components/ui/separator";
import useTweet from "@/hooks/useTweet";
import useUserInfo from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils";
import { set } from "zod";
import { useRouter } from "next/navigation";
export default function ActivityInput() {
  const router = useRouter();
  const { handle } = useUserInfo();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
  const { postTweet, loading } = useTweet();
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const isValidDateTime = (dateTime: string) => {
    const d = dateTime.split(" ")[0];
    const t = (dateTime.split(" ")[1]);
    let T = parseInt(t);
    const D = new Date(d);
    if (D.toString() === "Invalid Date") {
      return false;
    }
    if (t.length !== 2) {
      return false;
    }
    if (T < 0 || T > 23) {
      return false;
    }
    return true;
  };

  const handleAddActivity = async () => {
    const content = textareaRef.current?.value;
    const startTime = startTimeRef.current?.value;
    const endTime = endTimeRef.current?.value;
    if (!content || !startTime || !endTime || !handle) {
      alert("Please fill in all required fields: activity name, start date and time, and end date and time.");
      return;
    }
    
    if (!isValidDateTime(startTime) || !isValidDateTime(endTime)) {
      alert("The date and time format is invalid. Please use the format YYYY-MM-DD HH.");
      return;
    }
    const s_date = startTime.split(" ")[0];
    const s_time = startTime.split(" ")[1];
    const e_date = endTime.split(" ")[0];
    const e_time = endTime.split(" ")[1];
    const startDateTime = new Date(`${s_date}T${s_time}:00:00`);
    const endDateTime = new Date(`${e_date}T${e_time}:00:00`);
    console.log(startDateTime);
    console.log(endDateTime);
    const diff = endDateTime.getTime() - startDateTime.getTime();
    if (diff / (1000 * 60 * 60) > 168 || diff / (1000 * 60 * 60) < 0 ){
      alert("The start and end time must be within 7 days of each other.");
      return;
    }

    try {
      const res = await postTweet({
        handle,
        content,
        startTime,
        endTime,
      });
      textareaRef.current.value = "";
      // this triggers the onInput event on the growing textarea
      // thus triggering the resize
      // for more info, see: https://developer.mozilla.org/en-US/docs/Web/API/Event
      textareaRef.current.dispatchEvent(
        new Event("input", { bubbles: true, composed: true }),
      );
      startTimeRef.current.value = "";
      endTimeRef.current.value = "";
      setShowAddActivity(false);
      router.push(`/tweet/${res}`);
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
        <div className="mb-2 mt-6">
          <h1>start time</h1>
          <input
            ref={startTimeRef}
            className="bg-transparent outline-none placeholder:text-gray-500"
            placeholder="YYYY-MM-DD HH (0~23)"
            type="text"
            onChange={(e) => setStartTime(e.target.value)}
          />  
        </div>
        <div className="mb-2 mt-6">
          <h1>end time</h1>
          <input
            ref={endTimeRef}
            className="bg-transparent outline-none placeholder:text-gray-500"
            placeholder="YYYY-MM-DD HH (0~23)"
            type="text"
            onChange={(e) => setEndTime(e.target.value)}
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
