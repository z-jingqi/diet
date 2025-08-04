import * as React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  as?: React.ElementType;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = "p", as, ...props }, ref) => {
    const Component = as || variant;

    const variantStyles = {
      h1: "scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl",
      h2: "scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-lg font-medium tracking-tight",
      h5: "scroll-m-20 text-base font-medium tracking-tight",
      h6: "scroll-m-20 text-sm font-medium tracking-tight",
      p: "leading-relaxed text-sm [&:not(:first-child)]:mt-3",
      span: "leading-relaxed text-sm",
      div: "leading-relaxed text-sm",
    };

    return (
      <Component
        ref={ref}
        className={cn(variantStyles[variant], className)}
        {...props}
      />
    );
  },
);

Typography.displayName = "Typography";

// 预定义的文本样式组件
const Text = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("leading-relaxed text-sm [&:not(:first-child)]:mt-3", className)}
    {...props}
  />
));
Text.displayName = "Text";

const MutedText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
MutedText.displayName = "MutedText";

const ErrorText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-destructive", className)}
    {...props}
  />
));
ErrorText.displayName = "ErrorText";

const SuccessText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-green-600", className)} {...props} />
));
SuccessText.displayName = "SuccessText";

export { Typography, Text, MutedText, ErrorText, SuccessText };
