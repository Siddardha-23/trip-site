import type { ReactNode } from "react";
import { Sidebar } from "@/components/nav/Sidebar";
import { BottomTabs } from "@/components/nav/BottomTabs";
import { AppHeader } from "@/components/nav/AppHeader";

/**
 * App shell for the segmented experience: a desktop sidebar + a mobile bottom
 * tab bar, with a header carrying the trip title and the editor-unlock control.
 * The bottom tab bar is padded for on narrow viewports via the main's padding.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="mx-auto w-full max-w-4xl flex-1 px-5 pb-24 pt-6 md:pb-10">
          {children}
        </main>
        <BottomTabs />
      </div>
    </div>
  );
}
