import { EditorUnlock } from "@/components/nav/EditorUnlock";
import { trip } from "@/lib/seed/trip-seed";

/** Top header with trip title (mobile) and the editor-unlock control. */
export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[color:var(--border)] bg-surface/95 px-5 py-3 backdrop-blur">
      <div className="flex flex-col md:hidden">
        <span className="text-sm font-semibold leading-tight text-ink-900">
          {trip.title}
        </span>
        <span className="text-xs text-muted">{trip.subtitle}</span>
      </div>
      <div className="hidden text-sm text-muted md:block">
        {trip.bookingStatus}
      </div>
      <EditorUnlock />
    </header>
  );
}
