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
    <div className={cn("glass-panel rounded-lg p-4", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="rounded-md bg-primary/12 p-2 text-primary">{icon}</span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <strong className="text-2xl font-semibold tracking-normal">{value}</strong>
        {trend ? <span className="text-xs font-medium text-primary">{trend}</span> : null}
      </div>
    </div>
  );
}
