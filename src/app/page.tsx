
import { Tag_human, Tag_tiger } from "@/lib/constant";
import Link from "next/link";

export default function Home() {
  return (
    <>
     <Link href={'/gameroom/' + Tag_tiger}>Tiger</Link>
     <Link href={'/gameroom/' + Tag_human}>Human</Link>
      <Link href={'/rooms'}>浏览房间</Link>
    </>
  );
}
