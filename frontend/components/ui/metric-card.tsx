import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: ReactNode;
  className?: string;
};

export function MetricCard({ label, value, icon, trend, className }: MetricCardProps) {
  return (
    <div className={cn("glass-panel rounded-lg p-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="rounded-md bg-primary/12 p-1.5 text-primary">{icon}</span>
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <strong className="text-xl font-semibold tracking-normal">{value}</strong>
        {trend ? <span className="text-xs font-medium text-primary">{trend}</span> : null}
      </div>
    </div>
  );
}
