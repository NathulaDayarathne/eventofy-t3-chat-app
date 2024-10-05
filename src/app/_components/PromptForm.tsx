'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { useActions, useUIState } from 'ai/rsc'

import {UserMessage} from "~/components/message/UserMessage";
import { type AI } from '~/lib/chat/actions'
import { Button } from '~/components/shad-ui/button'
import { IconArrowElbow, IconPlus } from '~/components/icons'
import { useEnterSubmit } from '~/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'

export default function PromptForm({
                               input,
                               setInput
                           }: {
    input: string
    setInput: (value: string) => void
}) {
    const { formRef, onKeyDown } = useEnterSubmit()
    const inputRef = React.useRef<HTMLTextAreaElement>(null)
    const { submitUserMessage } = useActions()
    const [_, setMessages] = useUIState<typeof AI>()

    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    return (
        <form
            className='border border-green-500'
            ref={formRef}
            onSubmit={async (e: any) => {
                e.preventDefault()

                // Blur focus on mobile
                if (window.innerWidth < 600) {
                    e.target['message']?.blur()
                }

                const value = input.trim()
                setInput('')
                if (!value) return

                // Optimistically add user message UI
                setMessages(currentMessages => [
                    ...currentMessages,
                    {
                        id: nanoid(),
                        display: <UserMessage>{value}</UserMessage>
                    }
                ])

                // Submit and get response message
                const responseMessage = await submitUserMessage(value)
                setMessages(currentMessages => [...currentMessages, responseMessage])
            }}
        >
            <p className='bg-green-500 w-fit'>prompt-form.tsx</p>
            <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
                <Textarea
                    ref={inputRef}
                    tabIndex={0}
                    onKeyDown={onKeyDown}
                    placeholder="Send a message."
                    className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    name="message"
                    rows={1}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <div className="absolute right-0 top-[13px] sm:right-4">
                    <Button type="submit" size="icon" disabled={input === ''}>
                        <IconArrowElbow />
                        <span className="sr-only">Send message</span>
                    </Button>
                </div>
            </div>
        </form>
    )
}
