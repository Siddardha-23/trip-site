// Seed data for the Arizona -> San Francisco trip.
// SINGLE SOURCE OF TRUTH: transcribed verbatim from _itinerary_extracted.txt.
// Do not invent figures. Mileage, drive-times, costs and warnings are exact.

import type {
  BudgetItem,
  ChecklistItem,
  OpenDecision,
  Person,
  Photo,
  Place,
  RentalAgreement,
  Trip,
  WeatherCard,
} from "@/lib/types";

export const places: Place[] = [
  {
    id: "tempe",
    name: "Tempe",
    city: "Tempe, AZ",
    lat: null,
    lng: null,
    category: "start",
    description: "Trip start and pickup point. Exact pickup can change mileage slightly.",
  },
  {
    id: "sedona",
    name: "Sedona",
    city: "Sedona, AZ",
    lat: null,
    lng: null,
    category: "sightseeing",
    description: "Breakfast and a short red-rock stop.",
  },
  {
    id: "south-rim",
    name: "Grand Canyon South Rim",
    city: "Grand Canyon, AZ",
    lat: null,
    lng: null,
    category: "national-park",
    description: "Start at Mather Point, then an easy section of the Rim Trail.",
  },
  {
    id: "mather-point",
    name: "Mather Point",
    city: "Grand Canyon, AZ",
    lat: null,
    lng: null,
    category: "viewpoint",
  },
  {
    id: "rim-trail",
    name: "Rim Trail",
    city: "Grand Canyon, AZ",
    lat: null,
    lng: null,
    category: "trail",
  },
  {
    id: "hermit-road",
    name: "Hermit Road",
    city: "Grand Canyon, AZ",
    lat: null,
    lng: null,
    category: "scenic-drive",
    description:
      "Add overlooks if daylight and road conditions allow. Normally open to private vehicles under 22 feet Dec-Feb, weather permitting.",
  },
  {
    id: "san-diego",
    name: "San Diego",
    city: "San Diego, CA",
    lat: null,
    lng: null,
    category: "city",
  },
  {
    id: "balboa-park",
    name: "Balboa Park",
    city: "San Diego, CA",
    lat: null,
    lng: null,
    category: "park",
    description: "Grounds admission free; museums and parking can cost extra.",
  },
  {
    id: "griffith-observatory",
    name: "Griffith Observatory",
    city: "Los Angeles, CA",
    lat: null,
    lng: null,
    category: "sightseeing",
    description:
      "Exhibits and the Hollywood Sign view. Building admission free; parking paid, planetarium tickets separate.",
  },
  {
    id: "los-angeles",
    name: "Los Angeles",
    city: "Los Angeles, CA",
    lat: null,
    lng: null,
    category: "city",
  },
  {
    id: "san-francisco",
    name: "San Francisco",
    city: "San Francisco, CA",
    lat: null,
    lng: null,
    category: "city",
  },
  {
    id: "golden-gate",
    name: "Golden Gate Bridge",
    city: "San Francisco, CA",
    lat: null,
    lng: null,
    category: "sightseeing",
  },
  {
    id: "palace-of-fine-arts",
    name: "Palace of Fine Arts",
    city: "San Francisco, CA",
    lat: null,
    lng: null,
    category: "sightseeing",
  },
  {
    id: "ferry-building",
    name: "Ferry Building",
    city: "San Francisco, CA",
    lat: null,
    lng: null,
    category: "sightseeing",
    description: "Ferry Building and Embarcadero.",
  },
  {
    id: "chinatown",
    name: "Chinatown",
    city: "San Francisco, CA",
    lat: null,
    lng: null,
    category: "neighborhood",
  },
  {
    id: "north-beach",
    name: "North Beach",
    city: "San Francisco, CA",
    lat: null,
    lng: null,
    category: "neighborhood",
  },
];

