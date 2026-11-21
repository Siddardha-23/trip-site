import type { HTMLAttributes } from "react";

/** A warm surface card used across every segment. */
export function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-[color:var(--border)] bg-surface p-5 shadow-sm ${className}`}
      {...props}
    />
  );
}
