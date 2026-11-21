-- trip-site seed data. Mirrors src/lib/seed/trip-seed.ts, which is itself
-- transcribed verbatim from _itinerary_extracted.txt. Figures (mileage,
-- drive-times, costs, warnings, decisions) are exact — do not invent values.
-- Run AFTER 0001_init.sql. Idempotent via upsert (on conflict do update).

-- ---------------------------------------------------------------------------
-- Trip
insert into public.trips (
  id, title, subtitle, start_date, end_date, checkout_date, nights,
  traveler_count, room_setup, total_intercity_miles, total_driving_hours,
  pace, booking_status, overnight_summary
) values (
  'az-to-sf-2025',
  'Arizona to San Francisco',
  'Dec 27-Jan 1 · 5 nights · 4 people',
  '2025-12-27', '2025-12-31', '2026-01-01', 5, 4,
  '1 room · 2 queen beds', 1282, 21.4,
  'Fast; 5:30am starts, December 28 is a full driving day',
  'Nothing booked. This is a planning draft.',
  'South Rim 1 · San Diego 1 · Los Angeles 1 · San Francisco 2'
) on conflict (id) do update set
  title = excluded.title, subtitle = excluded.subtitle,
  start_date = excluded.start_date, end_date = excluded.end_date,
  checkout_date = excluded.checkout_date, nights = excluded.nights,
  traveler_count = excluded.traveler_count, room_setup = excluded.room_setup,
  total_intercity_miles = excluded.total_intercity_miles,
  total_driving_hours = excluded.total_driving_hours, pace = excluded.pace,
  booking_status = excluded.booking_status,
  overnight_summary = excluded.overnight_summary;

-- ---------------------------------------------------------------------------
-- Places
insert into public.places (id, name, city, lat, lng, category, description) values
  ('tempe', 'Tempe', 'Tempe, AZ', null, null, 'start', 'Trip start and pickup point. Exact pickup can change mileage slightly.'),
  ('sedona', 'Sedona', 'Sedona, AZ', null, null, 'sightseeing', 'Breakfast and a short red-rock stop.'),
  ('south-rim', 'Grand Canyon South Rim', 'Grand Canyon, AZ', null, null, 'national-park', 'Start at Mather Point, then an easy section of the Rim Trail.'),
  ('mather-point', 'Mather Point', 'Grand Canyon, AZ', null, null, 'viewpoint', null),
  ('rim-trail', 'Rim Trail', 'Grand Canyon, AZ', null, null, 'trail', null),
  ('hermit-road', 'Hermit Road', 'Grand Canyon, AZ', null, null, 'scenic-drive', 'Add overlooks if daylight and road conditions allow. Normally open to private vehicles under 22 feet Dec-Feb, weather permitting.'),
  ('san-diego', 'San Diego', 'San Diego, CA', null, null, 'city', null),
  ('balboa-park', 'Balboa Park', 'San Diego, CA', null, null, 'park', 'Grounds admission free; museums and parking can cost extra.'),
  ('griffith-observatory', 'Griffith Observatory', 'Los Angeles, CA', null, null, 'sightseeing', 'Exhibits and the Hollywood Sign view. Building admission free; parking paid, planetarium tickets separate.'),
  ('los-angeles', 'Los Angeles', 'Los Angeles, CA', null, null, 'city', null),
  ('san-francisco', 'San Francisco', 'San Francisco, CA', null, null, 'city', null),
  ('golden-gate', 'Golden Gate Bridge', 'San Francisco, CA', null, null, 'sightseeing', null),
  ('palace-of-fine-arts', 'Palace of Fine Arts', 'San Francisco, CA', null, null, 'sightseeing', null),
  ('ferry-building', 'Ferry Building', 'San Francisco, CA', null, null, 'sightseeing', 'Ferry Building and Embarcadero.'),
  ('chinatown', 'Chinatown', 'San Francisco, CA', null, null, 'neighborhood', null),
  ('north-beach', 'North Beach', 'San Francisco, CA', null, null, 'neighborhood', null)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Days (legs stored as jsonb mirroring RouteLeg; notes as jsonb array)
