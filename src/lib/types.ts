// Domain model for the trip-planning app.
// All IDs are stable string slugs; all dates are ISO date strings (YYYY-MM-DD).

export type ISODate = string; // e.g. "2025-12-27"

/** A single multi-day trip. */
export interface Trip {
  id: string;
  title: string;
  subtitle: string;
  startDate: ISODate;
  endDate: ISODate; // last hotel night's date
  checkoutDate: ISODate; // departure day (not a hotel night)
  nights: number;
  travelerCount: number;
  roomSetup: string;
  /** Total intercity distance across all legs, in miles. */
  totalIntercityMiles: number;
  /** Total driving time across all legs, in hours (before traffic/stops). */
  totalDrivingHours: number;
  pace: string;
  bookingStatus: string;
  overnightSummary: string;
  days: Day[];
}

/** One day of the itinerary. */
export interface Day {
  id: string;
  dayNumber: number;
  date: ISODate;
  weekday: string;
  title: string;
  /** Where the night is spent (null for the checkout day). */
  overnight: string | null;
  summary: string;
  /** Driving legs that occur on this day. */
  legs: RouteLeg[];
  /** Points of interest / activities for the day, in order. */
  stops: Stop[];
  notes: string[];
}

/** A driving leg between two places. */
export interface RouteLeg {
  id: string;
  from: string;
  to: string;
  miles: number;
  /** Human-readable drive-time range, e.g. "about 4.5-5 hr". */
  driveTime: string;
  /** Lower / upper bound in hours, for aggregation. */
  driveTimeHoursLow: number;
  driveTimeHoursHigh: number;
  /** Optional earliest/target departure time, e.g. "5:30am". */
  departTime?: string;
  notes?: string;
}

export type StopKind =
  | "meal"
  | "sightseeing"
  | "activity"
  | "checkin"
  | "departure"
  | "flex";

/** A scheduled point or activity within a day. */
export interface Stop {
  id: string;
  placeId?: string; // links to a Place when there is a geocoded location
  name: string;
  kind: StopKind;
  /** Approximate time or window, e.g. "7:45-9:15am" or "Around midday". */
  time?: string;
  description?: string;
}

/** A geocoded place of interest. */
export interface Place {
  id: string;
  name: string;
  city?: string;
  /** Coordinates when known; null until geocoded. */
  lat: number | null;
  lng: number | null;
  category: string;
  description?: string;
}

export type RsvpStatus = "yes" | "no" | "maybe" | "pending";

/** A person on the trip. */
export interface Person {
  id: string;
  name: string;
  isAdult: boolean;
  rsvp: RsvpStatus;
  canDrive: boolean;
  avatarColor?: string;
}

/** A shared expense split among participants. */
export interface Expense {
  id: string;
  description: string;
  /** Amount in USD. */
  amount: number;
  currency: string;
  date: ISODate;
  /** Person id who paid. */
  payerId: string;
  /** Person ids sharing the cost. */
  participantIds: string[];
  category: string;
}

/** A planned budget line item (may or may not be priced yet). */
export interface BudgetItem {
  id: string;
  label: string;
  category: string;
  /** True when a concrete figure is known. */
  priced: boolean;
  /** Amount in USD when priced; null otherwise. */
  amount: number | null;
  notes?: string;
}

/** A driver's turn in the rotation for a given leg/day. */
export interface DriverRotation {
  id: string;
  dayId: string;
  legId?: string;
  driverId: string;
  /** Rested/approved to drive this leg. */
  approved: boolean;
  notes?: string;
}

/** A packing / preparation checklist item. */
export interface ChecklistItem {
  id: string;
  label: string;
  category: string;
  checked: boolean;
  /** Person responsible, when assigned. */
  assigneeId?: string;
}

/** A stored document in the shared vault (reservations, passes, etc.). */
export interface VaultDocument {
  id: string;
  title: string;
  category: string;
  /** Storage path/URL (Supabase Storage); null for placeholders. */
  url: string | null;
  uploadedAt?: string; // ISO datetime
  notes?: string;
}

/** A weather / seasonal-check card for a location. */
export interface WeatherCard {
  id: string;
  location: string;
  date: ISODate;
  /** Guidance text (e.g. forecast/road-check reminder). */
  guidance: string;
  warnings: string[];
}

/** An outstanding decision that turns the draft into a bookable plan. */
export interface OpenDecision {
  id: string;
  question: string;
  detail?: string;
  resolved: boolean;
  resolution?: string;
}

/** A photo in the gallery / moments feed. */
export interface Photo {
  id: string;
  /** Storage URL (Supabase Storage); null for placeholders. */
  url: string | null;
  caption?: string;
  takenAt?: string; // ISO datetime
  dayId?: string;
  placeId?: string;
  uploadedById?: string;
}
