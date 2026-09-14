import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-wide",
  {
    variants: {
      tone: {
        default: "border-border bg-surface-2 text-muted",
        accent: "border-transparent bg-accent/15 text-accent",
        combat: "border-transparent bg-combat/15 text-combat",
        peace: "border-transparent bg-peace/15 text-peace",
        warn: "border-transparent bg-warn/15 text-warn",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