insert into public.days (id, trip_id, day_number, date, weekday, title, overnight, summary, legs, notes) values
  (
    'day-1', 'az-to-sf-2025', 1, '2025-12-27', 'Sunday',
    'Sedona to the Grand Canyon South Rim', 'South Rim or Tusayan',
    'Tempe → Sedona → South Rim · About 4.5-5 hr · 270 mi. Early start preserves most of the day for the canyon.',
    '[{"id":"leg-1a","from":"Tempe","to":"Sedona","miles":125,"driveTime":"about 2 hr","driveTimeHoursLow":2,"driveTimeHoursHigh":2,"departTime":"5:30am","notes":"Leave Tempe at 5:30am; preferred early-morning window."},{"id":"leg-1b","from":"Sedona","to":"South Rim","miles":145,"driveTime":"about 2.5-3 hr","driveTimeHoursLow":2.5,"driveTimeHoursHigh":3}]'::jsonb,
    '["Night: South Rim or Tusayan. Staying inside the park reduces driving; Tusayan is the closest outside-park base.","Park entry $35 per private vehicle, valid 7 days."]'::jsonb
  ),
  (
    'day-2', 'az-to-sf-2025', 2, '2025-12-28', 'Monday',
    'Grand Canyon to San Diego', 'San Diego',
    'South Rim → San Diego · About 8.5-10 hr · 504 mi. The longest drive of the trip; a full driving day.',
    '[{"id":"leg-2","from":"South Rim","to":"San Diego","miles":504,"driveTime":"about 8.5-10 hr","driveTimeHoursLow":8.5,"driveTimeHoursHigh":10,"departTime":"5:30am","notes":"Route calculation is 504 miles and 8.5 hours before heavier traffic, with a high-traffic estimate of 9 hours 19 minutes. Fuel and meal stops are extra."}]'::jsonb,
    '["Winter access: South Rim is open year-round, but snow and ice can temporarily close roads. Hermit Road normally opens to private vehicles under 22 feet from December through February, weather permitting. Stay on rim viewpoints rather than adding a below-rim hike to this short visit."]'::jsonb
  ),
  (
    'day-3', 'az-to-sf-2025', 3, '2025-12-29', 'Tuesday',
    'Early drive to Los Angeles', 'Los Angeles',
    'San Diego → Griffith Observatory · About 2.5-4 hr · 128 mi.',
    '[{"id":"leg-3","from":"San Diego","to":"Griffith Observatory","miles":128,"driveTime":"about 2.5-4 hr","driveTimeHoursLow":2.5,"driveTimeHoursHigh":4,"departTime":"5:30am","notes":"128-mile route measured 2 hr 19 min normally and 3 hr 49 min in the high-traffic estimate."}]'::jsonb,
    '["This early start trades a San Diego morning for more usable time in Los Angeles. If Balboa Park is a priority, keep it on the previous afternoon or move this drive back to early afternoon.","Protect this driving day: keep the 5:30am start and avoid adding Route 66 or Joshua Tree detours. Rotate only between listed, rested drivers. If nobody wants a drive this long, this is the first leg to replace with a flight or split with an extra night.","Night: Los Angeles. A Hollywood base fits this stop."]'::jsonb
  ),
  (
    'day-4', 'az-to-sf-2025', 4, '2025-12-30', 'Wednesday',
    'Los Angeles to San Francisco', 'San Francisco',
    'Los Angeles → San Francisco via I-5 · About 6-7.5 hr · 380 mi.',
    '[{"id":"leg-4","from":"Los Angeles","to":"San Francisco","miles":380,"driveTime":"about 6-7.5 hr","driveTimeHoursLow":6,"driveTimeHoursHigh":7.5,"departTime":"5:30am","notes":"Use I-5 for this five-night version. The 380-mile route measured 6 hr normally and 7 hr 20 min in the high-traffic estimate, before a meal stop."}]'::jsonb,
    '["If this is a one-way rental, returning it in SF can avoid two nights of city parking; rental terms and drop fees are not priced yet."]'::jsonb
  ),
  (
    'day-5', 'az-to-sf-2025', 5, '2025-12-31', 'Thursday',
    'A full San Francisco day', 'San Francisco (2nd night)',
    'A full city day and a flexible New Year''s Eve. 2nd SF night in the same hotel.',
    '[]'::jsonb,
    '["Night: second night in San Francisco. Staying in the same hotel avoids a New Year''s Day checkout move.","No Big Sur detour in this version. Highway 1 is not part of the timed route; adding the coast would need a different pace or another night."]'::jsonb
  ),
  (
    'day-checkout', 'az-to-sf-2025', 6, '2026-01-01', 'Friday',
    'Departure and the missing return leg', null,
    'Check out of the San Francisco hotel. This is not a sixth hotel night.',
    '[]'::jsonb,
    '["Friday, January 1 is checkout and departure. It is not a sixth hotel night."]'::jsonb
  )
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Stops
insert into public.stops (id, day_id, place_id, name, kind, time, description) values
  ('stop-1-tempe', 'day-1', 'tempe', 'Leave Tempe', 'departure', '5:30am', 'Preferred early-morning window. Exact pickup point can change the mileage slightly.'),
  ('stop-1-sedona', 'day-1', 'sedona', 'Sedona', 'meal', '7:45-9:15am', 'Have breakfast and take a short red-rock stop. The early start preserves most of the day for the canyon.'),
  ('stop-1-south-rim', 'day-1', 'south-rim', 'Grand Canyon South Rim', 'sightseeing', 'Around midday', 'Start at Mather Point, then walk an easy section of the Rim Trail. Add Hermit Road overlooks if daylight and road conditions allow.'),
  ('stop-1-mather', 'day-1', 'mather-point', 'Mather Point', 'sightseeing', null, null),
  ('stop-1-rim-trail', 'day-1', 'rim-trail', 'Rim Trail', 'activity', null, null),
  ('stop-1-hermit', 'day-1', 'hermit-road', 'Hermit Road overlooks', 'flex', null, 'If daylight and road conditions allow.'),
  ('stop-2-prep', 'day-2', null, 'Breakfast and departure prep', 'departure', '5:00am', 'Pack the car before the early start. Canyon viewing is already built into the previous afternoon.'),
  ('stop-2-depart', 'day-2', 'south-rim', 'Start the long drive', 'departure', '5:30am', '504 miles, 8.5 hr before heavier traffic (high-traffic estimate 9 hr 19 min). Fuel and meal stops are extra.'),
  ('stop-2-san-diego', 'day-2', 'san-diego', 'San Diego', 'checkin', 'Mid-to-late afternoon', 'Check in and keep the evening flexible. If the group has energy, choose a short Balboa Park walk or the waterfront, not a ticketed attraction.'),
  ('stop-2-balboa', 'day-2', 'balboa-park', 'Balboa Park (optional)', 'flex', null, 'Short walk or the waterfront, not a ticketed attraction.'),
  ('stop-3-depart', 'day-3', 'san-diego', 'Leave San Diego', 'departure', '5:30am', 'The 128-mile route to Griffith Observatory measured 2 hr 19 min normally and 3 hr 49 min in the high-traffic estimate.'),
  ('stop-3-morning', 'day-3', null, 'Hollywood or Santa Monica', 'flex', 'Morning', 'Choose one flexible stop while waiting for the Observatory to open. Keep bags secured and do not leave valuables visible in the car.'),
  ('stop-3-griffith', 'day-3', 'griffith-observatory', 'Griffith Observatory', 'sightseeing', 'Noon-afternoon', 'See the exhibits and the Hollywood Sign view. Regular Tuesday hours are noon to 10:00pm. Admission to the building is free; the closest parking is paid and planetarium tickets are separate.'),
  ('stop-4-depart', 'day-4', 'los-angeles', 'Leave Los Angeles', 'departure', '5:30am', 'Use I-5 for this five-night version.'),
  ('stop-4-arrive', 'day-4', 'san-francisco', 'Arrive in San Francisco', 'checkin', 'Midday-to-early afternoon', 'Check in for two nights. If this is a one-way rental, returning it here can avoid two nights of city parking; rental terms and drop fees are not priced yet.'),
  ('stop-4-golden-gate', 'day-4', 'golden-gate', 'Golden Gate Bridge', 'sightseeing', 'Late afternoon', 'Choose the Golden Gate Bridge and Palace of Fine Arts if visibility is good. Otherwise use the Ferry Building and Embarcadero.'),
  ('stop-4-palace', 'day-4', 'palace-of-fine-arts', 'Palace of Fine Arts', 'sightseeing', 'Late afternoon', null),
  ('stop-5-ferry', 'day-5', 'ferry-building', 'Ferry Building and Embarcadero', 'sightseeing', 'Morning', 'Keep the first morning unhurried after three consecutive intercity drives.'),
  ('stop-5-chinatown', 'day-5', 'chinatown', 'Chinatown', 'activity', 'Afternoon', 'Use the compact Chinatown + North Beach pairing for food, walking and city views. If Golden Gate was fogged out the day before, make that the afternoon priority instead.'),
  ('stop-5-north-beach', 'day-5', 'north-beach', 'North Beach', 'activity', 'Afternoon', null),
  ('stop-5-nye', 'day-5', null, 'Flexible New Year''s Eve', 'flex', 'Evening', 'Keep dinner and late plans adjustable until official 2026 event details are published.'),
  ('stop-checkout', 'day-checkout', 'san-francisco', 'Check out', 'departure', null, 'No flight, drive back to Arizona or other return leg is included yet. If you need to be back in Arizona on January 1, the route and pacing need to change before anything is booked.')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- People (4 adults; placeholder names to be filled by the group)
