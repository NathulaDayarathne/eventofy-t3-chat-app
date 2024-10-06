'use client'

import { cn } from '~/lib/utils'
import { ChatList} from "~/components/chat/ChatList";  
import ChatPanel from "~/components/chat/ChatPanel";
import EmptyScreen from "~/components/chat/EmptyScreen";
import { useEffect, useState } from 'react'
import { useUIState } from 'ai/rsc'
import { Message, Session } from '~/lib/types'
import { useScrollAnchor } from '~/lib/hooks/use-scroll-anchor'
import { toast } from 'sonner'

export interface ChatProps extends React.ComponentProps<'div'> {
    initialMessages?: Message[]
    id?: string
    session?: Session
    missingKeys: string[]
}

export default function Chat({ id, className, session, missingKeys }: ChatProps) {
    const [input, setInput] = useState('')
    const [messages] = useUIState()

    // Check for missing environment variables and display a toast if any are missing.
    useEffect(() => {
        missingKeys.map(key => {
            toast.error(`Missing ${key} environment variable!`)
        })
    }, [missingKeys])

    const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
        useScrollAnchor()

    return (
        <div
            className="group w-full border border-blue-600 overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
            ref={scrollRef}
        >
            <p className="w-fit bg-blue-600">chat.tsx</p>
            <div
                className={cn('pb-[200px] pt-4 md:pt-10', className)}
                ref={messagesRef}
            >
                {messages.length ? (
                    <ChatList messages={messages} isShared={false} session={session} />
                ) : (
                    <EmptyScreen />
                )}
                <div className="w-full h-px" ref={visibilityRef} />
            </div>
            <ChatPanel
                id={id}
                input={input}
                setInput={setInput}
                isAtBottom={isAtBottom}
                scrollToBottom={scrollToBottom}
            />
        </div>
    )
}
