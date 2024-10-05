//@ts-nocheck
"use client"

import {IconOpenAI} from '~/components/icons'
import {cn} from '~/lib/utils'
import {CodeBlock} from "~/components/codeBlock";
import {MemoizedReactMarkdown} from '../markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import {StreamableValue} from 'ai/rsc'
import {useStreamableText} from '~/lib/hooks/use-streamable-text'

export default function BotMessage({
                                       content,
                                       className
                                   }: {
    content: string | StreamableValue<string>
    className?: string
}) {
    const text = useStreamableText(content)

    return (
        <div
            className={cn(
                'group relative flex items-start md:-ml-12 border border-orange-600',
                className
            )}
        >
            <p className="w-fit bg-orange-600">&lt;BotMessage&#47;&gt;</p>
            <div
                className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
                <IconOpenAI/>
            </div>
            <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
                <MemoizedReactMarkdown
                    className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                    remarkPlugins={[remarkGfm, remarkMath]}
                    components={{
                        p({children}) {
                            return <p className="mb-2 last:mb-0">{children}</p>
                        },
                        code({node, inline, className, children, ...props}) {
                            if (children.length) {
                                if (children[0] == '▍') {
                                    return (
                                        <span className="mt-1 animate-pulse cursor-default">▍</span>
                                    )
                                }

                                children[0] = (children[0] as string).replace('`▍`', '▍')
                            }

                            const match = /language-(\w+)/.exec(className || '')

                            if (inline) {
                                return (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                )
                            }

                            return (
                                <CodeBlock
                                    key={Math.random()}
                                    language={(match && match[1]) || ''}
                                    value={String(children).replace(/\n$/, '')}
                                    {...props}
                                />
                            )
                        }
                    }}
                >
                    {text}
                </MemoizedReactMarkdown>
            </div>
        </div>
    )
}