export const trip: Trip = {
  id: "az-to-sf-2025",
  title: "Arizona to San Francisco",
  subtitle: "Dec 27-Jan 1 · 5 nights · 4 people",
  startDate: "2026-12-27",
  endDate: "2026-12-31", // last hotel night (2nd SF night)
  checkoutDate: "2027-01-01",
  nights: 5,
  travelerCount: 4,
  roomSetup: "1 room · 2 queen beds",
  totalIntercityMiles: 1282, // "About 1,282 mi, plus local driving"
  totalDrivingHours: 21.4, // "About 21.4 hr before heavy traffic and stops"
  pace: "Fast; 5:30am starts, December 28 is a full driving day",
  bookingStatus: "Nothing booked. This is a planning draft.",
  overnightSummary: "South Rim 1 · San Diego 1 · Los Angeles 1 · San Francisco 2",
  days: [
    {
      id: "day-1",
      dayNumber: 1,
      date: "2026-12-27",
      weekday: "Sunday",
      title: "Sedona to the Grand Canyon South Rim",
      overnight: "South Rim or Tusayan",
      summary:
        "Tempe → Sedona → South Rim · About 4.5-5 hr · 270 mi. Early start preserves most of the day for the canyon.",
      legs: [
        {
          id: "leg-1a",
          from: "Tempe",
          to: "Sedona",
          miles: 125,
          driveTime: "about 2 hr",
          driveTimeHoursLow: 2,
          driveTimeHoursHigh: 2,
          departTime: "5:30am",
          notes: "Leave Tempe at 5:30am; preferred early-morning window.",
        },
        {
          id: "leg-1b",
          from: "Sedona",
          to: "South Rim",
          miles: 145,
          driveTime: "about 2.5-3 hr",
          driveTimeHoursLow: 2.5,
          driveTimeHoursHigh: 3,
        },
      ],
      stops: [
        {
          id: "stop-1-tempe",
          placeId: "tempe",
          name: "Leave Tempe",
          kind: "departure",
          time: "5:30am",
          description:
            "Preferred early-morning window. Exact pickup point can change the mileage slightly.",
        },
        {
          id: "stop-1-sedona",
          placeId: "sedona",
          name: "Sedona",
          kind: "meal",
          time: "7:45-9:15am",
          description:
            "Have breakfast and take a short red-rock stop. The early start preserves most of the day for the canyon.",
        },
        {
          id: "stop-1-south-rim",
          placeId: "south-rim",
          name: "Grand Canyon South Rim",
          kind: "sightseeing",
          time: "Around midday",
          description:
            "Start at Mather Point, then walk an easy section of the Rim Trail. Add Hermit Road overlooks if daylight and road conditions allow.",
        },
        {
          id: "stop-1-mather",
          placeId: "mather-point",
          name: "Mather Point",
          kind: "sightseeing",
        },
        {
          id: "stop-1-rim-trail",
          placeId: "rim-trail",
          name: "Rim Trail",
          kind: "activity",
        },
        {
          id: "stop-1-hermit",
          placeId: "hermit-road",
          name: "Hermit Road overlooks",
          kind: "flex",
          description: "If daylight and road conditions allow.",
        },
      ],
      notes: [
        "Night: South Rim or Tusayan. Staying inside the park reduces driving; Tusayan is the closest outside-park base.",
        "Park entry $35 per private vehicle, valid 7 days.",
      ],
      experiences: {
        feeling:
          "This is the day the trip stops being a plan and becomes a feeling: red rock at sunrise, then standing at the edge of something a mile deep and older than you can hold in your head. Let the group go quiet here; some places earn the silence.",
        viewpoints: [
          {
            title: "Airport Mesa Overlook, Sedona",
            detail:
              "A short pull-off on the mesa with a 360° sweep of the red-rock buttes — best in early light before the breakfast stop, when the rock glows and the crowds are thin.",
            source: "https://en.wikipedia.org/wiki/Sedona,_Arizona",
          },
          {
            title: "Mather Point first look",
            detail:
              "The classic first view of the canyon just steps from the Visitor Center. Walk a little past the railing crowd along the Rim Trail to find a quieter ledge to take it in.",
            source:
              "https://www.nps.gov/grca/planyourvisit/grand-canyon-village.htm",
          },
          {
            title: "Yavapai Point & Geology Museum",
            detail:
              "A short walk west of Mather along the rim; the picture windows frame the canyon and the free museum explains the layers you are looking at, two billion years of rock stacked in plain sight.",
            source: "https://www.nps.gov/grca/planyourvisit/yavapai-point.htm",
          },
        ],
        hiddenGems: [
          {
            title: "Chapel of the Holy Cross, Sedona",
            detail:
              "A modernist chapel built straight into the red rock south of town — a quiet, moving stop that most drive-through visitors skip. Free to enter.",
            source: "https://en.wikipedia.org/wiki/Chapel_of_the_Holy_Cross_(Sedona,_Arizona)",
          },
          {
            title: "Trail of Time, South Rim",
            detail:
              "A rim walk where every meter marks a million years of the canyon's history; walking it slowly turns the view into a story instead of a photo.",
            source: "https://www.nps.gov/grca/planyourvisit/trail-of-time.htm",
          },
        ],
        foodCulture: [
          {
            title: "Sedona breakfast with a view",
            detail:
              "Keep the Sedona stop to a relaxed sit-down breakfast rather than a rushed drive-through; the uptown cafes with patio red-rock views are the point of stopping here at all.",
          },
          {
            title: "Pack a canyon picnic",
            detail:
              "Grab provisions before the rim — eating a simple lunch on a quiet overlook beats waiting for a crowded park cafe, and the view is free.",
          },
        ],
      },
    },
    {
      id: "day-2",
      dayNumber: 2,
      date: "2026-12-28",
      weekday: "Monday",
      title: "Grand Canyon to San Diego",
      overnight: "San Diego",
      summary:
        "South Rim → San Diego · About 8.5-10 hr · 504 mi. The longest drive of the trip; a full driving day.",
      legs: [
        {
          id: "leg-2",
          from: "South Rim",
          to: "San Diego",
          miles: 504,
          driveTime: "about 8.5-10 hr",
          driveTimeHoursLow: 8.5,
          driveTimeHoursHigh: 10,
          departTime: "5:30am",
          notes:
            "Route calculation is 504 miles and 8.5 hours before heavier traffic, with a high-traffic estimate of 9 hours 19 minutes. Fuel and meal stops are extra.",
        },
      ],
      stops: [
        {
          id: "stop-2-prep",
          name: "Breakfast and departure prep",
          kind: "departure",
          time: "5:00am",
          description:
            "Pack the car before the early start. Canyon viewing is already built into the previous afternoon.",
        },
        {
          id: "stop-2-depart",
          placeId: "south-rim",
          name: "Start the long drive",
          kind: "departure",
          time: "5:30am",
          description:
            "504 miles, 8.5 hr before heavier traffic (high-traffic estimate 9 hr 19 min). Fuel and meal stops are extra.",
        },
        {
          id: "stop-2-san-diego",
          placeId: "san-diego",
          name: "San Diego",
          kind: "checkin",
          time: "Mid-to-late afternoon",
          description:
            "Check in and keep the evening flexible. If the group has energy, choose a short Balboa Park walk or the waterfront, not a ticketed attraction.",
        },
        {
          id: "stop-2-balboa",
          placeId: "balboa-park",
          name: "Balboa Park (optional)",
          kind: "flex",
          description: "Short walk or the waterfront, not a ticketed attraction.",
        },
      ],
      notes: [
        "Winter access: South Rim is open year-round, but snow and ice can temporarily close roads. Hermit Road normally opens to private vehicles under 22 feet from December through February, weather permitting. Stay on rim viewpoints rather than adding a below-rim hike to this short visit.",
      ],
      experiences: {
        feeling:
          "A long day behind the wheel earns a soft landing: the Pacific, salt air, and a city that moves at half the speed of the road you just drove. Don't over-plan the evening — let San Diego decompress the group.",
        viewpoints: [
          {
            title: "Sunset Cliffs Natural Park",
            detail:
              "Dramatic sandstone bluffs over the ocean in Point Loma, timed perfectly for arrival-day sunset. No ticket, no gate, just the horizon.",
            source: "https://www.sandiego.gov/park-and-recreation/parks/regional/shoreline/sunset",
          },
          {
            title: "Cabrillo National Monument, Point Loma",
            detail:
              "The tip of the peninsula with sweeping views back across the bay and city skyline; an NPS site, so your canyon mindset carries over.",
            source: "https://www.nps.gov/cabr/index.htm",
          },
        ],
        hiddenGems: [
          {
            title: "Balboa Park after dark",
            detail:
              "The Spanish-Revival architecture along El Prado is lit at night and the grounds stay open and free — a quiet, grand walk when the museums have closed.",
            source: "https://en.wikipedia.org/wiki/Balboa_Park_(San_Diego)",
          },
          {
            title: "Old Town San Diego",
            detail:
              "The state historic park preserves California's first European settlement; low-key, walkable, and a genuine sense of the region's layered Mexican and Spanish roots.",
            source: "https://en.wikipedia.org/wiki/Old_Town_San_Diego_State_Historic_Park",
          },
        ],
        foodCulture: [
          {
            title: "A real San Diego taco",
            detail:
              "The city's border-shaped food culture lives in its taco shops and Baja-style seafood; a casual taqueria dinner fits the tired-but-happy arrival mood better than anything formal.",
            source: "https://en.wikipedia.org/wiki/San_Diego",
          },
        ],
      },
    },
    {
      id: "day-3",
      dayNumber: 3,
      date: "2026-12-29",
      weekday: "Tuesday",
      title: "Early drive to Los Angeles",
      overnight: "Los Angeles",
      summary:
        "San Diego → Griffith Observatory · About 2.5-4 hr · 128 mi.",
      legs: [
        {
          id: "leg-3",
          from: "San Diego",
          to: "Griffith Observatory",
          miles: 128,
          driveTime: "about 2.5-4 hr",
          driveTimeHoursLow: 2.5,
          driveTimeHoursHigh: 4,
          departTime: "5:30am",
          notes:
            "128-mile route measured 2 hr 19 min normally and 3 hr 49 min in the high-traffic estimate.",
        },
      ],
      stops: [
        {
          id: "stop-3-depart",
          placeId: "san-diego",
          name: "Leave San Diego",
          kind: "departure",
          time: "5:30am",
          description:
            "The 128-mile route to Griffith Observatory measured 2 hr 19 min normally and 3 hr 49 min in the high-traffic estimate.",
        },
        {
          id: "stop-3-morning",
          name: "Hollywood or Santa Monica",
          kind: "flex",
          time: "Morning",
          description:
            "Choose one flexible stop while waiting for the Observatory to open. Keep bags secured and do not leave valuables visible in the car.",
        },
        {
          id: "stop-3-griffith",
          placeId: "griffith-observatory",
          name: "Griffith Observatory",
          kind: "sightseeing",
          time: "Noon-afternoon",
          description:
            "See the exhibits and the Hollywood Sign view. Regular Tuesday hours are noon to 10:00pm. Admission to the building is free; the closest parking is paid and planetarium tickets are separate.",
        },
      ],
      notes: [
        "This early start trades a San Diego morning for more usable time in Los Angeles. If Balboa Park is a priority, keep it on the previous afternoon or move this drive back to early afternoon.",
        "Protect this driving day: keep the 5:30am start and avoid adding Route 66 or Joshua Tree detours. Rotate only between listed, rested drivers. If nobody wants a drive this long, this is the first leg to replace with a flight or split with an extra night.",
        "Night: Los Angeles. A Hollywood base fits this stop.",
      ],
      experiences: {
        feeling:
          "LA rewards the group that treats it as a view rather than a checklist. From Griffith, the whole basin spreads out to the ocean at dusk — city lights coming on, the sign on the hill, that specific feeling of having arrived in the myth of the place.",
        viewpoints: [
          {
            title: "Griffith Observatory terraces at dusk",
            detail:
              "Arrive before sunset and stay for blue hour: the free rooftop and lawn give you the Hollywood Sign on one side and the glittering LA basin on the other as the lights come up.",
            source: "https://en.wikipedia.org/wiki/Griffith_Observatory",
          },
          {
            title: "Griffith Park trails",
            detail:
              "The surrounding park is one of the largest urban wildernesses in North America; even a short walk up toward the sign trades the parking-lot crowd for quiet ridgeline views.",
            source: "https://en.wikipedia.org/wiki/Griffith_Park",
          },
        ],
        hiddenGems: [
          {
            title: "The Last Bookstore, Downtown",
            detail:
              "A cathedral-like independent bookstore in a former bank, with book tunnels and arches upstairs — a quietly magical, un-touristy hour if the morning stop lands downtown.",
            source: "https://en.wikipedia.org/wiki/The_Last_Bookstore",
          },
          {
            title: "Santa Monica Pier at golden hour",
            detail:
              "If the flexible morning goes coastal instead, the pier and the end of Route 66 carry a nostalgic, carnival-light charm that photographs beautifully late in the day.",
            source: "https://en.wikipedia.org/wiki/Santa_Monica_Pier",
          },
        ],
        foodCulture: [
          {
            title: "Grand Central Market",
            detail:
              "A century-old downtown food hall where the city's immigrant food cultures sit side by side; a single lunch can span Mexican, Thai, and classic deli counters.",
            source: "https://en.wikipedia.org/wiki/Grand_Central_Market",
          },
          {
            title: "Keep valuables out of sight",
            detail:
              "LA is a joy on foot, but it's a big city: lock the car, take nothing visible, and the day stays carefree.",
          },
        ],
      },
    },
    {
      id: "day-4",
      dayNumber: 4,
      date: "2026-12-30",
      weekday: "Wednesday",
      title: "Los Angeles to San Francisco",
      overnight: "San Francisco",
      summary:
        "Los Angeles → San Francisco via I-5 · About 6-7.5 hr · 380 mi.",
      legs: [
        {
          id: "leg-4",
          from: "Los Angeles",
          to: "San Francisco",
          miles: 380,
          driveTime: "about 6-7.5 hr",
          driveTimeHoursLow: 6,
          driveTimeHoursHigh: 7.5,
          departTime: "5:30am",
          notes:
            "Use I-5 for this five-night version. The 380-mile route measured 6 hr normally and 7 hr 20 min in the high-traffic estimate, before a meal stop.",
        },
      ],
      stops: [
        {
          id: "stop-4-depart",
          placeId: "los-angeles",
          name: "Leave Los Angeles",
          kind: "departure",
          time: "5:30am",
          description: "Use I-5 for this five-night version.",
        },
        {
          id: "stop-4-arrive",
          placeId: "san-francisco",
          name: "Arrive in San Francisco",
          kind: "checkin",
          time: "Midday-to-early afternoon",
          description:
            "Check in for two nights. If this is a one-way rental, returning it here can avoid two nights of city parking; rental terms and drop fees are not priced yet.",
        },
        {
          id: "stop-4-golden-gate",
          placeId: "golden-gate",
          name: "Golden Gate Bridge",
          kind: "sightseeing",
          time: "Late afternoon",
          description:
            "Choose the Golden Gate Bridge and Palace of Fine Arts if visibility is good. Otherwise use the Ferry Building and Embarcadero.",
        },
        {
          id: "stop-4-palace",
          placeId: "palace-of-fine-arts",
          name: "Palace of Fine Arts",
          kind: "sightseeing",
          time: "Late afternoon",
        },
      ],
      notes: [
        "If this is a one-way rental, returning it in SF can avoid two nights of city parking; rental terms and drop fees are not priced yet.",
      ],
      experiences: {
        feeling:
          "The last long drive ends at the edge of the continent. Timing the arrival for late-afternoon light at the Golden Gate — if the fog cooperates — gives the group a shared 'we made it' moment that the whole trip has been building toward.",
        viewpoints: [
          {
            title: "Battery Spencer, Marin side",
            detail:
              "Just north of the bridge, this old gun battery frames the towers against the city skyline — the definitive Golden Gate view, and free. Weather and fog permitting.",
            source: "https://en.wikipedia.org/wiki/Golden_Gate_Bridge",
          },
          {
            title: "Palace of Fine Arts lagoon",
            detail:
              "A surviving 1915 exposition rotunda reflected in a still lagoon; calm, grand, and a gentle contrast to a day of freeway after the bridge.",
            source: "https://en.wikipedia.org/wiki/Palace_of_Fine_Arts",
          },
        ],
        hiddenGems: [
          {
            title: "Fort Point under the bridge",
            detail:
              "A Civil War-era brick fort directly beneath the south anchorage; standing under the roaring span is a very different feeling from seeing it from afar.",
            source: "https://www.nps.gov/fopo/index.htm",
          },
          {
            title: "The Embarcadero walk",
            detail:
              "If the bridge is fogged in, the waterfront promenade from the Ferry Building toward the bridge is a reliable, beautiful plan B with open bay views.",
            source: "https://en.wikipedia.org/wiki/The_Embarcadero_(San_Francisco)",
          },
        ],
        foodCulture: [
          {
            title: "Ferry Building Marketplace",
            detail:
              "A restored ferry terminal turned food hall of Northern California makers — a perfect low-key arrival dinner showcasing the region's produce and coffee culture.",
            source: "https://en.wikipedia.org/wiki/San_Francisco_Ferry_Building",
          },
        ],
      },
    },
    {
      id: "day-5",
      dayNumber: 5,
      date: "2026-12-31",
      weekday: "Thursday",
      title: "A full San Francisco day",
      overnight: "San Francisco (2nd night)",
      summary:
        "A full city day and a flexible New Year's Eve. 2nd SF night in the same hotel.",
      legs: [],
      stops: [
        {
          id: "stop-5-ferry",
          placeId: "ferry-building",
          name: "Ferry Building and Embarcadero",
          kind: "sightseeing",
          time: "Morning",
          description:
            "Keep the first morning unhurried after three consecutive intercity drives.",
        },
        {
          id: "stop-5-chinatown",
          placeId: "chinatown",
          name: "Chinatown",
          kind: "activity",
          time: "Afternoon",
          description:
            "Use the compact Chinatown + North Beach pairing for food, walking and city views. If Golden Gate was fogged out the day before, make that the afternoon priority instead.",
        },
        {
          id: "stop-5-north-beach",
          placeId: "north-beach",
          name: "North Beach",
          kind: "activity",
          time: "Afternoon",
        },
        {
          id: "stop-5-nye",
          name: "Flexible New Year's Eve",
          kind: "flex",
          time: "Evening",
          description:
            "Keep dinner and late plans adjustable until official 2027 event details are published.",
        },
      ],
      notes: [
        "Night: second night in San Francisco. Staying in the same hotel avoids a New Year's Day checkout move.",
        "No Big Sur detour in this version. Highway 1 is not part of the timed route; adding the coast would need a different pace or another night.",
      ],
      experiences: {
        feeling:
          "The last full day, and New Year's Eve — the trip's emotional finish line. However the group rings in 2027, the point is that you do it together, somewhere that feels like the city. Keep the plan loose enough that the night can become whatever the group needs it to be.",
        viewpoints: [
          {
            title: "Twin Peaks at night",
            detail:
              "The highest easy viewpoint in the city, with the whole grid of lights laid out below — a quieter place to watch midnight than the packed waterfront, if the group wants calm over crowds.",
            source: "https://en.wikipedia.org/wiki/Twin_Peaks_(San_Francisco)",
          },
          {
            title: "Coit Tower & Telegraph Hill",
            detail:
              "Daytime: climb the Filbert Street steps through gardens to the tower for a bay panorama that stitches the whole city together.",
            source: "https://en.wikipedia.org/wiki/Coit_Tower",
          },
        ],
        hiddenGems: [
          {
            title: "Golden Gate Park, quietly",
            detail:
              "The Japanese Tea Garden and the conservatory give the group a slow, green morning after a week of movement — the opposite energy of a countdown crowd.",
            source: "https://en.wikipedia.org/wiki/Golden_Gate_Park",
          },
          {
            title: "16th Avenue Tiled Steps",
            detail:
              "A community-made mosaic staircase in the Sunset that climbs to a neighborhood viewpoint; the kind of small, human detail that makes a city feel personal.",
            source: "https://en.wikipedia.org/wiki/Hidden_Garden_Steps",
          },
        ],
        foodCulture: [
          {
            title: "Dim sum in Chinatown",
            detail:
              "San Francisco's Chinatown is the oldest in North America; a late-morning dim sum feast is both a meal and a walk through living history.",
            source: "https://en.wikipedia.org/wiki/Chinatown,_San_Francisco",
          },
          {
            title: "North Beach, Italian SF",
            detail:
              "An espresso and pastry in the old Italian quarter, then dinner nearby, is the unhurried counterweight to a big NYE night.",
            source: "https://en.wikipedia.org/wiki/North_Beach,_San_Francisco",
          },
        ],
        nye: [
          {
            spot: "Embarcadero & Ferry Building waterfront",
            detail:
              "The central bayfront between the Ferry Building and the piers is the traditional gathering spot to watch any midnight display over the water. Arrive early and dress in warm layers — December nights on the bay are cold and damp.",
            crowdNote:
              "Expect the largest crowds and heavy foot traffic here; it's energetic and festive but not the place for anyone wanting quiet.",
            source: "https://en.wikipedia.org/wiki/San_Francisco_Ferry_Building",
          },
          {
            spot: "Elevated viewpoints: Twin Peaks or Coit Tower area",
            detail:
              "For a view over the crowds, higher ground across the city lets you see the skyline and any fireworks from a distance, with far more breathing room.",
            crowdNote:
              "Much calmer than the waterfront, but it's dark and cold up high — bring a light and warm clothing, and don't go alone.",
            source: "https://en.wikipedia.org/wiki/Twin_Peaks_(San_Francisco)",
          },
          {
            spot: "Neighborhood option: a North Beach or Chinatown dinner",
            detail:
              "A lower-key alternative: a long celebratory dinner in a lively neighborhood, toasting midnight somewhere warm. Perfect if the group is tired after a week of 5:30am starts.",
            crowdNote:
              "Book ahead — popular restaurants fill fast on NYE. This keeps everyone together and off the cold streets.",
            source: "https://en.wikipedia.org/wiki/North_Beach,_San_Francisco",
          },
          {
            spot: "Getting around and staying safe",
            detail:
              "Plan transport before the night: Muni and BART run extended late-night service on New Year's Eve in past years, and streets near the waterfront close to cars. Agree on a meeting point and keep phones charged in case the group splits up.",
            crowdNote:
              "Rideshare surges and road closures make driving near downtown painful at midnight; transit or walking from a nearby hotel is usually easier.",
            source: "https://www.bart.gov/",
          },
          {
            spot: "An honest note on official plans",
            detail:
              "As of planning, official details for the December 31, 2026 (ring in 2027) celebration — whether there is a fireworks show, and its time and viewing area — may not be published yet. Treat the spots above as reliable gathering places and recheck the city's official channels closer to the date before promising anyone a show.",
            source: "https://sf.gov/",
          },
        ],
      },
    },
    {
      id: "day-checkout",
      dayNumber: 6,
      date: "2027-01-01",
      weekday: "Friday",
      title: "Departure and the missing return leg",
      overnight: null,
      summary:
        "Check out of the San Francisco hotel. This is not a sixth hotel night.",
      legs: [],
      stops: [
        {
          id: "stop-checkout",
          placeId: "san-francisco",
          name: "Check out",
          kind: "departure",
          description:
            "No flight, drive back to Arizona or other return leg is included yet. If you need to be back in Arizona on January 1, the route and pacing need to change before anything is booked.",
        },
      ],
      notes: [
        "Friday, January 1 is checkout and departure. It is not a sixth hotel night.",
      ],
    },
  ],
};

