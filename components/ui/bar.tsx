import * as React from "react"

import { cn } from "@/lib/utils"

/*
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"*/

const Bar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
        <div 
            ref={ref}
            className={cn(
            "flex border shadow background-color",
            className
            )}
            {...props}
        >
        </div>
    )
  }
)
Bar.displayName = "Bar"

export { Bar }
