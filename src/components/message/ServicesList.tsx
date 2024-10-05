'use client'

import {Button} from '~/components/shad-ui/button'
import {Checkbox} from '~/components/shad-ui/checkbox'

interface Service {
    name: string
}

const services: Service[] = [
    {name: 'Photography'},
    {name: 'Music'},
    {name: 'Venue'},
    {name: 'Dancing'},
    {name: 'Transport'},
    {name: 'Transport'},
    {name: 'Transport'},
    {name: 'Transport'},
    {name: 'Transport'}
]

export function ServicesList() {
    return (
        <div className="relative min-h-[400px]">
            <div className="grid grid-cols-3 gap-4">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="p-2 border rounded bg-green-100 text-black text-sm m-5"
                    >
                        <div>{service.name}</div>
                        <div>
                            <Checkbox className="bg-red-300"/>
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-4 right-4">
                <Button>Proceed</Button>
            </div>
        </div>
    )
}
