import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    label: string;
  };
  icon?: LucideIcon;
  href?: string;
  className?: string;
  children?: React.ReactNode;
};

export function StatCard({ title, value, trend, icon: Icon, href, className, children }: StatCardProps) {
  const content = (
    <>
      <div className="flex flex-row items-center justify-between gap-2 pb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
      </div>
      <div className="space-y-1">
        <span className="text-2xl font-semibold tracking-tight text-foreground">{value}</span>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {trend.value >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-success" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            )}
            <span className={trend.value >= 0 ? "text-success" : "text-destructive"}>
              {trend.value >= 0 ? "+" : ""}
              {trend.value.toFixed(1)}%
            </span>
            <span>{trend.label}</span>
          </div>
        )}
      </div>
      {children}
    </>
  );

  const wrapperClass = cn(
    "rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors",
    href && "hover:bg-accent/50",
    className
  );

  if (href) {
    return (
      <a href={href} className={wrapperClass}>
        {content}
      </a>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}
