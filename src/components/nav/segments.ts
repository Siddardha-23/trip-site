// The segmented navigation model shared by the mobile bottom tabs and the
// desktop sidebar. Each segment maps to a route under the (app) group.

export interface Segment {
  href: string;
  label: string;
  /** Short inline SVG path(s) rendered at 24x24 on a 0 0 24 24 viewBox. */
  icon: string;
}

export const SEGMENTS: Segment[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: "M3 12 12 4l9 8M5 10v10h5v-6h4v6h5V10",
  },
  {
    href: "/itinerary",
    label: "Itinerary",
    icon: "M8 3v4M16 3v4M4 9h16M5 7h14a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z",
  },
  {
    href: "/map",
    label: "Map",
    icon: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2ZM9 4v14M15 6v14",
  },
  {
    href: "/group",
    label: "Group",
    icon: "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM22 19v-1a4 4 0 0 0-3-3.87M16 5.13A4 4 0 0 1 16 13",
  },
  {
    href: "/money",
    label: "Money",
    icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  },
  {
    href: "/logistics",
    label: "Logistics",
    icon: "M1 3h15v13H1zM16 8h4l3 3v5h-7M5.5 19a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM18.5 19a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  },
  {
    href: "/gallery",
    label: "Gallery",
    icon: "M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6M9 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z",
  },
  {
    href: "/moments",
    label: "Moments",
    icon: "M20.8 5.6a5 5 0 0 0-7-.3l-.8.8-.8-.8a5 5 0 0 0-7 7l.8.8L12 21l6.9-7.9.8-.8a5 5 0 0 0 1.1-6.7Z",
  },
];
