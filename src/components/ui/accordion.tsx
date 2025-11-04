import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-0 mb-4", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  
  React.useImperativeHandle(ref, () => triggerRef.current!);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const currentScrollY = window.scrollY;
    
    props.onClick?.(e);
    
    // Prevent any automatic scroll when opening/closing accordion
    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollY);
    });
  };
  
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={triggerRef}
        className={cn(
          "flex flex-1 items-center justify-between min-h-[44px] px-5 py-4",
          "font-cormorant text-2xl font-semibold text-foreground",
          "bg-[#FAF8F3] dark:bg-amber-950/40",
          "border-2 border-[#d4a574] dark:border-amber-700",
          "rounded-lg transition-all duration-300",
          "hover:bg-[#F5F1E8] dark:hover:bg-amber-950/60",
          "hover:border-[#b8864f] dark:hover:border-amber-600",
          "hover:scale-[1.01] hover:shadow-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
          "cursor-pointer",
          "data-[state=open]:bg-white dark:data-[state=open]:bg-slate-900",
          "data-[state=open]:rounded-b-none data-[state=open]:border-b-0",
          "[&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
        onClick={handleClick}
      >
        {children}
        <ChevronDown className="h-6 w-6 shrink-0 transition-transform duration-300 text-[#d4a574] dark:text-amber-600" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn(
      "p-5 bg-white dark:bg-slate-900",
      "border-2 border-t-0 border-[#d4a574] dark:border-amber-700",
      "rounded-b-lg",
      className
    )}>
      {children}
    </div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
