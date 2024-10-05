import * as React from 'react'
import  PromptForm  from './PromptForm'

export interface ChatPanelProps {
    id?: string
    title?: string
    input: string
    setInput: (value: string) => void
    isAtBottom: boolean
    scrollToBottom: () => void
}

export default function ChatPanel({
                              id,
                              title,
                              input,
                              setInput,
                              isAtBottom,
                              scrollToBottom
                          }: ChatPanelProps) {
    return (
        <div className="border border-red-600 rounded-3xl  fixed bottom-0 w-full mx-auto text-black">
            <p className="text-center w-fit bg-red-600">chat-panel.tsx</p>
            <div className="mx-auto sm:max-w-2xl sm:px-4">
                <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
                    <PromptForm input={input} setInput={setInput} />
                </div>
            </div>
        </div>
    )
}
