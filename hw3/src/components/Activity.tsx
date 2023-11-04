import Link from "next/link";
import {Check} from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
export default function Activity({
  username,
  handle,
  id,
  content,
  likes,
  liked,
}: TweetProps) {
  return (
    <>
      <Link
        className="w-full px-4 pt-3 transition-colors hover:bg-gray-50"
        href={{
          pathname: `/tweet/${id}`,
          query: {
            username,
            handle,
          },
        }}
      >
        <div className="px-4 flex gap-4">
          <article className="flex grow flex-col">
            <article className="mt-2 whitespace-pre-wrap">{content}</article>
            <div className="my-2 flex items-center justify-between gap-4 text-gray-400">
              {
                likes>0 ? (
                <>{likes}人參加</>
                ) : (
                <>0人參加</>
                )
              }
              {liked && (
                <Check size={50} />)  
              }
            </div>
          </article>
        </div>
      </Link>
      <Separator />
    </>
  );
}