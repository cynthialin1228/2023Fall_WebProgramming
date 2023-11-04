import Image from "next/image";
import Link from "next/link";

import larry from "@/assets/larry.png";

import ProfileButton from "./ProfileButton";

export default function Header() {
  return (
    // aside is a semantic html tag for side content
    <aside className="flex h-screen flex-col justify-between px-6 py-6">
      <div className="flex flex-col gap-2">
        <div className="p-2">
          <Link href="/">
            <Image src={larry} alt="Larry the bird" width={40} height={40} />
          </Link>
        </div>
        </div>
      <ProfileButton />
    </aside>
  );
}
