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
  'Dec 27-Jan 1 · 5 nights · up to 6 people',
  '2026-12-27', '2026-12-31', '2027-01-01', 5, 4,
  '2 budget rooms · up to 3 people each · 2 queen beds', 1377, 26.5,
  'Fast; early starts, December 28 is a full 504-mi driving day, Big Sur driven in daylight',
  'Nothing booked. This is a planning draft.',
  'Williams 1 · San Diego 1 · Los Angeles 1 · Monterey 1 · San Francisco 1'
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
  ('sedona', 'Sedona', 'Sedona, AZ', null, null, 'sightseeing', 'Red-rock sunrise and a relaxed breakfast stop.'),
  ('oak-creek-vista', 'Oak Creek Vista Overlook', 'Oak Creek Canyon, AZ', null, null, 'viewpoint', 'Forest Service overlook at the top of the Oak Creek Canyon switchbacks on SR-89A.'),
  ('williams', 'Williams', 'Williams, AZ', null, null, 'town', 'Historic Route 66 gateway town west of Flagstaff; Day 1 base and Route 66 lunch stop.'),
  ('south-rim', 'Grand Canyon South Rim', 'Grand Canyon, AZ', null, null, 'national-park', 'Start at Mather Point, then an easy section of the Rim Trail.'),
  ('mather-point', 'Mather Point', 'Grand Canyon, AZ', null, null, 'viewpoint', null),
  ('rim-trail', 'Rim Trail', 'Grand Canyon, AZ', null, null, 'trail', null),
  ('hermit-road', 'Hermit Road', 'Grand Canyon, AZ', null, null, 'scenic-drive', 'Add overlooks if daylight and road conditions allow. Normally open to private vehicles under 22 feet Dec-Feb, weather permitting.'),
  ('san-diego', 'San Diego', 'San Diego, CA', null, null, 'city', null),
  ('gaslamp-quarter', 'Gaslamp Quarter', 'San Diego, CA', null, null, 'neighborhood', 'Downtown San Diego''s historic nightlife district; the Day 2 evening night out.'),
  ('balboa-park', 'Balboa Park', 'San Diego, CA', null, null, 'park', 'Grounds admission free; museums and parking can cost extra.'),
  ('griffith-observatory', 'Griffith Observatory', 'Los Angeles, CA', null, null, 'sightseeing', 'Exhibits and the Hollywood Sign view. Building admission free; parking paid, planetarium tickets separate.'),
  ('los-angeles', 'Los Angeles', 'Los Angeles, CA', null, null, 'city', null),
  ('monterey', 'Monterey', 'Monterey, CA', 36.6002, -121.8947, 'city', 'Central Coast bay city; Day 4 overnight base and the start of the Big Sur drive.'),
  ('cannery-row', 'Cannery Row', 'Monterey, CA', null, null, 'sightseeing', 'Historic waterfront street made famous by Steinbeck, near the Monterey Bay Aquarium.'),
  ('carmel', 'Carmel-by-the-Sea', 'Carmel-by-the-Sea, CA', null, null, 'town', 'Storybook coastal village with a white-sand beach; a Pacific-sunset stop.'),
  ('bixby-bridge', 'Bixby Creek Bridge', 'Big Sur, CA', null, null, 'viewpoint', 'Iconic arched Big Sur bridge over a coastal canyon on Highway 1.'),
  ('mcway-falls', 'McWay Falls', 'Big Sur, CA', null, null, 'viewpoint', 'Tidefall onto a hidden cove beach in Julia Pfeiffer Burns State Park, Highway 1.'),
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
    'Red Rock to the Rim: Tempe → Sedona → Grand Canyon → Williams', 'Williams, AZ',
    'Tempe → Sedona → Oak Creek Canyon → Flagstaff → Williams → Grand Canyon South Rim → back to Williams · About 5 hr driving · ~270 mi loop. A 5:30am start buys a red-rock sunrise, a Route 66 lunch and a canyon sunset in one day.',
    '[{"id":"leg-1a","from":"Tempe","to":"Sedona","miles":115,"driveTime":"about 2 hr","driveTimeHoursLow":2,"driveTimeHoursHigh":2,"departTime":"5:30am","notes":"Leave Tempe at 5:30am to reach Sedona around 7:15am for a red-rock sunrise."},{"id":"leg-1b","from":"Sedona","to":"Oak Creek Vista Overlook","miles":15,"driveTime":"about 30-45 min","driveTimeHoursLow":0.5,"driveTimeHoursHigh":0.75,"departTime":"9:00am","notes":"Short climb up Oak Creek Canyon on SR-89A; aim for the Oak Creek Vista Overlook around 9:30am."},{"id":"leg-1c","from":"Oak Creek Vista Overlook","to":"Williams","miles":45,"driveTime":"about 1 hr","driveTimeHoursLow":1,"driveTimeHoursHigh":1,"notes":"Continue to Flagstaff, fuel up there, then west on I-40 to Williams for a Route 66 lunch (11:30am-12:30pm)."},{"id":"leg-1d","from":"Williams","to":"Grand Canyon South Rim","miles":48,"driveTime":"about 1 hr","driveTimeHoursLow":1,"driveTimeHoursHigh":1,"departTime":"12:30pm","notes":"North on SR-64 to reach the South Rim around 1:30pm, leaving the afternoon for the rim and sunset (~5pm)."},{"id":"leg-1e","from":"Grand Canyon South Rim","to":"Williams","miles":47,"driveTime":"about 1 hr","driveTimeHoursLow":1,"driveTimeHoursHigh":1,"notes":"After sunset, drive back to the Williams base for the night."}]'::jsonb,
    '["Night: Williams, AZ. Williams is the Route 66 gateway town west of Flagstaff; basing here keeps the loop tight and the lodging cheap.","Lodging: 2 budget motel rooms, about 3 people each, 2 queen beds per room, roughly $22-30 per person. Clean and safe over fancy — the group is mostly just sleeping.","Park entry $35 per private vehicle, valid 7 days.","Winter gear: pack layers, water and snacks, and over-the-shoe traction for icy rim paths.","Fuel in Flagstaff before the canyon leg; recheck the forecast and roads 24-48 hours before driving."]'::jsonb,
    '{"feeling":"This is the day the trip stops being a plan and becomes a feeling: red rock at sunrise, a Route 66 lunch at midday, then standing at the edge of something a mile deep and older than you can hold in your head as the sun goes down. Let the group go quiet here; some places earn the silence.","viewpoints":[{"title":"Bell Rock & Courthouse Butte, Sedona","detail":"Twin red-rock landmarks just south of the village, glowing in first light — an easy early stop before breakfast when the rock is amber and the crowds are thin.","source":"https://en.wikipedia.org/wiki/Bell_Rock_(Arizona)"},{"title":"Airport Mesa Overlook, Sedona","detail":"A short pull-off on the mesa with a 360° sweep of the red-rock buttes — best in early light before the breakfast stop.","source":"https://en.wikipedia.org/wiki/Sedona,_Arizona"},{"title":"Oak Creek Vista Overlook","detail":"At the top of the Oak Creek Canyon switchbacks on SR-89A, a Forest Service overlook frames the whole green canyon you just climbed out of.","source":"https://en.wikipedia.org/wiki/Oak_Creek_Canyon"},{"title":"Mather Point first look","detail":"The classic first view of the canyon just steps from the Visitor Center. Walk a little past the railing crowd along the Rim Trail to find a quieter ledge to take it in.","source":"https://www.nps.gov/grca/planyourvisit/grand-canyon-village.htm"},{"title":"Yavapai Point & Geology Museum","detail":"A short walk west of Mather along the rim; the picture windows frame the canyon and the free museum explains the layers you are looking at, two billion years of rock stacked in plain sight.","source":"https://www.nps.gov/grca/planyourvisit/yavapai-point.htm"},{"title":"Trail of Time, South Rim","detail":"A rim walk where every meter marks a million years of the canyon''s history; walking it slowly turns the view into a story instead of a photo.","source":"https://www.nps.gov/grca/planyourvisit/trail-of-time.htm"}],"hiddenGems":[{"title":"Chapel of the Holy Cross, Sedona","detail":"A modernist chapel built straight into the red rock south of town — a quiet, moving stop that most drive-through visitors skip. Free to enter.","source":"https://en.wikipedia.org/wiki/Chapel_of_the_Holy_Cross_(Sedona,_Arizona)"},{"title":"Historic Route 66, Williams","detail":"Williams was the last Route 66 town bypassed by the interstate; its neon-lit main street still trades on that history and makes a fun, cheap base for the night.","source":"https://en.wikipedia.org/wiki/Williams,_Arizona"}],"foodCulture":[{"title":"Sedona breakfast with a view","detail":"Keep the Sedona stop to a relaxed sit-down breakfast rather than a rushed drive-through; the uptown cafes with patio red-rock views are the point of stopping here at all."},{"title":"Route 66 lunch in Williams","detail":"The old-highway diners and saloons along Williams'' main street are the midday anchor of the loop — classic, cheap, and full of neon-sign nostalgia.","source":"https://en.wikipedia.org/wiki/Williams,_Arizona"}]}'::jsonb
  ),
  (
    'day-2', 'az-to-sf-2025', 2, '2026-12-28', 'Monday',
    'Grand Canyon to San Diego', 'San Diego',
    'Grand Canyon South Rim → San Diego · About 8.5-10 hr · 504 mi. The longest drive of the trip; a full driving day that ends on the coast with a downtown / Gaslamp Quarter night out.',
    '[{"id":"leg-2","from":"Grand Canyon South Rim","to":"San Diego","miles":504,"driveTime":"about 8.5-10 hr","driveTimeHoursLow":8.5,"driveTimeHoursHigh":10,"departTime":"5:30am","notes":"Route calculation is 504 miles and 8.5 hours before heavier traffic, with a high-traffic estimate of 9 hours 19 minutes. Fuel and meal stops are extra."}]'::jsonb,
    '["Winter access: South Rim is open year-round, but snow and ice can temporarily close roads. Hermit Road normally opens to private vehicles under 22 feet from December through February, weather permitting. Stay on rim viewpoints rather than adding a below-rim hike to this short visit."]'::jsonb,
    '{"feeling":"A long day behind the wheel earns a soft landing: the Pacific, salt air, and a city that moves at half the speed of the road you just drove. Don''t over-plan the evening — let San Diego decompress the group.","viewpoints":[{"title":"Sunset Cliffs Natural Park","detail":"Dramatic sandstone bluffs over the ocean in Point Loma, timed perfectly for arrival-day sunset. No ticket, no gate, just the horizon.","source":"https://www.sandiego.gov/park-and-recreation/parks/regional/shoreline/sunset"},{"title":"Cabrillo National Monument, Point Loma","detail":"The tip of the peninsula with sweeping views back across the bay and city skyline; an NPS site, so your canyon mindset carries over.","source":"https://www.nps.gov/cabr/index.htm"}],"hiddenGems":[{"title":"Gaslamp Quarter at night","detail":"Sixteen walkable downtown blocks of restored Victorian buildings, now the city''s nightlife core — the easiest place to land for a celebratory evening after the longest drive of the trip.","source":"https://en.wikipedia.org/wiki/Gaslamp_Quarter,_San_Diego"},{"title":"Balboa Park after dark","detail":"The Spanish-Revival architecture along El Prado is lit at night and the grounds stay open and free — a quiet, grand walk when the museums have closed.","source":"https://en.wikipedia.org/wiki/Balboa_Park_(San_Diego)"},{"title":"Old Town San Diego","detail":"The state historic park preserves California''s first European settlement; low-key, walkable, and a genuine sense of the region''s layered Mexican and Spanish roots.","source":"https://en.wikipedia.org/wiki/Old_Town_San_Diego_State_Historic_Park"}],"foodCulture":[{"title":"A real San Diego taco","detail":"The city''s border-shaped food culture lives in its taco shops and Baja-style seafood; a casual taqueria dinner fits the tired-but-happy arrival mood better than anything formal.","source":"https://en.wikipedia.org/wiki/San_Diego"}]}'::jsonb
  ),
  (
    'day-3', 'az-to-sf-2025', 3, '2026-12-29', 'Tuesday',
    'Early drive to Los Angeles', 'Los Angeles',
    'Relaxed San Diego morning, then San Diego → Griffith Observatory · About 2.5-4 hr · 128 mi, timed to reach Griffith at dusk.',
    '[{"id":"leg-3","from":"San Diego","to":"Griffith Observatory","miles":128,"driveTime":"about 2.5-4 hr","driveTimeHoursLow":2.5,"driveTimeHoursHigh":4,"departTime":"Midday","notes":"128-mile route measured 2 hr 19 min normally and 3 hr 49 min in the high-traffic estimate. Leave around midday so the drive lands at Griffith for golden hour."}]'::jsonb,
    '["A relaxed San Diego morning, then a drive timed so Griffith Observatory lands at dusk. If Balboa Park is a priority, keep it on the previous afternoon or this morning.","Protect this driving day: avoid adding Route 66 or Joshua Tree detours. Rotate only between listed, rested drivers. If nobody wants a drive this long, this is the first leg to replace with a flight or split with an extra night.","Night: Los Angeles. A Hollywood base fits this stop."]'::jsonb,
    '{"feeling":"LA rewards the group that treats it as a view rather than a checklist. From Griffith, the whole basin spreads out to the ocean at dusk — city lights coming on, the sign on the hill, that specific feeling of having arrived in the myth of the place.","viewpoints":[{"title":"Griffith Observatory terraces at dusk","detail":"Arrive before sunset and stay for blue hour: the free rooftop and lawn give you the Hollywood Sign on one side and the glittering LA basin on the other as the lights come up.","source":"https://en.wikipedia.org/wiki/Griffith_Observatory"},{"title":"Griffith Park trails","detail":"The surrounding park is one of the largest urban wildernesses in North America; even a short walk up toward the sign trades the parking-lot crowd for quiet ridgeline views.","source":"https://en.wikipedia.org/wiki/Griffith_Park"}],"hiddenGems":[{"title":"The Last Bookstore, Downtown","detail":"A cathedral-like independent bookstore in a former bank, with book tunnels and arches upstairs — a quietly magical, un-touristy hour if the morning stop lands downtown.","source":"https://en.wikipedia.org/wiki/The_Last_Bookstore"},{"title":"Santa Monica Pier at golden hour","detail":"If the flexible morning goes coastal instead, the pier and the end of Route 66 carry a nostalgic, carnival-light charm that photographs beautifully late in the day.","source":"https://en.wikipedia.org/wiki/Santa_Monica_Pier"}],"foodCulture":[{"title":"Grand Central Market","detail":"A century-old downtown food hall where the city''s immigrant food cultures sit side by side; a single lunch can span Mexican, Thai, and classic deli counters.","source":"https://en.wikipedia.org/wiki/Grand_Central_Market"},{"title":"Keep valuables out of sight","detail":"LA is a joy on foot, but it''s a big city: lock the car, take nothing visible, and the day stays carefree."}]}'::jsonb
  ),
  (
    'day-4', 'az-to-sf-2025', 4, '2026-12-30', 'Wednesday',
    'The Pacific Turn: Los Angeles to Monterey & Carmel', 'Monterey / Carmel, CA',
    'Los Angeles → Monterey / Carmel via US-101 · About 5.5-6 hr · ~335 mi (estimate). Trade the freeway for the Central Coast and a Pacific sunset. Nothing booked — a scenic coastal overnight.',
    '[{"id":"leg-4","from":"Los Angeles","to":"Monterey / Carmel","miles":335,"driveTime":"about 5.5-6 hr","driveTimeHoursLow":5.5,"driveTimeHoursHigh":6,"departTime":"Morning","notes":"Estimate, not a transcribed exact figure: US-101 from Los Angeles to the Monterey Peninsula is roughly 330-345 mi and about 5.5-6 hr before stops. Recheck before booking."}]'::jsonb,
    '["Night: Monterey / Carmel. A scenic coastal overnight — nothing booked.","The LA → Monterey distance and drive-time are an estimate (US-101 ~330-345 mi, ~5.5-6 hr), not a transcribed exact figure. Recheck before booking."]'::jsonb,
    '{"feeling":"This is where the trip leaves the freeway behind and turns to the sea. Cannery Row, a storybook village, and a Pacific sunset — a slower, salt-air evening that sets up the Big Sur drive to come.","viewpoints":[{"title":"Cannery Row waterfront, Monterey","detail":"The old sardine-cannery street along the bay, immortalized by Steinbeck, now a strollable waterfront with the Monterey Bay Aquarium at its end.","source":"https://en.wikipedia.org/wiki/Cannery_Row"},{"title":"Carmel Beach at sunset","detail":"A crescent of white sand below the village of Carmel-by-the-Sea, facing straight west — one of the better free sunset perches on the coast.","source":"https://en.wikipedia.org/wiki/Carmel-by-the-Sea,_California"}],"hiddenGems":[{"title":"Carmel-by-the-Sea village","detail":"A one-square-mile town of fairytale cottages, hidden courtyards and galleries, with no street addresses — made for an unhurried evening wander.","source":"https://en.wikipedia.org/wiki/Carmel-by-the-Sea,_California"},{"title":"Monterey State Historic Park","detail":"Adobe buildings from California''s Spanish and Mexican eras, walkable in the old town — a quiet counterpoint to the bustle of Cannery Row.","source":"https://en.wikipedia.org/wiki/Monterey,_California"}],"foodCulture":[{"title":"Monterey Bay seafood","detail":"The bay''s fishing heritage still shows up on the plate — clam chowder and fresh catch along Cannery Row and Fisherman''s Wharf make an easy coastal dinner.","source":"https://en.wikipedia.org/wiki/Monterey,_California"}]}'::jsonb
  ),
  (
    'day-5', 'az-to-sf-2025', 5, '2026-12-31', 'Thursday',
    'Big Sur & Midnight: Monterey → Highway 1 → San Francisco NYE', 'San Francisco, CA',
    'Monterey → Big Sur / Highway 1 (driven in full daylight) → San Francisco by evening, then a flexible New Year''s Eve. One SF night.',
    '[{"id":"leg-5","from":"Monterey","to":"San Francisco (via Big Sur / Hwy 1)","miles":140,"driveTime":"a slow full-daylight day, several hours with stops","driveTimeHoursLow":4.5,"driveTimeHoursHigh":6,"departTime":"Early morning","notes":"Estimate, not a transcribed exact figure: the Monterey → Big Sur → San Francisco coastal routing is only about 140 mi but is a slow, winding full-day drive with many stops. Drive Big Sur in full daylight. Highway 1 is prone to seasonal and storm closures — check Caltrans/NPS status before relying on the coast route, and have the US-101 inland alternative ready."}]'::jsonb,
    '["Night: San Francisco (single night). This is the last hotel night before the January 1 checkout.","Drive Big Sur / Highway 1 in full daylight. The coast road is prone to seasonal and storm-related closures — check Caltrans and NPS status before relying on it, and keep the US-101 inland route as a backup."]'::jsonb,
    '{"feeling":"The last full day, and New Year''s Eve — the trip''s emotional finish line. A morning of Big Sur cliffs gives way to the city by night; however the group rings in 2027, the point is that you do it together, somewhere that feels like the city. Keep the plan loose enough that the night can become whatever the group needs it to be.","viewpoints":[{"title":"Bixby Creek Bridge, Big Sur","detail":"One of the most photographed bridges on the California coast, its concrete arch spanning a deep canyon with the Pacific beyond — the classic Big Sur morning stop.","source":"https://en.wikipedia.org/wiki/Bixby_Creek_Bridge"},{"title":"McWay Falls, Julia Pfeiffer Burns State Park","detail":"A tidefall that drops straight onto a hidden cove beach; a short, level overlook trail delivers one of the coast''s most unreal views.","source":"https://en.wikipedia.org/wiki/McWay_Falls"},{"title":"Twin Peaks at night","detail":"The highest easy viewpoint in the city, with the whole grid of lights laid out below — a quieter place to watch midnight than the packed waterfront, if the group wants calm over crowds.","source":"https://en.wikipedia.org/wiki/Twin_Peaks_(San_Francisco)"},{"title":"Coit Tower & Telegraph Hill","detail":"Daytime: climb the Filbert Street steps through gardens to the tower for a bay panorama that stitches the whole city together.","source":"https://en.wikipedia.org/wiki/Coit_Tower"}],"hiddenGems":[{"title":"Golden Gate Park, quietly","detail":"The Japanese Tea Garden and the conservatory give the group a slow, green morning after a week of movement — the opposite energy of a countdown crowd.","source":"https://en.wikipedia.org/wiki/Golden_Gate_Park"},{"title":"16th Avenue Tiled Steps","detail":"A community-made mosaic staircase in the Sunset that climbs to a neighborhood viewpoint; the kind of small, human detail that makes a city feel personal.","source":"https://en.wikipedia.org/wiki/Hidden_Garden_Steps"}],"foodCulture":[{"title":"Dim sum in Chinatown","detail":"San Francisco''s Chinatown is the oldest in North America; a late-morning dim sum feast is both a meal and a walk through living history.","source":"https://en.wikipedia.org/wiki/Chinatown,_San_Francisco"},{"title":"North Beach, Italian SF","detail":"An espresso and pastry in the old Italian quarter, then dinner nearby, is the unhurried counterweight to a big NYE night.","source":"https://en.wikipedia.org/wiki/North_Beach,_San_Francisco"}],"nye":[{"spot":"Embarcadero & Ferry Building waterfront","detail":"The central bayfront between the Ferry Building and the piers is the traditional gathering spot to watch any midnight display over the water. Arrive early and dress in warm layers — December nights on the bay are cold and damp.","crowdNote":"Expect the largest crowds and heavy foot traffic here; it''s energetic and festive but not the place for anyone wanting quiet.","source":"https://en.wikipedia.org/wiki/San_Francisco_Ferry_Building"},{"spot":"Elevated viewpoints: Twin Peaks or Coit Tower area","detail":"For a view over the crowds, higher ground across the city lets you see the skyline and any fireworks from a distance, with far more breathing room.","crowdNote":"Much calmer than the waterfront, but it''s dark and cold up high — bring a light and warm clothing, and don''t go alone.","source":"https://en.wikipedia.org/wiki/Twin_Peaks_(San_Francisco)"},{"spot":"Neighborhood option: a North Beach or Chinatown dinner","detail":"A lower-key alternative: a long celebratory dinner in a lively neighborhood, toasting midnight somewhere warm. Perfect if the group is tired after a week of 5:30am starts.","crowdNote":"Book ahead — popular restaurants fill fast on NYE. This keeps everyone together and off the cold streets.","source":"https://en.wikipedia.org/wiki/North_Beach,_San_Francisco"},{"spot":"Getting around and staying safe","detail":"Plan transport before the night: Muni and BART run extended late-night service on New Year''s Eve in past years, and streets near the waterfront close to cars. Agree on a meeting point and keep phones charged in case the group splits up.","crowdNote":"Rideshare surges and road closures make driving near downtown painful at midnight; transit or walking from a nearby hotel is usually easier.","source":"https://www.bart.gov/"},{"spot":"An honest note on official plans","detail":"As of planning, official details for the December 31, 2026 (ring in 2027) celebration — whether there is a fireworks show, and its time and viewing area — may not be published yet. Treat the spots above as reliable gathering places and recheck the city''s official channels closer to the date before promising anyone a show.","source":"https://sf.gov/"}]}'::jsonb
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
  ('stop-1-sedona', 'day-1', 'sedona', 'Sedona sunrise and breakfast', 'meal', '7:15-9:00am', 'Reach Sedona around 7:15am. Catch the red rock in early light at Bell Rock & Courthouse Butte or the Airport Mesa Overlook, then a relaxed breakfast.'),
  ('stop-1-oak-creek-vista', 'day-1', 'oak-creek-vista', 'Oak Creek Vista Overlook', 'sightseeing', '9:30am', 'A short pull-off at the top of Oak Creek Canyon with a sweeping view back down the switchbacks.'),
  ('stop-1-williams-lunch', 'day-1', 'williams', 'Route 66 lunch in Williams', 'meal', '11:30am-12:30pm', 'Fuel in Flagstaff en route, then a Route 66 main-street lunch in Williams, the gateway town and tonight''s base.'),
  ('stop-1-south-rim', 'day-1', 'south-rim', 'Grand Canyon South Rim', 'sightseeing', '1:30pm', 'Start at Mather Point, then walk an easy section of the Rim Trail past Yavapai Point. Add Hermit Road overlooks if daylight and road conditions allow.'),
  ('stop-1-mather', 'day-1', 'mather-point', 'Mather Point', 'sightseeing', null, null),
  ('stop-1-rim-trail', 'day-1', 'rim-trail', 'Rim Trail', 'activity', null, null),
  ('stop-1-sunset', 'day-1', 'south-rim', 'Canyon sunset', 'sightseeing', '~5:00pm', 'Stay for sunset over the canyon before the drive back to Williams.'),
  ('stop-1-hermit', 'day-1', 'hermit-road', 'Hermit Road overlooks', 'flex', null, 'If daylight and road conditions allow.'),
  ('stop-1-williams-night', 'day-1', 'williams', 'Back to Williams for the night', 'checkin', 'Evening', 'Return to the Williams base after sunset. Two budget motel rooms, about three people each.'),
  ('stop-2-prep', 'day-2', null, 'Breakfast and departure prep', 'departure', '5:00am', 'Pack the car before the early start. Canyon viewing is already built into the previous afternoon.'),
  ('stop-2-depart', 'day-2', 'south-rim', 'Start the long drive', 'departure', '5:30am', '504 miles, 8.5 hr before heavier traffic (high-traffic estimate 9 hr 19 min). Fuel and meal stops are extra.'),
  ('stop-2-san-diego', 'day-2', 'san-diego', 'San Diego', 'checkin', 'Evening arrival', 'Check in after the long drive, then head downtown. If the group has energy, the Gaslamp Quarter is the natural night out; otherwise a short waterfront or Balboa Park walk.'),
  ('stop-2-gaslamp', 'day-2', 'gaslamp-quarter', 'Gaslamp Quarter (evening)', 'activity', 'Evening', 'Downtown''s walkable, lively heart — Victorian-era blocks of restaurants and bars, a good reward after a full driving day.'),
  ('stop-2-balboa', 'day-2', 'balboa-park', 'Balboa Park (optional)', 'flex', null, 'Short walk or the waterfront, not a ticketed attraction.'),
  ('stop-3-morning', 'day-3', 'san-diego', 'Relaxed San Diego morning', 'flex', 'Morning', 'Keep the morning unhurried — a slow breakfast, the waterfront or Balboa Park — before the short drive north.'),
  ('stop-3-depart', 'day-3', 'san-diego', 'Leave San Diego', 'departure', 'Midday', 'The 128-mile route to Griffith Observatory measured 2 hr 19 min normally and 3 hr 49 min in the high-traffic estimate. Time the drive to arrive at dusk.'),
  ('stop-3-griffith', 'day-3', 'griffith-observatory', 'Griffith Observatory at dusk', 'sightseeing', 'Dusk', 'See the exhibits and the Hollywood Sign view, then stay for blue hour over the LA basin. Regular Tuesday hours are noon to 10:00pm. Admission to the building is free; the closest parking is paid and planetarium tickets are separate.'),
  ('stop-4-depart', 'day-4', 'los-angeles', 'Leave Los Angeles', 'departure', 'Morning', 'Head up US-101 toward the Central Coast, leaving time for a Pacific sunset in Monterey or Carmel.'),
  ('stop-4-cannery-row', 'day-4', 'cannery-row', 'Cannery Row, Monterey', 'sightseeing', 'Afternoon', 'The waterfront street made famous by Steinbeck, now a walkable stretch of the bay with the aquarium nearby.'),
  ('stop-4-carmel', 'day-4', 'carmel', 'Carmel-by-the-Sea', 'sightseeing', 'Late afternoon', 'A storybook coastal village of cottages and galleries with a white-sand beach — a gentle place to end the drive.'),
  ('stop-4-sunset', 'day-4', 'carmel', 'Pacific sunset', 'sightseeing', 'Sunset', 'Catch sunset over the water from Carmel Beach or the Monterey shoreline before dinner.'),
  ('stop-5-depart', 'day-5', 'monterey', 'Leave Monterey early', 'departure', 'Early morning', 'Start early to drive Big Sur in full daylight and still reach San Francisco by evening.'),
  ('stop-5-bixby', 'day-5', 'bixby-bridge', 'Bixby Creek Bridge', 'sightseeing', 'Morning', 'The iconic arched span over a coastal canyon — the signature Big Sur photo stop.'),
  ('stop-5-mcway', 'day-5', 'mcway-falls', 'McWay Falls', 'sightseeing', 'Midday', 'An 80-foot waterfall dropping onto a cove beach in Julia Pfeiffer Burns State Park, viewed from a short overlook trail.'),
  ('stop-5-overlooks', 'day-5', null, 'Big Sur coastal overlooks', 'flex', 'Afternoon', 'Pull off at the cliff-edge turnouts along Highway 1 as time and daylight allow.'),
  ('stop-5-arrive-sf', 'day-5', 'san-francisco', 'Arrive in San Francisco', 'checkin', 'Evening', 'Reach the city by evening and check in for the single SF night. If this is a one-way rental, returning it here can avoid city parking; rental terms and drop fees are not priced yet.'),
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
-- ---------------------------------------------------------------------------
-- Photos (real freely-licensed Wikimedia Commons imagery + themed-gradient
-- fallbacks). url/source mirror Photo in types.ts; requires 0003 migration for
-- the photos.source column. Locations without a reliably-verifiable Commons
-- image keep url NULL and render as the themed gradient fallback.
insert into public.photos (id, url, caption, day_id, place_id, source) values
  ('photo-sedona', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Cathedral_Rock_-_Sedona_AZ-1.jpg/1280px-Cathedral_Rock_-_Sedona_AZ-1.jpg', 'Cathedral Rock at sunset, Sedona', 'day-1', 'sedona', 'Terrydarc / Wikimedia Commons / CC BY-SA 3.0 · https://commons.wikimedia.org/wiki/File:Cathedral_Rock_-_Sedona_AZ-1.jpg'),
  ('photo-oak-creek-vista', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Coconino_County_-_Oak_Creek_Canyon.jpg/1280px-Coconino_County_-_Oak_Creek_Canyon.jpg', 'Oak Creek Canyon from the Oak Creek Vista', 'day-1', 'oak-creek-vista', 'Eric Polk / Wikimedia Commons / CC BY-SA 4.0 · https://commons.wikimedia.org/wiki/File:Coconino_County_-_Oak_Creek_Canyon.jpg'),
  ('photo-williams', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Williams-Streetscape.jpg/1280px-Williams-Streetscape.jpg', 'Route 66 main street in Williams', 'day-1', 'williams', 'Steven C. Price / Wikimedia Commons / CC BY-SA 4.0 · https://commons.wikimedia.org/wiki/File:Williams-Streetscape.jpg'),
  ('photo-south-rim', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Grand_Canyon_Mather_Point_2013.jpg/1280px-Grand_Canyon_Mather_Point_2013.jpg', 'The Grand Canyon from Mather Point', 'day-1', 'mather-point', 'Tuxyso / Wikimedia Commons / CC BY-SA 3.0 · https://commons.wikimedia.org/wiki/File:Grand_Canyon_Mather_Point_2013.jpg'),
  ('photo-gaslamp', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/San_Diego_%28California%2C_USA%29%2C_Gaslamp_Quarter_--_2012_--_5411.jpg/1280px-San_Diego_%28California%2C_USA%29%2C_Gaslamp_Quarter_--_2012_--_5411.jpg', 'Gaslamp Quarter, San Diego', 'day-2', 'gaslamp-quarter', 'Dietmar Rabich / Wikimedia Commons / CC BY-SA 4.0 · https://commons.wikimedia.org/wiki/File:San_Diego_(California,_USA),_Gaslamp_Quarter_--_2012_--_5411.jpg'),
  ('photo-sunset-cliffs', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunset_Cliffs_San_Diego_2013.jpg/1280px-Sunset_Cliffs_San_Diego_2013.jpg', 'Sunset Cliffs Natural Park, Point Loma', 'day-2', 'san-diego', 'Tuxyso / Wikimedia Commons / CC BY-SA 3.0 · https://commons.wikimedia.org/wiki/File:Sunset_Cliffs_San_Diego_2013.jpg'),
  ('photo-balboa', null, 'Evening walk through Balboa Park, San Diego', 'day-2', 'balboa-park', null),
  ('photo-griffith', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Griffith_Observatory_-_Dusk.jpg/1280px-Griffith_Observatory_-_Dusk.jpg', 'Griffith Observatory at dusk', 'day-3', 'griffith-observatory', 'Jeremye77 / Wikimedia Commons / CC BY-SA 4.0 · https://commons.wikimedia.org/wiki/File:Griffith_Observatory_-_Dusk.jpg'),
  ('photo-cannery-row', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Cannery_Row%2C_Monterey%2C_California.jpg/1280px-Cannery_Row%2C_Monterey%2C_California.jpg', 'Cannery Row waterfront, Monterey', 'day-4', 'cannery-row', 'Lance Vanlewen / Wikimedia Commons / CC BY-SA 4.0 · https://commons.wikimedia.org/wiki/File:Cannery_Row,_Monterey,_California.jpg'),
  ('photo-carmel', null, 'Pacific sunset at Carmel-by-the-Sea', 'day-4', 'carmel', null),
  ('photo-bixby-bridge', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Bixby_Creek_Bridge_May_2011_001.jpg/1280px-Bixby_Creek_Bridge_May_2011_001.jpg', 'Bixby Creek Bridge on Big Sur''s Highway 1', 'day-5', 'bixby-bridge', 'King of Hearts / Wikimedia Commons / CC BY-SA 3.0 · https://commons.wikimedia.org/wiki/File:Bixby_Creek_Bridge_May_2011_001.jpg'),
  ('photo-mcway-falls', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/McWay_Falls_Big_Sur_May_2011_001.jpg/1280px-McWay_Falls_Big_Sur_May_2011_001.jpg', 'McWay Falls dropping onto its hidden cove', 'day-5', 'mcway-falls', 'King of Hearts / Wikimedia Commons / CC BY-SA 3.0 · https://commons.wikimedia.org/wiki/File:McWay_Falls_Big_Sur_May_2011_001.jpg'),
  ('photo-golden-gate', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Golden_Gate_Bridge_as_seen_from_Marshall%E2%80%99s_Beach%2C_March_2018.jpg/1280px-Golden_Gate_Bridge_as_seen_from_Marshall%E2%80%99s_Beach%2C_March_2018.jpg', 'Golden Gate Bridge from Marshall''s Beach, San Francisco', 'day-5', 'golden-gate', 'Frank Schulenburg / Wikimedia Commons / CC BY-SA 4.0 · https://commons.wikimedia.org/wiki/File:Golden_Gate_Bridge_as_seen_from_Marshall%E2%80%99s_Beach,_March_2018.jpg')
on conflict (id) do update set
  url = excluded.url,
  caption = excluded.caption,
  day_id = excluded.day_id,
  place_id = excluded.place_id,
  source = excluded.source;
-- ---------------------------------------------------------------------------
-- Per-day hero images (freely-licensed Wikimedia Commons). Requires the
-- days.hero_image column from 0003. Mirrors Day.heroImage in types.ts.
update public.days set hero_image = '{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Grand_Canyon_South_Rim_at_Sunset.jpg/1280px-Grand_Canyon_South_Rim_at_Sunset.jpg","source":"Mgimelfarb / Wikimedia Commons / CC0 · https://commons.wikimedia.org/wiki/File:Grand_Canyon_South_Rim_at_Sunset.jpg"}'::jsonb where id = 'day-1';
update public.days set hero_image = '{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunset_Cliffs_San_Diego_2013.jpg/1280px-Sunset_Cliffs_San_Diego_2013.jpg","source":"Tuxyso / Wikimedia Commons / CC BY-SA 3.0 · https://commons.wikimedia.org/wiki/File:Sunset_Cliffs_San_Diego_2013.jpg"}'::jsonb where id = 'day-2';
update public.days set hero_image = '{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Griffith_Observatory_-_Dusk.jpg/1280px-Griffith_Observatory_-_Dusk.jpg","source":"Jeremye77 / Wikimedia Commons / CC BY-SA 4.0 · https://commons.wikimedia.org/wiki/File:Griffith_Observatory_-_Dusk.jpg"}'::jsonb where id = 'day-3';
update public.days set hero_image = '{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Cannery_Row%2C_Monterey%2C_California.jpg/1280px-Cannery_Row%2C_Monterey%2C_California.jpg","source":"Lance Vanlewen / Wikimedia Commons / CC BY-SA 4.0 · https://commons.wikimedia.org/wiki/File:Cannery_Row,_Monterey,_California.jpg"}'::jsonb where id = 'day-4';
update public.days set hero_image = '{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Golden_Gate_Bridge_as_seen_from_Marshall%E2%80%99s_Beach%2C_March_2018.jpg/1280px-Golden_Gate_Bridge_as_seen_from_Marshall%E2%80%99s_Beach%2C_March_2018.jpg","source":"Frank Schulenburg / Wikimedia Commons / CC BY-SA 4.0 · https://commons.wikimedia.org/wiki/File:Golden_Gate_Bridge_as_seen_from_Marshall%E2%80%99s_Beach,_March_2018.jpg"}'::jsonb where id = 'day-5';
