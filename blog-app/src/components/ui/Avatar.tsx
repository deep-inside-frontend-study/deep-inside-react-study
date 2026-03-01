import React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  fallback: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({
  fallback,
  size = "md",
  className = "",
  ...props
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-5 h-5 text-[0.6rem]",
    md: "w-6 h-6 text-[0.65rem]",
    lg: "w-8 h-8 text-xs",
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold shrink-0 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {fallback.charAt(0).toUpperCase()}
    </div>
  );
}
