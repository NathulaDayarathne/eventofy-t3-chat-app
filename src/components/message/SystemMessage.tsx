export default function SystemMessage({ children }: { children: React.ReactNode }) {
    return (
        <div
            className={
                'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500 border border-cyan-600'
            }
        >
            <p className="w-fit bg-cyan-600">&lt;SystemMessage&#47;&gt;</p>
            <div className={'max-w-[600px] flex-initial p-2'}>{children}</div>
        </div>
    )
}