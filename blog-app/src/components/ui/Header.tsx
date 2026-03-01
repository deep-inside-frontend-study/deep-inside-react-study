import React, { ReactNode } from "react";

export interface HeaderProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "title"
> {
  left?: ReactNode;
  title?: ReactNode;
  right?: ReactNode;
  className?: string;
  ContainerProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function Header({
  left,
  title,
  right,
  className = "",
  ContainerProps,
  ...props
}: HeaderProps) {
  return (
    <header className={`w-full ${className}`} {...props}>
      <div
        className={`max-w-5xl mx-auto px-6 h-16 flex items-center justify-between ${
          ContainerProps?.className || ""
        }`}
        {...ContainerProps}
      >
        <div className="flex-1 flex items-center justify-start">{left}</div>
        <div className="flex-1 flex items-center justify-center font-bold text-lg">
          {title}
        </div>
        <div className="flex-1 flex items-center justify-end">{right}</div>
      </div>
    </header>
  );
}
