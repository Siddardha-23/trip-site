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

/** A single experiential suggestion (viewpoint, hidden gem or food-culture note). */
export interface ExperienceItem {
  title: string;
  detail: string;
  /** Real source URL backing any asserted fact (NPS / official tourism / Wikipedia). */
  source?: string;
}

/** A New Year's Eve viewing/celebration suggestion. */
export interface NyeGuidance {
  spot: string;
  detail: string;
  crowdNote?: string;
  /** Real source URL backing any asserted fact. */
  source?: string;
}

/**
 * Soulful, experiential suggestions layered on top of a day's planning facts.
 * These are suggestions and sentiment, kept separate from the exact planning
 * figures (notes/legs). Do not move factual figures in here.
 */
export interface DayExperiences {
  /** A short "why this matters" / feeling line for the destination. */
  feeling: string;
  viewpoints: ExperienceItem[];
  hiddenGems: ExperienceItem[];
  foodCulture: ExperienceItem[];
  /** New Year's Eve guidance (Day 5 only). */
  nye?: NyeGuidance[];
}

/**
 * A per-day visual/emotional theme. `key` is a stable slug the UI theme-token
 * map keys off; it does not carry planning figures. Stored only in the TS seed
 * (there is no DB column for it), so it is optional/additive.
 */
export interface DayTheme {
  /** Stable slug, e.g. "red-rock-to-rim". */
  key: string;
  /** Display theme name, e.g. "Red Rock to the Rim". */
  name: string;
  /** Short emotional/visual descriptor, e.g. "sunrise amber shifting to canyon rust". */
  mood: string;
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
  /** Driving legs that occur on this day. PLANNING FACTS — exact figures. */
  legs: RouteLeg[];
  /** Points of interest / activities for the day, in order. */
  stops: Stop[];
  /** PLANNING FACTS — warnings and exact logistics. */
  notes: string[];
  /** EXPERIENTIAL SUGGESTIONS — soulful, non-factual-figure content; optional. */
  experiences?: DayExperiences;
  /** Per-day visual/emotional theme for the UI; optional/additive. */
  theme?: DayTheme;
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

/** A car-rental / one-way drop-off agreement. All fields are manually editable. */
export interface RentalAgreement {
  id: string;
  company: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: ISODate | "";
  dropoffDate: ISODate | "";
  /** Base rental rate in USD; null until known. */
  baseRate: number | null;
  /** One-way drop fee in USD; null until known. */
  oneWayDropFee: number | null;
  notes?: string;
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
  /**
   * Attribution / licensing note for any real imagery wired later
   * (Wikimedia Commons / Unsplash). Optional; placeholders leave it unset.
   */
  source?: string;
}