insert into public.people (id, name, is_adult, rsvp, can_drive, avatar_color) values
  ('person-1', 'Traveler 1', true, 'pending', true, '#ef4444'),
  ('person-2', 'Traveler 2', true, 'pending', true, '#3b82f6'),
  ('person-3', 'Traveler 3', true, 'pending', true, '#22c55e'),
  ('person-4', 'Traveler 4', true, 'pending', true, '#eab308')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Budget items (what is priced and what is not)
insert into public.budget_items (id, label, category, priced, amount, notes) values
  ('budget-park-entry', 'Grand Canyon park entry', 'park', true, 35, '$35 for one private, non-commercial vehicle and its passengers, valid for seven days. NPS currently says entry has no reservation or timed-entry requirement.'),
  ('budget-nonresident-fee', 'Possible non-US-resident NPS fee', 'park', false, null, 'NPS lists an additional $100 per non-US resident aged 16 or older, unless admitted with an Annual or America the Beautiful Pass. Residency has not been assumed.'),
  ('budget-balboa', 'Balboa Park grounds', 'activity', true, 0, 'Free as currently published. Museums, planetarium shows and parking can cost extra.'),
  ('budget-griffith', 'Griffith Observatory building', 'activity', true, 0, 'Building admission free. Parking is paid and planetarium tickets are separate.'),
  ('budget-hotels', 'Hotels', 'lodging', false, null, 'A separate verified comparison shows live full-stay prices and terms for 11 options. Nothing is booked.'),
  ('budget-rental', 'Rental car / one-way fee', 'transport', false, null, 'Rental car or one-way fee, not priced here.'),
  ('budget-fuel', 'Fuel', 'transport', false, null, null),
  ('budget-parking', 'Parking', 'transport', false, null, null),
  ('budget-food', 'Food', 'food', false, null, null),
  ('budget-attractions', 'Attractions', 'activity', false, null, null),
  ('budget-flights', 'Flights / return journey', 'transport', false, null, 'The return journey is not included. There is no whole-trip total yet.')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Weather / seasonal-check cards
