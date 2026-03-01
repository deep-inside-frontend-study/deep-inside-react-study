import React, { ReactNode } from "react";

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: ReactNode;
  label?: ReactNode;
}

export function MetricCard({
  value,
  label,
  className = "",
  ...props
}: MetricCardProps) {
  return (
    <div
      className={`rounded-xl px-5 py-3 text-center border border-[rgba(99,120,255,0.15)] bg-[rgba(99,120,255,0.08)] ${className}`}
      {...props}
    >
      <div className="text-2xl font-black">{value}</div>
      <div className="text-xs text-slate-600">{label}</div>
    </div>
  );
}
