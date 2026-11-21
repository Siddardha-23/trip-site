import type { HTMLAttributes } from "react";

type Tone = "neutral" | "ember" | "sand" | "success";

const TONES: Record<Tone, string> = {
  neutral: "bg-sand-100 text-ink-800",
  ember: "bg-ember-500/15 text-clay-700",
  sand: "bg-sand-200 text-ink-900",
  success: "bg-emerald-100 text-emerald-800",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

/** Small rounded label. */
export function Badge({ tone = "neutral", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[tone]} ${className}`}
      {...props}
    />
  );
}
