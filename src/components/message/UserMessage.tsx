import {IconUser} from "~/components/icons";

export function UserMessage({ children }: { children: React.ReactNode }) {
    return (
        <div className="group relative flex items-start md:-ml-12 border border-indigo-600">
            <p className="w-fit bg-indigo-600">&lt;UserMessage&#47;&gt;</p>
            <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
                <IconUser />
            </div>
            <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
                {children}
            </div>
        </div>
    )
}