// 4 adults, placeholder people (names to be filled by the group).
export const people: Person[] = [
  {
    id: "person-1",
    name: "Traveler 1",
    isAdult: true,
    rsvp: "pending",
    canDrive: true,
    avatarColor: "#ef4444",
  },
  {
    id: "person-2",
    name: "Traveler 2",
    isAdult: true,
    rsvp: "pending",
    canDrive: true,
    avatarColor: "#3b82f6",
  },
  {
    id: "person-3",
    name: "Traveler 3",
    isAdult: true,
    rsvp: "pending",
    canDrive: true,
    avatarColor: "#22c55e",
  },
  {
    id: "person-4",
    name: "Traveler 4",
    isAdult: true,
    rsvp: "pending",
    canDrive: true,
    avatarColor: "#eab308",
  },
];

// Costs: what is priced and what is not (transcribed exactly).
export const budgetItems: BudgetItem[] = [
  {
    id: "budget-park-entry",
    label: "Grand Canyon park entry",
    category: "park",
    priced: true,
    amount: 35,
    notes:
      "$35 for one private, non-commercial vehicle and its passengers, valid for seven days. NPS currently says entry has no reservation or timed-entry requirement.",
  },
  {
    id: "budget-nonresident-fee",
    label: "Possible non-US-resident NPS fee",
    category: "park",
    priced: false,
    amount: null,
    notes:
      "NPS lists an additional $100 per non-US resident aged 16 or older, unless admitted with an Annual or America the Beautiful Pass. Residency has not been assumed.",
  },
  {
    id: "budget-balboa",
    label: "Balboa Park grounds",
    category: "activity",
    priced: true,
    amount: 0,
    notes:
      "Free as currently published. Museums, planetarium shows and parking can cost extra.",
  },
  {
    id: "budget-griffith",
    label: "Griffith Observatory building",
    category: "activity",
    priced: true,
    amount: 0,
    notes:
      "Building admission free. Parking is paid and planetarium tickets are separate.",
  },
  {
    id: "budget-hotels",
    label: "Hotels",
    category: "lodging",
    priced: false,
    amount: null,
    notes:
      "A separate verified comparison shows live full-stay prices and terms for 11 options. Nothing is booked.",
  },
  {
    id: "budget-rental",
    label: "Rental car / one-way fee",
    category: "transport",
    priced: false,
    amount: null,
    notes: "Rental car or one-way fee, not priced here.",
  },
  {
    id: "budget-fuel",
    label: "Fuel",
    category: "transport",
    priced: false,
    amount: null,
  },
  {
    id: "budget-parking",
    label: "Parking",
    category: "transport",
    priced: false,
    amount: null,
  },
  {
    id: "budget-food",
    label: "Food",
    category: "food",
    priced: false,
    amount: null,
  },
  {
    id: "budget-attractions",
    label: "Attractions",
    category: "activity",
    priced: false,
    amount: null,
  },
  {
    id: "budget-flights",
    label: "Flights / return journey",
    category: "transport",
    priced: false,
    amount: null,
    notes: "The return journey is not included. There is no whole-trip total yet.",
  },
];

