interface NavIconProps {
  path: string;
  className?: string;
}

/** Renders a segment's stroke-only SVG icon. */
export function NavIcon({ path, className = "h-6 w-6" }: NavIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}
