import { HydrateClient } from "~/trpc/server";
import { AI } from "~/lib/chat/actions";
import {nanoid} from "~/lib/utils";
import Chat from "~/app/_components/Chat";
import Link from "next/link";


export default async function Home(){

const id = nanoid()

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">

            <p className="text-6xl text-center">
                Hi there! 👋  Let's plan your next event together!
            </p>
            <Link href={"/chat"} className="rounded-full bg-white text-black px-6 py-3  ">
                Start Now
            </Link>


        </div>
      </main>
    </HydrateClient>
  );
}
