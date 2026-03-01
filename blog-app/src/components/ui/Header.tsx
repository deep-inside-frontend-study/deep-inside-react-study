import React, { ReactNode } from "react";

export interface HeaderProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "title"
> {
  left?: ReactNode;
  title?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function Header({
  left,
  title,
  right,
  className = "",
  ...props
}: HeaderProps) {
  return (
    <header className={`w-full ${className}`} {...props}>
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left */}
        <div className="flex flex-1 justify-start">
          {left && <div className="flex items-center">{left}</div>}
        </div>

        {/* Title */}
        <div className="flex flex-1 justify-center font-bold text-lg whitespace-nowrap px-4">
          {title}
        </div>

        {/* Right */}
        <div className="flex flex-1 justify-end">
          {right && <div className="flex items-center">{right}</div>}
        </div>
      </div>
    </header>
  );
}
