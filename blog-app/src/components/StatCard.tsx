import React, { ReactNode } from "react";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  top?: ReactNode;
  bottom?: ReactNode;
}

export function StatCard({
  top,
  bottom,
  className = "",
  ...props
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl px-5 py-3 text-center border border-[rgba(99,120,255,0.15)] bg-[rgba(99,120,255,0.08)] ${className}`}
      {...props}
    >
      <div className="text-2xl font-black">{top}</div>
      <div className="text-xs text-slate-600">{bottom}</div>
    </div>
  );
}
