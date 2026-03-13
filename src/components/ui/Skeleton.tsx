import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export interface SkeletonTextProps extends React.ComponentProps<"div"> {
  lines?: number;
  lineHeight?: string;
}

function SkeletonText({ className, lines = 1, lineHeight = "1rem", ...props }: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="w-full" style={{ height: lineHeight }} />
      ))}
    </div>
  );
}

function SkeletonCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <Skeleton className="h-40 w-full rounded-lg" />
      <SkeletonText lines={2} lineHeight="1.25rem" />
      <SkeletonText lines={1} lineHeight="1rem" />
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonCard };
