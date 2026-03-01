import React, { ReactNode } from "react";

export interface ChipProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  as?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  className?: string;
}

export function Chip({
  children,
  startContent,
  endContent,
  as,
  className = "",
  href,
  onClick,
  ...props
}: ChipProps) {
  const Component = as || (href ? "a" : onClick ? "button" : "div");

  const baseClasses =
    "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200";

  return (
    <Component
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {startContent && <span>{startContent}</span>}
      {children}
      {endContent && <span>{endContent}</span>}
    </Component>
  );
}
