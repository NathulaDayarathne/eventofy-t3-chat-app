'use client'

import { cn } from "~/lib/utils"
import { Slider} from "~/components/shad-ui/slider";
import { Button } from "~/components/shad-ui/button"
import { useState } from "react"

type SliderProps = React.ComponentProps<typeof Slider>

interface BudgetSliderProps extends SliderProps {
    showSubmit?: boolean;  // Add this prop to control the submit button visibility
}

export function BudgetSlider({ className, showSubmit = true, ...props }: BudgetSliderProps) {
    const [sliderValue, setSliderValue] = useState([50])
    const minValue = 0
    const maxValue = 100000

    return (
        <div className="m-5 flex flex-col items-start space-y-4 bg-white">
            {/* Show the current value above the slider */}
            <div className="flex items-center justify-between w-[60%]">
                <span className="text-sm text-gray-500">Your Budget: {sliderValue[0]}$</span>
            </div>

            <div className="flex items-center w-full space-x-4">
                {/* Display min and max values on the sides of the slider */}
                <span className="text-sm text-gray-500">{minValue}$</span>

                <Slider
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    max={maxValue}
                    min={minValue}
                    step={1}
                    className={cn("w-[60%]", className)}
                    {...props}
                />

                <span className="text-sm text-gray-500">{maxValue}$</span>
            </div>

            {/* Conditionally render the Submit button */}
            {showSubmit && (
                <Button className="mt-4">
                    Submit
                </Button>
            )}
        </div>
    )
}

