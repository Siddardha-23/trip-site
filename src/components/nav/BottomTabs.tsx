"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SEGMENTS } from "@/components/nav/segments";
import { NavIcon } from "@/components/nav/NavIcon";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Mobile-first bottom tab bar. Hidden on wide viewports (sidebar takes over). */
export function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--border)] bg-surface/95 backdrop-blur md:hidden"
    >
      <ul className="flex items-stretch justify-between px-1">
        {SEGMENTS.map((segment) => {
          const active = isActive(pathname, segment.href);
          return (
            <li key={segment.href} className="flex-1">
              <Link
                href={segment.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                  active ? "text-ember-600" : "text-muted"
                }`}
              >
                <NavIcon path={segment.icon} className="h-5 w-5" />
                {segment.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