// Car rental / one-way drop-off. This is a one-way draft: pick up in Arizona,
// drop in San Francisco. Nothing is priced yet (per the itinerary); fields are
// manually editable. Dates follow the trip window (checkout Jan 1).
export const rentals: RentalAgreement[] = [
  {
    id: "rental-one-way",
    company: "",
    pickupLocation: "Tempe, AZ",
    dropoffLocation: "San Francisco, CA",
    pickupDate: "2026-12-27",
    dropoffDate: "2027-01-01",
    baseRate: null,
    oneWayDropFee: null,
    notes:
      "One-way rental draft. Returning the car in San Francisco can avoid two nights of city parking; rental terms and drop fees are not priced yet.",
  },
];

// Seasonal checks and warnings.
export const weatherCards: WeatherCard[] = [
  {
    id: "weather-grand-canyon",
    location: "Grand Canyon South Rim",
    date: "2026-12-27",
    guidance:
      "Recheck the forecast and roads 24-48 hours before driving.",
    warnings: [
      "NPS recommends layers, food, water, a scraper, a flashlight and over-the-shoe traction for icy paths.",
      "South Rim is open year-round, but snow and ice can temporarily close roads.",
      "Hermit Road normally opens to private vehicles under 22 feet Dec-Feb, weather permitting.",
    ],
  },
  {
    id: "weather-driving-day",
    location: "Day 2 driving day (South Rim -> San Diego)",
    date: "2026-12-28",
    guidance:
      "Protect the long driving day: keep the 5:30am start, rotate only between listed, rested drivers.",
    warnings: [
      "Avoid adding Route 66 or Joshua Tree detours.",
      "If nobody wants a drive this long, this is the first leg to replace with a flight or split with an extra night.",
    ],
  },
  {
    id: "weather-nye",
    location: "San Francisco New Year's Eve",
    date: "2026-12-31",
    guidance:
      "Fireworks are not locked in. Official details for the December 31, 2026 (ring in 2027) celebration may not be published yet; recheck the Downtown SF organizer page closer to the date.",
    warnings: [
      "This itinerary does not promise a 2027 fireworks show, time or viewing area.",
    ],
  },
];

