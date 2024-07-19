'use client'
import { Tag_human, Tag_tiger } from "@/lib/constant";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Home() {
  return (
    <>
     <Link href={'/gameroom/' + Tag_tiger}>Tiger</Link>
     <Link href={'/gameroom/' + Tag_human}>Human</Link>
     <div>
      <input type="text" placeholder="房间号" />
      <button onClick={() => {
        // redirect('')
      }}>进入</button>
     </div>
      {/* <Link href={'/rooms'}>浏览房间</Link> */}
    </>
  );
}
