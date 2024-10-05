import 'server-only'

import {createAI, createStreamableValue, getMutableAIState, streamUI} from 'ai/rsc'
import {openai} from '@ai-sdk/openai'

import BotMessage from "~/components/message/BotMessage";

import BotCard from "~/components/message/BotCard";

import {z} from 'zod'

import {nanoid,} from "~/lib/utils";
import {type Message} from '~/lib/types'
import {SpinnerMessage} from "~/components/message/SpinnerMessage";
import {ProvinceSelector} from "~/components/message/Provinces";
import EventCalendar from "~/components/message/EventCalendar";
import {BudgetSlider} from "~/components/message/BudgetSlider";
import {ServicesList} from "~/components/message/ServicesList";
import {AllocateBudget} from "~/components/message/AllocateBudget";
import React from "react";
import {ServiceSuggestions} from "~/components/message/ServiceSuggestions";


// Submit user message
async function submitUserMessage(content: string) {
    'use server'

    const aiState = getMutableAIState<typeof AI>()

    aiState.update({
        ...aiState.get(),
        messages: [
            ...aiState.get().messages,
            {
                id: nanoid(),
                role: 'user',
                content
            }
        ]
    })

    let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
    let textNode: undefined | React.ReactNode

    const result = await streamUI({
        model: openai('gpt-3.5-turbo'),
        initial: <SpinnerMessage/>,
        system: `
    your name is maha pakaya. you are a event planning chatbot. your duty is to collect important details from user about the event. after the first message by the user, you should introduce very shortly to the user. then ask the users name. don't continue the conversation until user gives his/her name. after they provided the name you should call him/her by the name. then ask about the date they are planning to get the event. like wise ask all the next questions one by one don't continue to the next question until user provides a valid answer, like wise ask the user to describe a theme. Then ask them to provide the guest count, budget and province user planning to have the event. after collecting all the details return a short description about the event with provided details[VERY IMPORTANT MUST DO]. after collecting all the neccessary details return the summary and ask for the conformation of the summary.

Messages inside [] indicate a UI element or a user event. For example:
- "[User has entered the event name: Birthday Party]" means the user has provided the event name.
- "[User has selected the date: 2023-12-25]" means the user has chosen a date for the event.

Guide the user through these steps to collect all the necessary information for planning their event.

If the user wants to select the date, call \`selectDate\`.
    If the user wants to select a theme, call \`SelectTheme\`.
    If the user just wants enter guest count, call \`guest_count\` to show the price.
    If you want to set the budget, call \`setBudget\`.


If the user provides any of these details out of order, accept them and proceed to ask for the next missing information.

You can also chat with the user, offer suggestions, or answer any questions related to event planning.

Remember to be polite, engaging, and helpful throughout the conversation.
`,
        messages: [
            ...aiState.get().messages.map((message: any) => ({
                role: message.role,
                content: message.content,
                name: message.name
            }))
        ],
        text: ({content, done, delta}) => {
            if (!textStream) {
                textStream = createStreamableValue('')
                textNode = <BotMessage content={textStream.value}/>
            }

            if (done) {
                textStream.done()
                aiState.done({
                    ...aiState.get(),
                    messages: [
                        ...aiState.get().messages,
                        {
                            id: nanoid(),
                            role: 'assistant',
                            content
                        }
                    ]
                })
            } else {
                textStream.update(delta)
            }

            return textNode
        },
        tools: {
            //1) Tool to get the user's location
            selectProvince: {
                description:
                    'Show provinces to user to select from. show this if user wants to select a province or location for the event.',
                parameters: z.object({
                    province: z
                        .string()
                        .optional()
                        .describe('The name of the province selected by the user.')
                }),
                generate: async function* ({province}) {
                    const toolCallId = nanoid()

                    // Update state with the selected province
                    if (province) {
                        aiState.done({
                            ...aiState.get(),
                            messages: [
                                ...aiState.get().messages,
                                {
                                    id: nanoid(),
                                    role: 'assistant',
                                    content: [
                                        {
                                            type: 'tool-call',
                                            toolName: 'selectProvince',
                                            toolCallId,
                                            args: {province}
                                        }
                                    ]
                                },
                                {
                                    id: nanoid(),
                                    role: 'tool',
                                    content: [
                                        {
                                            type: 'tool-result',
                                            toolName: 'selectProvince',
                                            toolCallId,
                                            result: {province}
                                        }
                                    ]
                                }
                            ]
                        })
                    }

                    // Render the ProvinceSelector component inside BotCard
                    return (
                        <BotCard>
                            <ProvinceSelector/>
                        </BotCard>
                    )
                }
            },

            //2) Tool to get the event DATE input
            selectDate: {
                description:
                    'Show a date picker to the user. Use this when the user needs to pick a date for the event.',
                parameters: z.object({
                    selectedDate: z
                        .string()
                        .optional()
                        .describe('The date selected by the user. Format: YYYY-MM-DD')
                }),
                generate: async function* ({selectedDate}) {
                    const toolCallId = nanoid()

                    // Update state with the selected date
                    if (selectedDate) {
                        aiState.done({
                            ...aiState.get(),
                            messages: [
                                ...aiState.get().messages,
                                {
                                    id: nanoid(),
                                    role: 'assistant',
                                    content: [
                                        {
                                            type: 'tool-call',
                                            toolName: 'selectDate',
                                            toolCallId,
                                            args: {selectedDate}
                                        }
                                    ]
                                },
                                {
                                    id: nanoid(),
                                    role: 'tool',
                                    content: [
                                        {
                                            type: 'tool-result',
                                            toolName: 'selectDate',
                                            toolCallId,
                                            result: {selectedDate}
                                        }
                                    ]
                                }
                            ]
                        })
                    }

                    // Render the DatePicker component inside BotCard
                    return (
                        <BotCard>
                            <EventCalendar/>
                        </BotCard>
                    )
                }
            },

            //3) Tool to get the user’s budget input
            setBudget: {
                description: 'Get the user’s budget input.',
                parameters: z.object({
                    budget: z.number().describe('The budget entered by the user')
                }),
                generate: async function* ({budget}) {
                    const toolCallId = nanoid()

                    aiState.done({
                        ...aiState.get(),
                        messages: [
                            ...aiState.get().messages,
                            {
                                id: nanoid(),
                                role: 'assistant',
                                content: [
                                    {
                                        type: 'tool-call',
                                        toolName: 'budgetTool',
                                        toolCallId,
                                        args: {budget}
                                    }
                                ]
                            },
                            {
                                id: nanoid(),
                                role: 'tool',
                                content: [
                                    {
                                        type: 'tool-result',
                                        toolName: 'budgetTool',
                                        toolCallId,
                                        result: {budget}
                                    }
                                ]
                            }
                        ]
                    })

                    return (
                        <BotCard>
                            <BudgetSlider/>
                        </BotCard>
                    )
                }
            },

            //4) Get the user’s service choice input
            listServices: {
                description: 'Get the user’s service choice input.',
                parameters: z.object({
                    service: z.string().describe('The service selected by the user')
                }),
                generate: async function* ({service}) {
                    const toolCallId = nanoid()

                    // Update the aiState with the selected service and result message
                    aiState.done({
                        ...aiState.get(),
                        messages: [
                            ...aiState.get().messages,
                            {
                                id: nanoid(),
                                role: 'assistant',
                                content: [
                                    {
                                        type: 'tool-call',
                                        toolName: 'listServicesTool',
                                        toolCallId,
                                        args: {service}
                                    }
                                ]
                            },
                            {
                                id: nanoid(),
                                role: 'tool',
                                content: [
                                    {
                                        type: 'tool-result',
                                        toolName: 'listServicesTool',
                                        toolCallId,
                                        result: {service}
                                    }
                                ]
                            }
                        ]
                    })

                    // Render the `ServicesList` component for the user to select a service
                    return (
                        <BotCard>
                            {/* add the component related to choosing services here */}
                            <ServicesList/>
                        </BotCard>
                    )
                }
            },

            //5) Allocate the budget for different services
            allocateBudget: {
                description:
                    'Allows the user to allocate a budget for different services.',
                parameters: z.object({
                    services: z
                        .array(z.string())
                        .describe('List of services to allocate a budget for')
                }),
                generate: async function* ({services}) {
                    const toolCallId = nanoid()

                    // Update AI state with the tool call information
                    aiState.done({
                        ...aiState.get(),
                        messages: [
                            ...aiState.get().messages,
                            {
                                id: nanoid(),
                                role: 'assistant',
                                content: [
                                    {
                                        type: 'tool-call',
                                        toolName: 'allocateBudgetTool',
                                        toolCallId,
                                        args: {services}
                                    }
                                ]
                            },
                            {
                                id: nanoid(),
                                role: 'tool',
                                content: [
                                    {
                                        type: 'tool-result',
                                        toolName: 'allocateBudgetTool',
                                        toolCallId,
                                        result: {services}
                                    }
                                ]
                            }
                        ]
                    })

                    // Return the AllocateBudget component for user interaction
                    return (
                        <BotCard>
                            <AllocateBudget/>
                        </BotCard>
                    )
                }
            },

            // 6) Display service suggestions
            serviceSuggestionsTool: {
                description: 'Displays suggestions for services with images.',
                parameters: z.object({
                    services: z.array(z.string()).describe('List of service suggestions')
                }),
                generate: async function* ({services}) {
                    const toolCallId = nanoid()

                    // Update AI state with the tool call information
                    aiState.done({
                        ...aiState.get(),
                        messages: [
                            ...aiState.get().messages,
                            {
                                id: nanoid(),
                                role: 'assistant',
                                content: [
                                    {
                                        type: 'tool-call',
                                        toolName: 'serviceSuggestionsTool',
                                        toolCallId,
                                        args: {services}
                                    }
                                ]
                            },
                            {
                                id: nanoid(),
                                role: 'tool',
                                content: [
                                    {
                                        type: 'tool-result',
                                        toolName: 'serviceSuggestionsTool',
                                        toolCallId,
                                        result: {services}
                                    }
                                ]
                            }
                        ]
                    })

                    // Return the ServiceSuggestions component for user interaction
                    return (
                        <BotCard>
                            <ServiceSuggestions/>
                        </BotCard>
                    )
                }
            }
        }
    })

    return {
        id: nanoid(),
        display: result.value
    }
}