// Packing / preparation checklist, seeded with the NPS winter-gear items the
// document recommends for the Grand Canyon: "layers, food, water, a scraper,
// a flashlight and over-the-shoe traction for icy paths."
export const checklistItems: ChecklistItem[] = [
  {
    id: "check-layers",
    label: "Layers (warm clothing)",
    category: "NPS winter gear",
    checked: false,
  },
  {
    id: "check-food",
    label: "Food",
    category: "NPS winter gear",
    checked: false,
  },
  {
    id: "check-water",
    label: "Water",
    category: "NPS winter gear",
    checked: false,
  },
  {
    id: "check-scraper",
    label: "Ice scraper",
    category: "NPS winter gear",
    checked: false,
  },
  {
    id: "check-flashlight",
    label: "Flashlight",
    category: "NPS winter gear",
    checked: false,
  },
  {
    id: "check-traction",
    label: "Over-the-shoe traction for icy paths",
    category: "NPS winter gear",
    checked: false,
  },
];

// Open decisions: what turns this into a bookable plan.
export const openDecisions: OpenDecision[] = [
  {
    id: "decision-drive-whole-route",
    question: "Confirm whether all four travelers want to drive the whole route.",
    detail: "Tempe and 5:30am intercity starts are already built in.",
    resolved: false,
  },
  {
    id: "decision-budget",
    question: "Set a whole-trip budget and identify any must-pay experiences.",
    resolved: false,
  },
  {
    id: "decision-return-leg",
    question:
      "Decide whether January 1 means flying home, driving back or continuing elsewhere.",
    resolved: false,
  },
];

