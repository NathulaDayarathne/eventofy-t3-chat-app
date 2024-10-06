import { HydrateClient } from "~/trpc/server";
import { AI } from "~/lib/chat/actions";
import {nanoid} from "~/lib/utils";
import Chat from "~/components/chat/Chat";


export default async function Home(){

    const id = nanoid()

    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                    <AI initialAIState={{ chatId: id, messages: [] }}>
                        <Chat id={id}  missingKeys={[]} />
                    </AI>
                    {/* <LatestPost /> */}
                </div>
            </main>
        </HydrateClient>
    );
}
