// In-memory mock store hydrated from the seed. Provides get/list/upsert/remove
// per entity plus a simple pub/sub so UI subscribe code has a working (no-op-ish)
// path in mock mode. This is the backend when no Supabase env vars are set.
import {
  budgetItems as seedBudgetItems,
  checklistItems as seedChecklistItems,
  openDecisions as seedDecisions,
  people as seedPeople,
  photos as seedPhotos,
  places as seedPlaces,
  rentals as seedRentals,
  trip as seedTrip,
  weatherCards as seedWeatherCards,
} from "@/lib/seed/trip-seed";
import type { EntityMap, EntityName } from "@/lib/data/entities";
import { ENTITY_NAMES } from "@/lib/data/entities";
import type { Day, Stop } from "@/lib/types";

type Store = { [K in EntityName]: Map<string, EntityMap[K]> };

type Listener = () => void;

function buildStore(): Store {
  // Derive days (without nested stops/legs stored separately) and flat stops.
  const days: Day[] = seedTrip.days;
  const stops: Stop[] = seedTrip.days.flatMap((day) => day.stops);

  const store = {} as Store;
  for (const name of ENTITY_NAMES) {
    store[name] = new Map();
  }

  for (const day of days) store.days.set(day.id, day);
  for (const stop of stops) store.stops.set(stop.id, stop);
  for (const place of seedPlaces) store.places.set(place.id, place);
  for (const person of seedPeople) store.people.set(person.id, person);
  for (const item of seedBudgetItems) store.budgetItems.set(item.id, item);
  for (const decision of seedDecisions) store.decisions.set(decision.id, decision);
  for (const card of seedWeatherCards) store.weatherCards.set(card.id, card);
  for (const rental of seedRentals) store.rentals.set(rental.id, rental);
  for (const item of seedChecklistItems) store.checklistItems.set(item.id, item);
  for (const photo of seedPhotos) store.photos.set(photo.id, photo);
  // expenses, drivers, vaultDocuments start empty.

  return store;
}

const store = buildStore();
const listeners: { [K in EntityName]: Set<Listener> } = ENTITY_NAMES.reduce(
  (acc, name) => {
    acc[name] = new Set<Listener>();
    return acc;
  },
  {} as { [K in EntityName]: Set<Listener> },
);

function notify(entity: EntityName) {
  for (const listener of listeners[entity]) listener();
}

export const mockStore = {
  get<K extends EntityName>(entity: K, id: string): EntityMap[K] | null {
    return (store[entity].get(id) as EntityMap[K] | undefined) ?? null;
  },

  list<K extends EntityName>(entity: K): EntityMap[K][] {
    return Array.from(store[entity].values()) as EntityMap[K][];
  },

  upsert<K extends EntityName>(entity: K, record: EntityMap[K]): EntityMap[K] {
    (store[entity] as Map<string, EntityMap[K]>).set(record.id, record);
    notify(entity);
    return record;
  },

  remove<K extends EntityName>(entity: K, id: string): void {
    store[entity].delete(id);
    notify(entity);
  },

  /** Subscribe to changes for an entity. Returns an unsubscribe function. */
  subscribe(entity: EntityName, listener: Listener): () => void {
    listeners[entity].add(listener);
    return () => {
      listeners[entity].delete(listener);
    };
  },
};
