'use client'

import {Button} from '~/components/shad-ui/button'
import {BudgetSlider} from "~/components/message/BudgetSlider";

interface Service {
    name: string
}

const services: Service[] = [
    {name: 'Photography'},
    {name: 'Music'},
    {name: 'Venue'},
    {name: 'Dancing'},
    {name: 'Floral'},
    {name: 'Transport'},
    {name: 'Transport'},
    {name: 'Transport'},
    {name: 'Transport'}
]

export function AllocateBudget() {
    return (
        <div className="relative min-h-[400px] pb-20">
            <div>
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="p-2 border rounded bg-green-500 text-black text-sm m-5"
                    >
                        <div>{service.name}</div>
                        <div><><BudgetSlider showSubmit={false}/></>
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <Button className='bg-red-400'>Proceed</Button>
            </div>
        </div>
    )
}
