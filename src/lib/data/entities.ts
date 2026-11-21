// Central registry mapping each entity name to its TypeScript type and its
// snake_case Supabase table name. Shared by the mock store and the repository
// so the entity surface stays consistent in both modes.
import type {
  BudgetItem,
  ChecklistItem,
  Day,
  DriverRotation,
  Expense,
  OpenDecision,
  Person,
  Photo,
  Place,
  Stop,
  VaultDocument,
  WeatherCard,
} from "@/lib/types";

/** Map of entity name -> record type. */
export interface EntityMap {
  days: Day;
  stops: Stop;
  places: Place;
  people: Person;
  expenses: Expense;
  budgetItems: BudgetItem;
  drivers: DriverRotation;
  checklistItems: ChecklistItem;
  decisions: OpenDecision;
  vaultDocuments: VaultDocument;
  weatherCards: WeatherCard;
  photos: Photo;
}

export type EntityName = keyof EntityMap;

/** All entity names, in a stable order. */
export const ENTITY_NAMES: EntityName[] = [
  "days",
  "stops",
  "places",
  "people",
  "expenses",
  "budgetItems",
  "drivers",
  "checklistItems",
  "decisions",
  "vaultDocuments",
  "weatherCards",
  "photos",
];

/** Entity name -> Supabase table name (snake_case). */
export const TABLE_NAMES: Record<EntityName, string> = {
  days: "days",
  stops: "stops",
  places: "places",
  people: "people",
  expenses: "expenses",
  budgetItems: "budget_items",
  drivers: "driver_rotations",
  checklistItems: "checklist_items",
  decisions: "open_decisions",
  vaultDocuments: "vault_documents",
  weatherCards: "weather_cards",
  photos: "photos",
};