export type AIState = {
    chatId: string
    messages: Message[]
}

export type UIState = {
    id: string
    display: React.ReactNode
}[]

// Create AI
export const AI = createAI<AIState, UIState>({
    actions: {
        submitUserMessage,
    },
    initialUIState: [],
    initialAIState: {chatId: nanoid(), messages: []}
})


// async function confirmPurchase(symbol: string, price: number, amount: number) {
//     'use server'
//
//     const aiState = getMutableAIState<typeof AI>()
//
//     const purchasing = createStreamableUI(
//         <div className="inline-flex items-start gap-1 md:items-center">
//             {spinner}
//             <p className="mb-2">
//                 Purchasing {amount} ${symbol}...
//             </p>
//         </div>
//     )
//
//     const systemMessage = createStreamableUI(null)
//
//     runAsyncFnWithoutBlocking(async () => {
//         await sleep(1000)
//
//         purchasing.update(
//             <div className="inline-flex items-start gap-1 md:items-center">
//                 {spinner}
//                 <p className="mb-2">
//                     Purchasing {amount} ${symbol}... working on it...
//                 </p>
//             </div>
//         )
//
//         await sleep(1000)
//
//         purchasing.done(
//             <div>
//                 <p className="mb-2">
//                     You have successfully purchased {amount} ${symbol}. Total cost:{' '}
//                     {formatNumber(amount * price)}
//                 </p>
//             </div>
//         )
//
//         systemMessage.done(
//             <SystemMessage>
//                 You have purchased {amount} shares of {symbol} at ${price}. Total cost ={' '}
//                 {formatNumber(amount * price)}.
//             </SystemMessage>
//         )
//
//         aiState.done({
//             ...aiState.get(),
//             messages: [
//                 ...aiState.get().messages,
//                 {
//                     id: nanoid(),
//                     role: 'system',
//                     content: `[User has purchased ${amount} shares of ${symbol} at ${price}. Total cost = ${
//                         amount * price
//                     }]`
//                 }
//             ]
//         })
//     })
//
//     return {
//         purchasingUI: purchasing.value,
//         newMessage: {
//             id: nanoid(),
//             display: systemMessage.value
//         }
//     }
// }