// Sample gallery state. These are placeholders (url: null) so the gallery and
// the public Moments recap have per-day / per-place content to render in mock
// mode, before any real photo is uploaded. Captions map to the itinerary's
// anchor stops; real uploads replace this once Supabase Storage is configured.
export const photos: Photo[] = [
  {
    id: "photo-sedona",
    url: null,
    caption: "Red-rock morning stop in Sedona",
    dayId: "day-1",
    placeId: "sedona",
  },
  {
    id: "photo-south-rim",
    url: null,
    caption: "First look at the canyon from Mather Point",
    dayId: "day-1",
    placeId: "mather-point",
  },
  {
    id: "photo-balboa",
    url: null,
    caption: "Evening walk through Balboa Park, San Diego",
    dayId: "day-2",
    placeId: "balboa-park",
  },
  {
    id: "photo-griffith",
    url: null,
    caption: "Griffith Observatory and the Hollywood Sign view",
    dayId: "day-3",
    placeId: "griffith-observatory",
  },
  {
    id: "photo-golden-gate",
    url: null,
    caption: "Golden Gate Bridge on arrival in San Francisco",
    dayId: "day-4",
    placeId: "golden-gate",
  },
  {
    id: "photo-ferry-building",
    url: null,
    caption: "Ferry Building and the Embarcadero",
    dayId: "day-5",
    placeId: "ferry-building",
  },
];
