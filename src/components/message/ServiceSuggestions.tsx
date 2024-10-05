'use client'

import { Card, CardContent } from "~/components/shad-ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "~/components/shad-ui/carousel"

interface Service {
    name: string
    image: string
}

const services: Service[] = [
    { name: 'Suggestion 1', image: '/lol.jpg' },
    { name: 'Suggestion 2', image: '/lol.jpg' },
    { name: 'Suggestion 3', image: '/lol.jpg' },
    { name: 'Suggestion 4', image: '/lol.jpg' },
    { name: 'Suggestion 5', image: '/lol.jpg' },
    { name: 'Suggestion 6', image: '/lol.jpg' },
    { name: 'Suggestion 7', image: '/lol.jpg' },
    { name: 'Suggestion 8', image: '/lol.jpg' },
    { name: 'Suggestion 9', image: '/lol.jpg' }
]

export function ServiceSuggestions() {
    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-full max-w-sm m-5"
        >
            <CarouselContent>
                {services.map((service, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center p-6 bg-slate-500 rounded">
                                    {/* Display the service image */}
                                    <img
                                        src={service.image}
                                        alt={service.name}
                                        className="w-full h-32 object-cover mb-4 rounded"
                                    />
                                    {/* Display the service name */}
                                    <span className="text-sm text-center text-green-200">
                    {service.name}
                  </span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
