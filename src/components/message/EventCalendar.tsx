"use client"
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/shad-ui/button";
import { Calendar } from "~/components/shad-ui/calendar";

function EventCalendar() {
    const [date, setDate] = React.useState<Date>();
    const [submittedDate, setSubmittedDate] = React.useState<Date | null>(null);

    const handleSubmit = () => {
        if (date) {
            setSubmittedDate(date);
            // You can handle the date submission logic here
            console.log("Selected date:", date);
        }
    };

    return (
        <div className="flex flex-col items-start space-y-4">
            <Button
                variant={"outline"}
                className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
            />
            <Button onClick={handleSubmit}  className="mt-4">
                Submit
            </Button>
            {submittedDate && (
                <div className="mt-4 text-green-600">
                    Date Selected Succesfully! Date: {format(submittedDate, "PPP")}
                    Press Enter to continue.
                </div>
            )}
        </div>
    );
}

export default EventCalendar;