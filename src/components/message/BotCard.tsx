import {IconOpenAI} from "~/components/icons";
import {cn} from "~/lib/utils";

export default function BotCard({
                            children,
                            showAvatar = true
                        }: {
    children: React.ReactNode
    showAvatar?: boolean
}) {
    return (
        <div className="group relative flex items-start md:-ml-12 border border-rose-600">
            <p className="w-fit bg-rose-600">&lt;BotCard&#47;&gt;</p>
            <div
                className={cn(
                    'flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm',
                    !showAvatar && 'invisible'
                )}
            >
                <IconOpenAI />
            </div>
            <div className="ml-4 flex-1 pl-2">{children}</div>
        </div>
    )
}
