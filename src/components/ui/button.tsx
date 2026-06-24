import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import { motion } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:shadow-[0_0_30px_rgba(168,85,247,0.9)] hover:bg-primary/90 border border-primary/50",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_0_15px_rgba(239,68,68,0.4)]",
        outline:
          "border border-primary/40 bg-background/40 backdrop-blur-md hover:bg-primary/20 hover:text-primary shadow-[0_0_10px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[0_0_15px_rgba(217,70,239,0.4)]",
        ghost: "hover:bg-primary/20 hover:text-primary hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 text-glow-purple",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      )
    }

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props as any}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
