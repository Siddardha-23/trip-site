"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SEGMENTS } from "@/components/nav/segments";
import { NavIcon } from "@/components/nav/NavIcon";
import { trip } from "@/lib/seed/trip-seed";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop sidebar navigation. Hidden on narrow viewports (bottom tabs take over). */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-[color:var(--border)] bg-surface px-4 py-6 md:flex">
      <Link href="/" className="mb-8 flex flex-col gap-1 px-2">
        <span className="text-lg font-semibold leading-tight text-ink-900">
          {trip.title}
        </span>
        <span className="text-xs text-muted">{trip.subtitle}</span>
      </Link>
      <nav aria-label="Primary" className="flex flex-col gap-1">
        {SEGMENTS.map((segment) => {
          const active = isActive(pathname, segment.href);
          return (
            <Link
              key={segment.href}
              href={segment.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-ember-500/15 text-clay-700"
                  : "text-ink-800 hover:bg-sand-100"
              }`}
            >
              <NavIcon path={segment.icon} className="h-5 w-5" />
              {segment.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
