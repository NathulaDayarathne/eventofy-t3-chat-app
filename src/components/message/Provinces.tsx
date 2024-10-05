'use client'

import { useActions, useUIState } from 'ai/rsc';
import {AI} from "~/lib/chat/action";

interface Province {
    name: string;
}

const provinces: Province[] = [
    { name: 'Central Province' },
    { name: 'Eastern Province' },
    { name: 'North Central Province' },
    { name: 'Northern Province' },
    { name: 'North Western Province' },
    { name: 'Sabaragamuwa Province' },
    { name: 'Southern Province' },
    { name: 'Uva Province' },
    { name: 'Western Province' },
];

export function ProvinceSelector() {
    const [, setMessages] = useUIState<typeof AI>();
    const { submitUserMessage } = useActions();

    return (
        <div className="mb-4 flex flex-col gap-2 overflow-y-scroll pb-4 text-sm">
            {provinces.map((province) => (
                <button
                    key={province.name}
                    className="cursor-pointer flex-row gap-2 rounded-lg bg-zinc-800 p-2 text-left hover:bg-zinc-700"
                    onClick={async () => {
                        const response = await submitUserMessage(
                            `View province: ${province.name}`
                        );
                        setMessages((currentMessages) => [...currentMessages, response]);
                    }}
                >
                    <div className="text-xl text-white flex w-full flex-row justify-center rounded-md bg-white/10 p-2">
                        {province.name}
                    </div>
                </button>
            ))}
        </div>
    );
}