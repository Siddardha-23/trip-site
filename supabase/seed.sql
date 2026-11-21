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
  '2026-12-27', '2026-12-31', '2027-01-01', 5, 4,
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
-- Days (legs stored as jsonb mirroring RouteLeg; notes as jsonb array;
-- experiences as jsonb mirroring DayExperiences — nullable, days 1-5 only)
insert into public.days (id, trip_id, day_number, date, weekday, title, overnight, summary, legs, notes, experiences) values
  (
    'day-1', 'az-to-sf-2025', 1, '2026-12-27', 'Sunday',
    'Sedona to the Grand Canyon South Rim', 'South Rim or Tusayan',
    'Tempe → Sedona → South Rim · About 4.5-5 hr · 270 mi. Early start preserves most of the day for the canyon.',
    '[{"id":"leg-1a","from":"Tempe","to":"Sedona","miles":125,"driveTime":"about 2 hr","driveTimeHoursLow":2,"driveTimeHoursHigh":2,"departTime":"5:30am","notes":"Leave Tempe at 5:30am; preferred early-morning window."},{"id":"leg-1b","from":"Sedona","to":"South Rim","miles":145,"driveTime":"about 2.5-3 hr","driveTimeHoursLow":2.5,"driveTimeHoursHigh":3}]'::jsonb,
    '["Night: South Rim or Tusayan. Staying inside the park reduces driving; Tusayan is the closest outside-park base.","Park entry $35 per private vehicle, valid 7 days."]'::jsonb,
    '{"feeling":"This is the day the trip stops being a plan and becomes a feeling: red rock at sunrise, then standing at the edge of something a mile deep and older than you can hold in your head. Let the group go quiet here; some places earn the silence.","viewpoints":[{"title":"Airport Mesa Overlook, Sedona","detail":"A short pull-off on the mesa with a 360° sweep of the red-rock buttes — best in early light before the breakfast stop, when the rock glows and the crowds are thin.","source":"https://en.wikipedia.org/wiki/Sedona,_Arizona"},{"title":"Mather Point first look","detail":"The classic first view of the canyon just steps from the Visitor Center. Walk a little past the railing crowd along the Rim Trail to find a quieter ledge to take it in.","source":"https://www.nps.gov/grca/planyourvisit/grand-canyon-village.htm"},{"title":"Yavapai Point & Geology Museum","detail":"A short walk west of Mather along the rim; the picture windows frame the canyon and the free museum explains the layers you are looking at, two billion years of rock stacked in plain sight.","source":"https://www.nps.gov/grca/planyourvisit/yavapai-point.htm"}],"hiddenGems":[{"title":"Chapel of the Holy Cross, Sedona","detail":"A modernist chapel built straight into the red rock south of town — a quiet, moving stop that most drive-through visitors skip. Free to enter.","source":"https://en.wikipedia.org/wiki/Chapel_of_the_Holy_Cross_(Sedona,_Arizona)"},{"title":"Trail of Time, South Rim","detail":"A rim walk where every meter marks a million years of the canyon''s history; walking it slowly turns the view into a story instead of a photo.","source":"https://www.nps.gov/grca/planyourvisit/trail-of-time.htm"}],"foodCulture":[{"title":"Sedona breakfast with a view","detail":"Keep the Sedona stop to a relaxed sit-down breakfast rather than a rushed drive-through; the uptown cafes with patio red-rock views are the point of stopping here at all."},{"title":"Pack a canyon picnic","detail":"Grab provisions before the rim — eating a simple lunch on a quiet overlook beats waiting for a crowded park cafe, and the view is free."}]}'::jsonb
  ),
  (
    'day-2', 'az-to-sf-2025', 2, '2026-12-28', 'Monday',
    'Grand Canyon to San Diego', 'San Diego',
    'South Rim → San Diego · About 8.5-10 hr · 504 mi. The longest drive of the trip; a full driving day.',
    '[{"id":"leg-2","from":"South Rim","to":"San Diego","miles":504,"driveTime":"about 8.5-10 hr","driveTimeHoursLow":8.5,"driveTimeHoursHigh":10,"departTime":"5:30am","notes":"Route calculation is 504 miles and 8.5 hours before heavier traffic, with a high-traffic estimate of 9 hours 19 minutes. Fuel and meal stops are extra."}]'::jsonb,
    '["Winter access: South Rim is open year-round, but snow and ice can temporarily close roads. Hermit Road normally opens to private vehicles under 22 feet from December through February, weather permitting. Stay on rim viewpoints rather than adding a below-rim hike to this short visit."]'::jsonb,
    '{"feeling":"A long day behind the wheel earns a soft landing: the Pacific, salt air, and a city that moves at half the speed of the road you just drove. Don''t over-plan the evening — let San Diego decompress the group.","viewpoints":[{"title":"Sunset Cliffs Natural Park","detail":"Dramatic sandstone bluffs over the ocean in Point Loma, timed perfectly for arrival-day sunset. No ticket, no gate, just the horizon.","source":"https://www.sandiego.gov/park-and-recreation/parks/regional/shoreline/sunset"},{"title":"Cabrillo National Monument, Point Loma","detail":"The tip of the peninsula with sweeping views back across the bay and city skyline; an NPS site, so your canyon mindset carries over.","source":"https://www.nps.gov/cabr/index.htm"}],"hiddenGems":[{"title":"Balboa Park after dark","detail":"The Spanish-Revival architecture along El Prado is lit at night and the grounds stay open and free — a quiet, grand walk when the museums have closed.","source":"https://en.wikipedia.org/wiki/Balboa_Park_(San_Diego)"},{"title":"Old Town San Diego","detail":"The state historic park preserves California''s first European settlement; low-key, walkable, and a genuine sense of the region''s layered Mexican and Spanish roots.","source":"https://en.wikipedia.org/wiki/Old_Town_San_Diego_State_Historic_Park"}],"foodCulture":[{"title":"A real San Diego taco","detail":"The city''s border-shaped food culture lives in its taco shops and Baja-style seafood; a casual taqueria dinner fits the tired-but-happy arrival mood better than anything formal.","source":"https://en.wikipedia.org/wiki/San_Diego"}]}'::jsonb
  ),
  (
    'day-3', 'az-to-sf-2025', 3, '2026-12-29', 'Tuesday',
    'Early drive to Los Angeles', 'Los Angeles',
    'San Diego → Griffith Observatory · About 2.5-4 hr · 128 mi.',
    '[{"id":"leg-3","from":"San Diego","to":"Griffith Observatory","miles":128,"driveTime":"about 2.5-4 hr","driveTimeHoursLow":2.5,"driveTimeHoursHigh":4,"departTime":"5:30am","notes":"128-mile route measured 2 hr 19 min normally and 3 hr 49 min in the high-traffic estimate."}]'::jsonb,
    '["This early start trades a San Diego morning for more usable time in Los Angeles. If Balboa Park is a priority, keep it on the previous afternoon or move this drive back to early afternoon.","Protect this driving day: keep the 5:30am start and avoid adding Route 66 or Joshua Tree detours. Rotate only between listed, rested drivers. If nobody wants a drive this long, this is the first leg to replace with a flight or split with an extra night.","Night: Los Angeles. A Hollywood base fits this stop."]'::jsonb,
    '{"feeling":"LA rewards the group that treats it as a view rather than a checklist. From Griffith, the whole basin spreads out to the ocean at dusk — city lights coming on, the sign on the hill, that specific feeling of having arrived in the myth of the place.","viewpoints":[{"title":"Griffith Observatory terraces at dusk","detail":"Arrive before sunset and stay for blue hour: the free rooftop and lawn give you the Hollywood Sign on one side and the glittering LA basin on the other as the lights come up.","source":"https://en.wikipedia.org/wiki/Griffith_Observatory"},{"title":"Griffith Park trails","detail":"The surrounding park is one of the largest urban wildernesses in North America; even a short walk up toward the sign trades the parking-lot crowd for quiet ridgeline views.","source":"https://en.wikipedia.org/wiki/Griffith_Park"}],"hiddenGems":[{"title":"The Last Bookstore, Downtown","detail":"A cathedral-like independent bookstore in a former bank, with book tunnels and arches upstairs — a quietly magical, un-touristy hour if the morning stop lands downtown.","source":"https://en.wikipedia.org/wiki/The_Last_Bookstore"},{"title":"Santa Monica Pier at golden hour","detail":"If the flexible morning goes coastal instead, the pier and the end of Route 66 carry a nostalgic, carnival-light charm that photographs beautifully late in the day.","source":"https://en.wikipedia.org/wiki/Santa_Monica_Pier"}],"foodCulture":[{"title":"Grand Central Market","detail":"A century-old downtown food hall where the city''s immigrant food cultures sit side by side; a single lunch can span Mexican, Thai, and classic deli counters.","source":"https://en.wikipedia.org/wiki/Grand_Central_Market"},{"title":"Keep valuables out of sight","detail":"LA is a joy on foot, but it''s a big city: lock the car, take nothing visible, and the day stays carefree."}]}'::jsonb
  ),
  (
    'day-4', 'az-to-sf-2025', 4, '2026-12-30', 'Wednesday',
    'Los Angeles to San Francisco', 'San Francisco',
    'Los Angeles → San Francisco via I-5 · About 6-7.5 hr · 380 mi.',
    '[{"id":"leg-4","from":"Los Angeles","to":"San Francisco","miles":380,"driveTime":"about 6-7.5 hr","driveTimeHoursLow":6,"driveTimeHoursHigh":7.5,"departTime":"5:30am","notes":"Use I-5 for this five-night version. The 380-mile route measured 6 hr normally and 7 hr 20 min in the high-traffic estimate, before a meal stop."}]'::jsonb,
    '["If this is a one-way rental, returning it in SF can avoid two nights of city parking; rental terms and drop fees are not priced yet."]'::jsonb,
    '{"feeling":"The last long drive ends at the edge of the continent. Timing the arrival for late-afternoon light at the Golden Gate — if the fog cooperates — gives the group a shared ''we made it'' moment that the whole trip has been building toward.","viewpoints":[{"title":"Battery Spencer, Marin side","detail":"Just north of the bridge, this old gun battery frames the towers against the city skyline — the definitive Golden Gate view, and free. Weather and fog permitting.","source":"https://en.wikipedia.org/wiki/Golden_Gate_Bridge"},{"title":"Palace of Fine Arts lagoon","detail":"A surviving 1915 exposition rotunda reflected in a still lagoon; calm, grand, and a gentle contrast to a day of freeway after the bridge.","source":"https://en.wikipedia.org/wiki/Palace_of_Fine_Arts"}],"hiddenGems":[{"title":"Fort Point under the bridge","detail":"A Civil War-era brick fort directly beneath the south anchorage; standing under the roaring span is a very different feeling from seeing it from afar.","source":"https://www.nps.gov/fopo/index.htm"},{"title":"The Embarcadero walk","detail":"If the bridge is fogged in, the waterfront promenade from the Ferry Building toward the bridge is a reliable, beautiful plan B with open bay views.","source":"https://en.wikipedia.org/wiki/The_Embarcadero_(San_Francisco)"}],"foodCulture":[{"title":"Ferry Building Marketplace","detail":"A restored ferry terminal turned food hall of Northern California makers — a perfect low-key arrival dinner showcasing the region''s produce and coffee culture.","source":"https://en.wikipedia.org/wiki/San_Francisco_Ferry_Building"}]}'::jsonb
  ),
  (
    'day-5', 'az-to-sf-2025', 5, '2026-12-31', 'Thursday',
    'A full San Francisco day', 'San Francisco (2nd night)',
    'A full city day and a flexible New Year''s Eve. 2nd SF night in the same hotel.',
    '[]'::jsonb,
    '["Night: second night in San Francisco. Staying in the same hotel avoids a New Year''s Day checkout move.","No Big Sur detour in this version. Highway 1 is not part of the timed route; adding the coast would need a different pace or another night."]'::jsonb,
    '{"feeling":"The last full day, and New Year''s Eve — the trip''s emotional finish line. However the group rings in 2027, the point is that you do it together, somewhere that feels like the city. Keep the plan loose enough that the night can become whatever the group needs it to be.","viewpoints":[{"title":"Twin Peaks at night","detail":"The highest easy viewpoint in the city, with the whole grid of lights laid out below — a quieter place to watch midnight than the packed waterfront, if the group wants calm over crowds.","source":"https://en.wikipedia.org/wiki/Twin_Peaks_(San_Francisco)"},{"title":"Coit Tower & Telegraph Hill","detail":"Daytime: climb the Filbert Street steps through gardens to the tower for a bay panorama that stitches the whole city together.","source":"https://en.wikipedia.org/wiki/Coit_Tower"}],"hiddenGems":[{"title":"Golden Gate Park, quietly","detail":"The Japanese Tea Garden and the conservatory give the group a slow, green morning after a week of movement — the opposite energy of a countdown crowd.","source":"https://en.wikipedia.org/wiki/Golden_Gate_Park"},{"title":"16th Avenue Tiled Steps","detail":"A community-made mosaic staircase in the Sunset that climbs to a neighborhood viewpoint; the kind of small, human detail that makes a city feel personal.","source":"https://en.wikipedia.org/wiki/Hidden_Garden_Steps"}],"foodCulture":[{"title":"Dim sum in Chinatown","detail":"San Francisco''s Chinatown is the oldest in North America; a late-morning dim sum feast is both a meal and a walk through living history.","source":"https://en.wikipedia.org/wiki/Chinatown,_San_Francisco"},{"title":"North Beach, Italian SF","detail":"An espresso and pastry in the old Italian quarter, then dinner nearby, is the unhurried counterweight to a big NYE night.","source":"https://en.wikipedia.org/wiki/North_Beach,_San_Francisco"}],"nye":[{"spot":"Embarcadero & Ferry Building waterfront","detail":"The central bayfront between the Ferry Building and the piers is the traditional gathering spot to watch any midnight display over the water. Arrive early and dress in warm layers — December nights on the bay are cold and damp.","crowdNote":"Expect the largest crowds and heavy foot traffic here; it''s energetic and festive but not the place for anyone wanting quiet.","source":"https://en.wikipedia.org/wiki/San_Francisco_Ferry_Building"},{"spot":"Elevated viewpoints: Twin Peaks or Coit Tower area","detail":"For a view over the crowds, higher ground across the city lets you see the skyline and any fireworks from a distance, with far more breathing room.","crowdNote":"Much calmer than the waterfront, but it''s dark and cold up high — bring a light and warm clothing, and don''t go alone.","source":"https://en.wikipedia.org/wiki/Twin_Peaks_(San_Francisco)"},{"spot":"Neighborhood option: a North Beach or Chinatown dinner","detail":"A lower-key alternative: a long celebratory dinner in a lively neighborhood, toasting midnight somewhere warm. Perfect if the group is tired after a week of 5:30am starts.","crowdNote":"Book ahead — popular restaurants fill fast on NYE. This keeps everyone together and off the cold streets.","source":"https://en.wikipedia.org/wiki/North_Beach,_San_Francisco"},{"spot":"Getting around and staying safe","detail":"Plan transport before the night: Muni and BART run extended late-night service on New Year''s Eve in past years, and streets near the waterfront close to cars. Agree on a meeting point and keep phones charged in case the group splits up.","crowdNote":"Rideshare surges and road closures make driving near downtown painful at midnight; transit or walking from a nearby hotel is usually easier.","source":"https://www.bart.gov/"},{"spot":"An honest note on official plans","detail":"As of planning, official details for the December 31, 2026 (ring in 2027) celebration — whether there is a fireworks show, and its time and viewing area — may not be published yet. Treat the spots above as reliable gathering places and recheck the city''s official channels closer to the date before promising anyone a show.","source":"https://sf.gov/"}]}'::jsonb
  ),
  (
    'day-checkout', 'az-to-sf-2025', 6, '2027-01-01', 'Friday',
    'Departure and the missing return leg', null,
    'Check out of the San Francisco hotel. This is not a sixth hotel night.',
    '[]'::jsonb,
    '["Friday, January 1 is checkout and departure. It is not a sixth hotel night."]'::jsonb,
    null
  )
