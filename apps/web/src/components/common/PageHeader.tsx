import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  centered?: boolean;
}

export function PageHeader({
  title,
  description,
  centered = true,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <section
      className={cn("py-20 md:py-32 bg-secondary/20 border-b border-border/50", className)}
      {...props}
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div
          className={cn(
            "flex flex-col space-y-4",
            centered ? "items-center text-center mx-auto max-w-3xl" : "items-start max-w-4xl",
          )}
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-muted-foreground leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </section>
  );
}
