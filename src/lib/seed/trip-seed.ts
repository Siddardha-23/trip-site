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
    description: "Red-rock sunrise and a relaxed breakfast stop.",
  },
  {
    id: "oak-creek-vista",
    name: "Oak Creek Vista Overlook",
    city: "Oak Creek Canyon, AZ",
    lat: null,
    lng: null,
    category: "viewpoint",
    description: "Forest Service overlook at the top of the Oak Creek Canyon switchbacks on SR-89A.",
  },
  {
    id: "williams",
    name: "Williams",
    city: "Williams, AZ",
    lat: null,
    lng: null,
    category: "town",
    description: "Historic Route 66 gateway town west of Flagstaff; Day 1 base and Route 66 lunch stop.",
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
    id: "gaslamp-quarter",
    name: "Gaslamp Quarter",
    city: "San Diego, CA",
    lat: null,
    lng: null,
    category: "neighborhood",
    description: "Downtown San Diego's historic nightlife district; the Day 2 evening night out.",
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
    id: "monterey",
    name: "Monterey",
    city: "Monterey, CA",
    lat: 36.6002,
    lng: -121.8947,
    category: "city",
    description: "Central Coast bay city; Day 4 overnight base and the start of the Big Sur drive.",
  },
  {
    id: "cannery-row",
    name: "Cannery Row",
    city: "Monterey, CA",
    lat: null,
    lng: null,
    category: "sightseeing",
    description: "Historic waterfront street made famous by Steinbeck, near the Monterey Bay Aquarium.",
  },
  {
    id: "carmel",
    name: "Carmel-by-the-Sea",
    city: "Carmel-by-the-Sea, CA",
    lat: null,
    lng: null,
    category: "town",
    description: "Storybook coastal village with a white-sand beach; a Pacific-sunset stop.",
  },
  {
    id: "bixby-bridge",
    name: "Bixby Creek Bridge",
    city: "Big Sur, CA",
    lat: null,
    lng: null,
    category: "viewpoint",
    description: "Iconic arched Big Sur bridge over a coastal canyon on Highway 1.",
  },
  {
    id: "mcway-falls",
    name: "McWay Falls",
    city: "Big Sur, CA",
    lat: null,
    lng: null,
    category: "viewpoint",
    description: "Tidefall onto a hidden cove beach in Julia Pfeiffer Burns State Park, Highway 1.",
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
  subtitle: "Dec 27-Jan 1 · 5 nights · up to 6 people",
  startDate: "2026-12-27",
  endDate: "2026-12-31", // last hotel night (single SF night)
  checkoutDate: "2027-01-01",
  nights: 5,
  travelerCount: 4,
  roomSetup: "2 budget rooms · up to 3 people each · 2 queen beds",
  totalIntercityMiles: 1377, // Sum of all day legs: 270 + 504 + 128 + 335 + 140
  totalDrivingHours: 26.5, // Sum of per-leg low-bound hours across all days
  pace: "Fast; early starts, December 28 is a full 504-mi driving day, Big Sur driven in daylight",
  bookingStatus: "Nothing booked. This is a planning draft.",
  overnightSummary: "Williams 1 · San Diego 1 · Los Angeles 1 · Monterey 1 · San Francisco 1",
  days: [
    {
      id: "day-1",
      dayNumber: 1,
      date: "2026-12-27",
      weekday: "Sunday",
      title: "Red Rock to the Rim: Tempe → Sedona → Grand Canyon → Williams",
      overnight: "Williams, AZ",
      summary:
        "Tempe → Sedona → Oak Creek Canyon → Flagstaff → Williams → Grand Canyon South Rim → back to Williams · About 5 hr driving · ~270 mi loop. A 5:30am start buys a red-rock sunrise, a Route 66 lunch and a canyon sunset in one day.",
      legs: [
        {
          id: "leg-1a",
          from: "Tempe",
          to: "Sedona",
          miles: 115,
          driveTime: "about 2 hr",
          driveTimeHoursLow: 2,
          driveTimeHoursHigh: 2,
          departTime: "5:30am",
          notes:
            "Leave Tempe at 5:30am to reach Sedona around 7:15am for a red-rock sunrise.",
        },
        {
          id: "leg-1b",
          from: "Sedona",
          to: "Oak Creek Vista Overlook",
          miles: 15,
          driveTime: "about 30-45 min",
          driveTimeHoursLow: 0.5,
          driveTimeHoursHigh: 0.75,
          departTime: "9:00am",
          notes:
            "Short climb up Oak Creek Canyon on SR-89A; aim for the Oak Creek Vista Overlook around 9:30am.",
        },
        {
          id: "leg-1c",
          from: "Oak Creek Vista Overlook",
          to: "Williams",
          miles: 45,
          driveTime: "about 1 hr",
          driveTimeHoursLow: 1,
          driveTimeHoursHigh: 1,
          notes:
            "Continue to Flagstaff, fuel up there, then west on I-40 to Williams for a Route 66 lunch (11:30am-12:30pm).",
        },
        {
          id: "leg-1d",
          from: "Williams",
          to: "Grand Canyon South Rim",
          miles: 48,
          driveTime: "about 1 hr",
          driveTimeHoursLow: 1,
          driveTimeHoursHigh: 1,
          departTime: "12:30pm",
          notes:
            "North on SR-64 to reach the South Rim around 1:30pm, leaving the afternoon for the rim and sunset (~5pm).",
        },
        {
          id: "leg-1e",
          from: "Grand Canyon South Rim",
          to: "Williams",
          miles: 47,
          driveTime: "about 1 hr",
          driveTimeHoursLow: 1,
          driveTimeHoursHigh: 1,
          notes:
            "After sunset, drive back to the Williams base for the night.",
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
          name: "Sedona sunrise and breakfast",
          kind: "meal",
          time: "7:15-9:00am",
          description:
            "Reach Sedona around 7:15am. Catch the red rock in early light at Bell Rock & Courthouse Butte or the Airport Mesa Overlook, then a relaxed breakfast.",
        },
        {
          id: "stop-1-oak-creek-vista",
          placeId: "oak-creek-vista",
          name: "Oak Creek Vista Overlook",
          kind: "sightseeing",
          time: "9:30am",
          description:
            "A short pull-off at the top of Oak Creek Canyon with a sweeping view back down the switchbacks.",
        },
        {
          id: "stop-1-williams-lunch",
          placeId: "williams",
          name: "Route 66 lunch in Williams",
          kind: "meal",
          time: "11:30am-12:30pm",
          description:
            "Fuel in Flagstaff en route, then a Route 66 main-street lunch in Williams, the gateway town and tonight's base.",
        },
        {
          id: "stop-1-south-rim",
          placeId: "south-rim",
          name: "Grand Canyon South Rim",
          kind: "sightseeing",
          time: "1:30pm",
          description:
            "Start at Mather Point, then walk an easy section of the Rim Trail past Yavapai Point. Add Hermit Road overlooks if daylight and road conditions allow.",
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
          id: "stop-1-sunset",
          placeId: "south-rim",
          name: "Canyon sunset",
          kind: "sightseeing",
          time: "~5:00pm",
          description:
            "Stay for sunset over the canyon before the drive back to Williams.",
        },
        {
          id: "stop-1-hermit",
          placeId: "hermit-road",
          name: "Hermit Road overlooks",
          kind: "flex",
          description: "If daylight and road conditions allow.",
        },
        {
          id: "stop-1-williams-night",
          placeId: "williams",
          name: "Back to Williams for the night",
          kind: "checkin",
          time: "Evening",
          description:
            "Return to the Williams base after sunset. Two budget motel rooms, about three people each.",
        },
      ],
      notes: [
        "Night: Williams, AZ. Williams is the Route 66 gateway town west of Flagstaff; basing here keeps the loop tight and the lodging cheap.",
        "Lodging: 2 budget motel rooms, about 3 people each, 2 queen beds per room, roughly $22-30 per person. Clean and safe over fancy — the group is mostly just sleeping.",
        "Park entry $35 per private vehicle, valid 7 days.",
        "Winter gear: pack layers, water and snacks, and over-the-shoe traction for icy rim paths.",
        "Fuel in Flagstaff before the canyon leg; recheck the forecast and roads 24-48 hours before driving.",
      ],
      theme: {
        key: "red-rock-to-rim",
        name: "Red Rock to the Rim",
        mood: "sunrise amber shifting to canyon rust",
      },
      experiences: {
        feeling:
          "This is the day the trip stops being a plan and becomes a feeling: red rock at sunrise, a Route 66 lunch at midday, then standing at the edge of something a mile deep and older than you can hold in your head as the sun goes down. Let the group go quiet here; some places earn the silence.",
        viewpoints: [
          {
            title: "Bell Rock & Courthouse Butte, Sedona",
            detail:
              "Twin red-rock landmarks just south of the village, glowing in first light — an easy early stop before breakfast when the rock is amber and the crowds are thin.",
            source: "https://en.wikipedia.org/wiki/Bell_Rock_(Arizona)",
          },
          {
            title: "Airport Mesa Overlook, Sedona",
            detail:
              "A short pull-off on the mesa with a 360° sweep of the red-rock buttes — best in early light before the breakfast stop.",
            source: "https://en.wikipedia.org/wiki/Sedona,_Arizona",
          },
          {
            title: "Oak Creek Vista Overlook",
            detail:
              "At the top of the Oak Creek Canyon switchbacks on SR-89A, a Forest Service overlook frames the whole green canyon you just climbed out of.",
            source: "https://en.wikipedia.org/wiki/Oak_Creek_Canyon",
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
          {
            title: "Trail of Time, South Rim",
            detail:
              "A rim walk where every meter marks a million years of the canyon's history; walking it slowly turns the view into a story instead of a photo.",
            source: "https://www.nps.gov/grca/planyourvisit/trail-of-time.htm",
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
            title: "Historic Route 66, Williams",
            detail:
              "Williams was the last Route 66 town bypassed by the interstate; its neon-lit main street still trades on that history and makes a fun, cheap base for the night.",
            source: "https://en.wikipedia.org/wiki/Williams,_Arizona",
          },
        ],
        foodCulture: [
          {
            title: "Sedona breakfast with a view",
            detail:
              "Keep the Sedona stop to a relaxed sit-down breakfast rather than a rushed drive-through; the uptown cafes with patio red-rock views are the point of stopping here at all.",
          },
          {
            title: "Route 66 lunch in Williams",
            detail:
              "The old-highway diners and saloons along Williams' main street are the midday anchor of the loop — classic, cheap, and full of neon-sign nostalgia.",
            source: "https://en.wikipedia.org/wiki/Williams,_Arizona",
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
        "Grand Canyon South Rim → San Diego · About 8.5-10 hr · 504 mi. The longest drive of the trip; a full driving day that ends on the coast with a downtown / Gaslamp Quarter night out.",
      legs: [
        {
          id: "leg-2",
          from: "Grand Canyon South Rim",
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
          time: "Evening arrival",
          description:
            "Check in after the long drive, then head downtown. If the group has energy, the Gaslamp Quarter is the natural night out; otherwise a short waterfront or Balboa Park walk.",
        },
        {
          id: "stop-2-gaslamp",
          placeId: "gaslamp-quarter",
          name: "Gaslamp Quarter (evening)",
          kind: "activity",
          time: "Evening",
          description:
            "Downtown's walkable, lively heart — Victorian-era blocks of restaurants and bars, a good reward after a full driving day.",
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
      theme: {
        key: "canyon-to-coast",
        name: "Canyon to the Coast",
        mood: "desert tan shifting to Pacific blue",
      },
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
            title: "Gaslamp Quarter at night",
            detail:
              "Sixteen walkable downtown blocks of restored Victorian buildings, now the city's nightlife core — the easiest place to land for a celebratory evening after the longest drive of the trip.",
            source: "https://en.wikipedia.org/wiki/Gaslamp_Quarter,_San_Diego",
          },
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
        "Relaxed San Diego morning, then San Diego → Griffith Observatory · About 2.5-4 hr · 128 mi, timed to reach Griffith at dusk.",
      legs: [
        {
          id: "leg-3",
          from: "San Diego",
          to: "Griffith Observatory",
          miles: 128,
          driveTime: "about 2.5-4 hr",
          driveTimeHoursLow: 2.5,
          driveTimeHoursHigh: 4,
          departTime: "Midday",
          notes:
            "128-mile route measured 2 hr 19 min normally and 3 hr 49 min in the high-traffic estimate. Leave around midday so the drive lands at Griffith for golden hour.",
        },
      ],
      stops: [
        {
          id: "stop-3-morning",
          placeId: "san-diego",
          name: "Relaxed San Diego morning",
          kind: "flex",
          time: "Morning",
          description:
            "Keep the morning unhurried — a slow breakfast, the waterfront or Balboa Park — before the short drive north.",
        },
        {
          id: "stop-3-depart",
          placeId: "san-diego",
          name: "Leave San Diego",
          kind: "departure",
          time: "Midday",
          description:
            "The 128-mile route to Griffith Observatory measured 2 hr 19 min normally and 3 hr 49 min in the high-traffic estimate. Time the drive to arrive at dusk.",
        },
        {
          id: "stop-3-griffith",
          placeId: "griffith-observatory",
          name: "Griffith Observatory at dusk",
          kind: "sightseeing",
          time: "Dusk",
          description:
            "See the exhibits and the Hollywood Sign view, then stay for blue hour over the LA basin. Regular Tuesday hours are noon to 10:00pm. Admission to the building is free; the closest parking is paid and planetarium tickets are separate.",
        },
      ],
      notes: [
        "A relaxed San Diego morning, then a drive timed so Griffith Observatory lands at dusk. If Balboa Park is a priority, keep it on the previous afternoon or this morning.",
        "Protect this driving day: avoid adding Route 66 or Joshua Tree detours. Rotate only between listed, rested drivers. If nobody wants a drive this long, this is the first leg to replace with a flight or split with an extra night.",
        "Night: Los Angeles. A Hollywood base fits this stop.",
      ],
      theme: {
        key: "city-of-angels",
        name: "City of Angels",
        mood: "golden-hour dusk",
      },
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
      title: "The Pacific Turn: Los Angeles to Monterey & Carmel",
      overnight: "Monterey / Carmel, CA",
      summary:
        "Los Angeles → Monterey / Carmel via US-101 · About 5.5-6 hr · ~335 mi (estimate). Trade the freeway for the Central Coast and a Pacific sunset. Nothing booked — a scenic coastal overnight.",
      legs: [
        {
          id: "leg-4",
          from: "Los Angeles",
          to: "Monterey / Carmel",
          miles: 335,
          driveTime: "about 5.5-6 hr",
          driveTimeHoursLow: 5.5,
          driveTimeHoursHigh: 6,
          departTime: "Morning",
          notes:
            "Estimate, not a transcribed exact figure: US-101 from Los Angeles to the Monterey Peninsula is roughly 330-345 mi and about 5.5-6 hr before stops. Recheck before booking.",
        },
      ],
      stops: [
        {
          id: "stop-4-depart",
          placeId: "los-angeles",
          name: "Leave Los Angeles",
          kind: "departure",
          time: "Morning",
          description:
            "Head up US-101 toward the Central Coast, leaving time for a Pacific sunset in Monterey or Carmel.",
        },
        {
          id: "stop-4-cannery-row",
          placeId: "cannery-row",
          name: "Cannery Row, Monterey",
          kind: "sightseeing",
          time: "Afternoon",
          description:
            "The waterfront street made famous by Steinbeck, now a walkable stretch of the bay with the aquarium nearby.",
        },
        {
          id: "stop-4-carmel",
          placeId: "carmel",
          name: "Carmel-by-the-Sea",
          kind: "sightseeing",
          time: "Late afternoon",
          description:
            "A storybook coastal village of cottages and galleries with a white-sand beach — a gentle place to end the drive.",
        },
        {
          id: "stop-4-sunset",
          placeId: "carmel",
          name: "Pacific sunset",
          kind: "sightseeing",
          time: "Sunset",
          description:
            "Catch sunset over the water from Carmel Beach or the Monterey shoreline before dinner.",
        },
      ],
      notes: [
        "Night: Monterey / Carmel. A scenic coastal overnight — nothing booked.",
        "The LA → Monterey distance and drive-time are an estimate (US-101 ~330-345 mi, ~5.5-6 hr), not a transcribed exact figure. Recheck before booking.",
      ],
      theme: {
        key: "pacific-turn",
        name: "The Pacific Turn",
        mood: "coastal fog / teal",
      },
      experiences: {
        feeling:
          "This is where the trip leaves the freeway behind and turns to the sea. Cannery Row, a storybook village, and a Pacific sunset — a slower, salt-air evening that sets up the Big Sur drive to come.",
        viewpoints: [
          {
            title: "Cannery Row waterfront, Monterey",
            detail:
              "The old sardine-cannery street along the bay, immortalized by Steinbeck, now a strollable waterfront with the Monterey Bay Aquarium at its end.",
            source: "https://en.wikipedia.org/wiki/Cannery_Row",
          },
          {
            title: "Carmel Beach at sunset",
            detail:
              "A crescent of white sand below the village of Carmel-by-the-Sea, facing straight west — one of the better free sunset perches on the coast.",
            source: "https://en.wikipedia.org/wiki/Carmel-by-the-Sea,_California",
          },
        ],
        hiddenGems: [
          {
            title: "Carmel-by-the-Sea village",
            detail:
              "A one-square-mile town of fairytale cottages, hidden courtyards and galleries, with no street addresses — made for an unhurried evening wander.",
            source: "https://en.wikipedia.org/wiki/Carmel-by-the-Sea,_California",
          },
          {
            title: "Monterey State Historic Park",
            detail:
              "Adobe buildings from California's Spanish and Mexican eras, walkable in the old town — a quiet counterpoint to the bustle of Cannery Row.",
            source: "https://en.wikipedia.org/wiki/Monterey,_California",
          },
        ],
        foodCulture: [
          {
            title: "Monterey Bay seafood",
            detail:
              "The bay's fishing heritage still shows up on the plate — clam chowder and fresh catch along Cannery Row and Fisherman's Wharf make an easy coastal dinner.",
            source: "https://en.wikipedia.org/wiki/Monterey,_California",
          },
        ],
      },
    },
    {
      id: "day-5",
      dayNumber: 5,
      date: "2026-12-31",
      weekday: "Thursday",
      title: "Big Sur & Midnight: Monterey → Highway 1 → San Francisco NYE",
      overnight: "San Francisco, CA",
      summary:
        "Monterey → Big Sur / Highway 1 (driven in full daylight) → San Francisco by evening, then a flexible New Year's Eve. One SF night.",
      legs: [
        {
          id: "leg-5",
          from: "Monterey",
          to: "San Francisco (via Big Sur / Hwy 1)",
          miles: 140,
          driveTime: "a slow full-daylight day, several hours with stops",
          driveTimeHoursLow: 4.5,
          driveTimeHoursHigh: 6,
          departTime: "Early morning",
          notes:
            "Estimate, not a transcribed exact figure: the Monterey → Big Sur → San Francisco coastal routing is only about 140 mi but is a slow, winding full-day drive with many stops. Drive Big Sur in full daylight. Highway 1 is prone to seasonal and storm closures — check Caltrans/NPS status before relying on the coast route, and have the US-101 inland alternative ready.",
        },
      ],
      stops: [
        {
          id: "stop-5-depart",
          placeId: "monterey",
          name: "Leave Monterey early",
          kind: "departure",
          time: "Early morning",
          description:
            "Start early to drive Big Sur in full daylight and still reach San Francisco by evening.",
        },
        {
          id: "stop-5-bixby",
          placeId: "bixby-bridge",
          name: "Bixby Creek Bridge",
          kind: "sightseeing",
          time: "Morning",
          description:
            "The iconic arched span over a coastal canyon — the signature Big Sur photo stop.",
        },
        {
          id: "stop-5-mcway",
          placeId: "mcway-falls",
          name: "McWay Falls",
          kind: "sightseeing",
          time: "Midday",
          description:
            "An 80-foot waterfall dropping onto a cove beach in Julia Pfeiffer Burns State Park, viewed from a short overlook trail.",
        },
        {
          id: "stop-5-overlooks",
          name: "Big Sur coastal overlooks",
          kind: "flex",
          time: "Afternoon",
          description:
            "Pull off at the cliff-edge turnouts along Highway 1 as time and daylight allow.",
        },
        {
          id: "stop-5-arrive-sf",
          placeId: "san-francisco",
          name: "Arrive in San Francisco",
          kind: "checkin",
          time: "Evening",
          description:
            "Reach the city by evening and check in for the single SF night. If this is a one-way rental, returning it here can avoid city parking; rental terms and drop fees are not priced yet.",
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
        "Night: San Francisco (single night). This is the last hotel night before the January 1 checkout.",
        "Drive Big Sur / Highway 1 in full daylight. The coast road is prone to seasonal and storm-related closures — check Caltrans and NPS status before relying on it, and keep the US-101 inland route as a backup.",
      ],
      theme: {
        key: "big-sur-midnight",
        name: "Big Sur & Midnight",
        mood: "cliff greens into NYE gold/navy",
      },
      experiences: {
        feeling:
          "The last full day, and New Year's Eve — the trip's emotional finish line. A morning of Big Sur cliffs gives way to the city by night; however the group rings in 2027, the point is that you do it together, somewhere that feels like the city. Keep the plan loose enough that the night can become whatever the group needs it to be.",
        viewpoints: [
          {
            title: "Bixby Creek Bridge, Big Sur",
            detail:
              "One of the most photographed bridges on the California coast, its concrete arch spanning a deep canyon with the Pacific beyond — the classic Big Sur morning stop.",
            source: "https://en.wikipedia.org/wiki/Bixby_Creek_Bridge",
          },
          {
            title: "McWay Falls, Julia Pfeiffer Burns State Park",
            detail:
              "A tidefall that drops straight onto a hidden cove beach; a short, level overlook trail delivers one of the coast's most unreal views.",
            source: "https://en.wikipedia.org/wiki/McWay_Falls",
          },
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
      "One-way rental draft. Returning the car in San Francisco can avoid city parking on the final night; rental terms and drop fees are not priced yet.",
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
    caption: "Red-rock sunrise in Sedona",
    dayId: "day-1",
    placeId: "sedona",
  },
  {
    id: "photo-oak-creek-vista",
    url: null,
    caption: "Oak Creek Vista Overlook, top of the canyon switchbacks",
    dayId: "day-1",
    placeId: "oak-creek-vista",
  },
  {
    id: "photo-williams",
    url: null,
    caption: "Route 66 main street in Williams",
    dayId: "day-1",
    placeId: "williams",
  },
  {
    id: "photo-south-rim",
    url: null,
    caption: "Canyon sunset from the South Rim",
    dayId: "day-1",
    placeId: "mather-point",
  },
  {
    id: "photo-gaslamp",
    url: null,
    caption: "Gaslamp Quarter night out, San Diego",
    dayId: "day-2",
    placeId: "gaslamp-quarter",
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
    caption: "Griffith Observatory and the Hollywood Sign view at dusk",
    dayId: "day-3",
    placeId: "griffith-observatory",
  },
  {
    id: "photo-cannery-row",
    url: null,
    caption: "Cannery Row waterfront, Monterey",
    dayId: "day-4",
    placeId: "cannery-row",
  },
  {
    id: "photo-carmel",
    url: null,
    caption: "Pacific sunset at Carmel-by-the-Sea",
    dayId: "day-4",
    placeId: "carmel",
  },
  {
    id: "photo-bixby-bridge",
    url: null,
    caption: "Bixby Creek Bridge on Big Sur's Highway 1",
    dayId: "day-5",
    placeId: "bixby-bridge",
  },
  {
    id: "photo-mcway-falls",
    url: null,
    caption: "McWay Falls dropping onto its hidden cove",
    dayId: "day-5",
    placeId: "mcway-falls",
  },
  {
    id: "photo-golden-gate",
    url: null,
    caption: "Golden Gate Bridge on arrival in San Francisco",
    dayId: "day-5",
    placeId: "golden-gate",
  },
];
