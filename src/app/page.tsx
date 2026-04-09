import { ModeToggle } from "@/components/ui/toggledarkmode";
import Link from "next/dist/client/link";

export default function Home() {
  return (
    <h1 className="text-3xl text-amber-300 font-bold underline">
      Hello world!
      <ModeToggle />
      <Link href="/login">Login</Link>
    </h1>
  )
}