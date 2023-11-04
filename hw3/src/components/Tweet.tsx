import { Separator } from "@/components/ui/separator";

import TimeText from "./TimeText";

type TweetProps = {
  username?: string;
  handle?: string;
  id: number;
  authorName: string;
  authorHandle: string;
  content: string;
  likes: number;
  createdAt: Date;
  liked?: boolean;
};

// note that the Tweet component is also a server component
// all client side things are abstracted away in other components
export default function Tweet({
  authorName,
  authorHandle,
  content,
  createdAt,
}: TweetProps) {
  return (
    <>
        <div className="flex w-full px-4 pt-3 gap-4">
          <article className="flex grow flex-col">
            <p className="font-bold">
              {authorName}
              <span className="ml-2 font-normal text-gray-400">
                @{authorHandle}
              </span>
              <time className="ml-2 font-normal text-gray-400">
                <TimeText date={createdAt} format="h:mm A · D MMM YYYY" />
              </time>
            </p>
            <article className="mt-2 whitespace-pre-wrap">{content}</article>
          </article>
        </div>
      <Separator />
    </>
  );
}
