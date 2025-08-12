"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function AssetAllocationForm() {
    const [date, setDate] = React.useState<Date>()

    return (
        <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="desktopLaptop">Desktop/Laptop</Label>
                  <Input id="desktopLaptop" placeholder="e.g. MacBook Pro" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assetTag">Asset Tag</Label>
                  <Input id="assetTag" placeholder="e.g. ASSET-123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monitor1">Monitor 1</Label>
                  <Input id="monitor1" placeholder="e.g. Dell U2721DE" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monitor2">Monitor 2</Label>
                  <Input id="monitor2" placeholder="e.g. Dell U2721DE" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="webcam">Webcam/D.Station</Label>
                  <Input id="webcam" placeholder="e.g. Logitech C920" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headphone">Headphone</Label>
                  <Input id="headphone" placeholder="e.g. Sony WH-1000XM4" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bagMouse">Bag/Mouse</Label>
                  <Input id="bagMouse" placeholder="e.g. Logitech MX Master 3" />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="allocationDate">Allocation Date</Label>
                   <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>
    )
}
