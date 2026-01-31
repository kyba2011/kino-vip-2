"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const GlassTabs = TabsPrimitive.Root;

const GlassTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-full p-1 text-muted-foreground",
      "bg-black/40 backdrop-blur-[0.0px] backdrop-saturate-150 border border-white/10",
      "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]",
      className,
    )}
    {...props}
  />
));
GlassTabsList.displayName = TabsPrimitive.List.displayName;

const GlassTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-2 text-sm font-medium ring-offset-background transition-all",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "text-white/70 hover:text-white hover:bg-white/10",
      "data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-sm",
      className,
    )}
    {...props}
  />
));
GlassTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const GlassTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
GlassTabsContent.displayName = TabsPrimitive.Content.displayName;

export { GlassTabs, GlassTabsList, GlassTabsTrigger, GlassTabsContent };