insert into public.weather_cards (id, location, date, guidance, warnings) values
  ('weather-grand-canyon', 'Grand Canyon South Rim', '2025-12-27', 'Recheck the forecast and roads 24-48 hours before driving.', array[
    'NPS recommends layers, food, water, a scraper, a flashlight and over-the-shoe traction for icy paths.',
    'South Rim is open year-round, but snow and ice can temporarily close roads.',
    'Hermit Road normally opens to private vehicles under 22 feet Dec-Feb, weather permitting.'
  ]),
  ('weather-driving-day', 'Day 2 driving day (South Rim -> San Diego)', '2025-12-28', 'Protect the long driving day: keep the 5:30am start, rotate only between listed, rested drivers.', array[
    'Avoid adding Route 66 or Joshua Tree detours.',
    'If nobody wants a drive this long, this is the first leg to replace with a flight or split with an extra night.'
  ]),
  ('weather-nye', 'San Francisco New Year''s Eve', '2025-12-31', 'Fireworks are not locked in. As checked on November 7, the Downtown SF organizer page still lists December 31, 2025 as a past event.', array[
    'This itinerary does not promise a 2026 fireworks show, time or viewing area.'
  ])
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Open decisions (what turns this into a bookable plan)
insert into public.open_decisions (id, question, detail, resolved, resolution) values
  ('decision-drive-whole-route', 'Confirm whether all four travelers want to drive the whole route.', 'Tempe and 5:30am intercity starts are already built in.', false, null),
  ('decision-budget', 'Set a whole-trip budget and identify any must-pay experiences.', null, false, null),
  ('decision-return-leg', 'Decide whether January 1 means flying home, driving back or continuing elsewhere.', null, false, null)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Rental agreement (one-way draft; nothing priced yet)
insert into public.rental_agreements (id, company, pickup_location, dropoff_location, pickup_date, dropoff_date, base_rate, one_way_drop_fee, notes) values
  ('rental-one-way', '', 'Tempe, AZ', 'San Francisco, CA', '2025-12-27', '2026-01-01', null, null, 'One-way rental draft. Returning the car in San Francisco can avoid two nights of city parking; rental terms and drop fees are not priced yet.')
on conflict (id) do nothing;