on conflict (id) do update set experiences = excluded.experiences;

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
  ('stop-5-nye', 'day-5', null, 'Flexible New Year''s Eve', 'flex', 'Evening', 'Keep dinner and late plans adjustable until official 2027 event details are published.'),
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
  ('weather-grand-canyon', 'Grand Canyon South Rim', '2026-12-27', 'Recheck the forecast and roads 24-48 hours before driving.', array[
    'NPS recommends layers, food, water, a scraper, a flashlight and over-the-shoe traction for icy paths.',
    'South Rim is open year-round, but snow and ice can temporarily close roads.',
    'Hermit Road normally opens to private vehicles under 22 feet Dec-Feb, weather permitting.'
  ]),
  ('weather-driving-day', 'Day 2 driving day (South Rim -> San Diego)', '2026-12-28', 'Protect the long driving day: keep the 5:30am start, rotate only between listed, rested drivers.', array[
    'Avoid adding Route 66 or Joshua Tree detours.',
    'If nobody wants a drive this long, this is the first leg to replace with a flight or split with an extra night.'
  ]),
  ('weather-nye', 'San Francisco New Year''s Eve', '2026-12-31', 'Fireworks are not locked in. Official details for the December 31, 2026 (ring in 2027) celebration may not be published yet; recheck the Downtown SF organizer page closer to the date.', array[
    'This itinerary does not promise a 2027 fireworks show, time or viewing area.'
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
-- Checklist items (NPS winter gear recommended for the Grand Canyon:
-- layers, food, water, a scraper, a flashlight and over-the-shoe traction)
insert into public.checklist_items (id, label, category, checked, assignee_id) values
  ('check-layers', 'Layers (warm clothing)', 'NPS winter gear', false, null),
  ('check-food', 'Food', 'NPS winter gear', false, null),
  ('check-water', 'Water', 'NPS winter gear', false, null),
  ('check-scraper', 'Ice scraper', 'NPS winter gear', false, null),
  ('check-flashlight', 'Flashlight', 'NPS winter gear', false, null),
  ('check-traction', 'Over-the-shoe traction for icy paths', 'NPS winter gear', false, null)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Rental agreement (one-way draft; nothing priced yet)
insert into public.rental_agreements (id, company, pickup_location, dropoff_location, pickup_date, dropoff_date, base_rate, one_way_drop_fee, notes) values
  ('rental-one-way', '', 'Tempe, AZ', 'San Francisco, CA', '2026-12-27', '2027-01-01', null, null, 'One-way rental draft. Returning the car in San Francisco can avoid two nights of city parking; rental terms and drop fees are not priced yet.')
on conflict (id) do nothing;
