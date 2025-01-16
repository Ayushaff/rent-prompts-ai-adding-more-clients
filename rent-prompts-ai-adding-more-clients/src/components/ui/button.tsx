import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utilities/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
        variant: {
          default: "bg-primary text-primary-foreground hover:bg-primary/90",
          destructive:
            "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          outline:
            "border border-input bg-secondary hover:bg-background hover:text-accent-foreground px-2 py-1 sm:py-2 sm:px-3 text-xs sm:text-sm",
          secondary:
            "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          ghost: "hover:bg-accent hover:text-accent-foreground",
          link: "text-primary underline-offset-4 hover:underline",
          dark:"bg-card text-white hover:bg-secondary",
          blue:"text-primary bg-gradient-to-br from-indigo-800 to-indigo-900 font-bold py-2 px-3 rounded text-xs sm:text-sm",
          white:"bg-primary text-indigo-600 font-bold px-1 py-1 sm:py-2 sm:px-3 rounded text-xs sm:text-sm",
          iconWhite:"bg-primary text-indigo-600 font-bold px-1 py-1 sm:py-2 sm:px-2 rounded text-xs sm:text-sm",
          red:"bg-primary text-red-600 font-bold py-2 px-3 rounded text-xs sm:text-sm",
          green: "bg-green-600 font-bold px-2 py-1 sm:py-2 sm:px-3 rounded text-xs sm:text-sm",
        },
      size: {
        default: "",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        smicon: "h-8 w-8",
        clear:'w-10 h-10'
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
