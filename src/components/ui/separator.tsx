// src/components/ui/separator.tsx
import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(({ className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`shrink-0 bg-border h-[1px] w-full ${className}`}
      {...props}
    />
  );
});

Separator.displayName = "Separator";

export default Separator;
