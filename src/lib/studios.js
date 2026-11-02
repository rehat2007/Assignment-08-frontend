// Studio taxonomy + seed catalog. The API is the source of truth at runtime;
// `studiospace_back_end/src/seed.js` imports `STUDIOS` to populate Mongo, and
// the UI imports `STUDIO_CATEGORIES` / `categoryLabel` for labels and filters.
export const STUDIO_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "photo", label: "Photo Studio" },
  { value: "film", label: "Film Stage" },
  { value: "podcast", label: "Podcast Lounge" },
  { value: "music", label: "Music Suite" },
  { value: "workshop", label: "Workshop" },
];

export function categoryLabel(category) {
  return (
    STUDIO_CATEGORIES.find((filter) => filter.value === category)?.label ??
    category
  );
}

export function getStudioBySlug(slug) {
  return STUDIOS.find((studio) => studio.slug === slug);
}

export const STUDIOS = [
  {
    slug: "cyc-wall-loft",
    name: "Cyc Wall Loft",
    category: "photo",
    location: "Gulshan 2, Dhaka",
    rating: 4.9,
    price: 85,
    gradient: "bg-linear-to-br from-[#f49a72] via-[#ef7d84] to-[#8f5cf1]",
    description:
      "A 1,200 sq ft white cyclorama with 14 ft ceilings, three Profoto strobes and a dedicated makeup corner. Natural light from the north windows is controllable with blackout curtains. Ideal for e-commerce, fashion and portrait work.",
    deposit: 100,
    capacity: 12,
    minHours: 2,
    reviewsCount: 128,
    host: {
      name: "Ayesha Rahman",
      initials: "AR",
      tagline: "Verified host · responds within 1 hour",
      ownerEmail: "ayesha@studiospace.dev",
    },
    amenities: [
      "Softbox lighting",
      "Backdrops",
      "Wi-Fi",
      "Air conditioning",
      "Parking",
      "Restroom",
    ],
    reviews: [
      {
        name: "Nadia K.",
        rating: 5,
        comment:
          "Clean, quiet and exactly as pictured. The host had the lights set before we arrived.",
      },
      {
        name: "Rafi A.",
        rating: 5,
        comment:
          "Smooth check-in and fair deposit. We shot a full lookbook in four hours.",
      },
      {
        name: "Sara M.",
        rating: 4,
        comment: "Great space. Parking is tight on weekends, so come early.",
      },
    ],
  },
  {
    slug: "reverb-room-recording-suite",
    name: "Reverb Room Recording Suite",
    category: "music",
    location: "Banani, Dhaka",
    rating: 4.9,
    price: 120,
    gradient: "bg-linear-to-br from-[#c9b8fb] via-[#8b7cf7] to-[#4f3fd6]",
    description:
      "A treated tracking room built around a Yamaha upright, two nearfield pairs and a mid-sized live booth. Ribbon and condenser mics are patched into a 24-channel interface ready for your session. Perfect for indie bands, session tracking and mixing days.",
    deposit: 150,
    capacity: 8,
    minHours: 3,
    reviewsCount: 96,
    host: {
      name: "Tanvir Ahmed",
      initials: "TA",
      tagline: "Verified host · responds within 2 hours",
      ownerEmail: "tanvir@studiospace.dev",
    },
    amenities: [
      "Piano & keys",
      "Live booth",
      "Condenser mics",
      "Wi-Fi",
      "Air conditioning",
      "Parking",
    ],
    reviews: [
      {
        name: "Imran P.",
        rating: 5,
        comment:
          "The booth isolation is genuinely made my vocal takes cleaner. Great value.",
      },
      {
        name: "Tina S.",
        rating: 5,
        comment: "Booked three evenings in a row — consistent, quiet, pro kit.",
      },
    ],
  },
  {
    slug: "blackbox-sound-stage",
    name: "Blackbox Sound Stage",
    category: "film",
    location: "Tejgaon Industrial Area, Dhaka",
    rating: 4.8,
    price: 220,
    gradient: "bg-linear-to-br from-[#f6a35c] via-[#e4743e] to-[#401f2e]",
    description:
      "A 4,000 sq ft blacked-out stage with a 22 ft grid, 400A three-phase power and a drive-in load-in door. Grip truck, C-stands and a packed camera cart are on site. Built for commercials, music videos and full production days.",
    deposit: 400,
    capacity: 30,
    minHours: 4,
    reviewsCount: 61,
    host: {
      name: "Faizan Chowdhury",
      initials: "FC",
      tagline: "Verified host · responds within 1 hour",
      ownerEmail: "faizan@studiospace.dev",
    },
    amenities: [
      "22 ft grid",
      "400A power",
      "Grip truck",
      "Green room",
      "Drive-in load in",
      "Restroom",
    ],
    reviews: [
      {
        name: "Rashed Q.",
        rating: 5,
        comment:
          "Load-in was painless and the crew room washed gear fast. Will rebook.",
      },
      {
        name: "Lubna H.",
        rating: 4,
        comment: "Solid stage. Caters better if you bring your own AC tech.",
      },
    ],
  },
  {
    slug: "pink-paper-portrait",
    name: "Pink Paper Portrait Studio",
    category: "photo",
    location: "Mirpur DOHS, Dhaka",
    rating: 4.8,
    price: 60,
    gradient: "bg-linear-to-br from-[#f49a72] via-[#ec7b95] to-[#7b5cf1]",
    description:
      "A cozy 600 sq ft daylight corner with three seamless paper rolls, a twin Westcott softbox kit and window bounce that flatters skin tones. Suited for headshots, brand portraits and small product sets.",
    deposit: 80,
    capacity: 6,
    minHours: 2,
    reviewsCount: 74,
    host: {
      name: "Mehrin Islam",
      initials: "MI",
      tagline: "Verified host · responds within 1 hour",
      ownerEmail: "mehrin@studiospace.dev",
    },
    amenities: [
      "Seamless paper",
      "Softbox kit",
      "Makeup station",
      "Wi-Fi",
      "Air conditioning",
      "Restroom",
    ],
    reviews: [
      {
        name: "Purnima G.",
        rating: 5,
        comment: "That window light is magic for portraits. Client approved.",
      },
      {
        name: "Shakib R.",
        rating: 4,
        comment: "Compact but tidy — perfect for solo sessions.",
      },
    ],
  },
  {
    slug: "north-sound-stage",
    name: "North Sound Stage",
    category: "film",
    location: "Banani, Dhaka",
    rating: 4.7,
    price: 120,
    gradient: "bg-linear-to-br from-[#8fb2f9] via-[#8a79f2] to-[#4c3ea8]",
    description:
      "A 2,000 sq ft sound-attenuated stage with a flat black cyclorama, DMX-controlled house plot and a mezzanine client lounge. Generates 200A of clean power with silent backup. Fits interviews, short films and tabletop work.",
    deposit: 250,
    capacity: 20,
    minHours: 4,
    reviewsCount: 53,
    host: {
      name: "Faizan Chowdhury",
      initials: "FC",
      tagline: "Verified host · responds within 1 hour",
      ownerEmail: "faizan@studiospace.dev",
    },
    amenities: [
      "Flat cyc",
      "DMX house lights",
      "Client lounge",
      "Wi-Fi",
      "Air conditioning",
      "Parking",
    ],
    reviews: [
      {
        name: "Anis M.",
        rating: 5,
        comment: "House dimmer plot saved us a whole prelight day.",
      },
      {
        name: "Joyeta B.",
        rating: 4,
        comment: "Quiet stage, helpful staff, cafe on the next block.",
      },
    ],
  },
  {
    slug: "rooftop-podcast-lounge",
    name: "Lantern Podcast Lounge",
    category: "podcast",
    location: "Dhanmondi 27, Dhaka",
    rating: 4.7,
    price: 45,
    gradient: "bg-linear-to-br from-[#77d8b4] via-[#53b98c] to-[#2d6a74]",
    description:
      "A four-seat lounge treatment with Shure SM7Bs on boom arms, a Zoom live-assist rack and skyline views past the glass. Records two microphones and a phone guest line without lifting a fader.",
    deposit: 70,
    capacity: 8,
    minHours: 2,
    reviewsCount: 45,
    host: {
      name: "Ayesha Rahman",
      initials: "AR",
      tagline: "Verified host · responds within 1 hour",
      ownerEmail: "ayesha@studiospace.dev",
    },
    amenities: [
      "SM7B microphones",
      "Multitrack recorder",
      "Guest line",
      "Wi-Fi",
      "Air conditioning",
      "Restroom",
    ],
    reviews: [
      {
        name: "Farhan D.",
        rating: 5,
        comment: "Rack setup is idiot-proof — we published the same evening.",
      },
      {
        name: "Maliha Z.",
        rating: 4,
        comment: "Lovely vibe. Rooftop wind can leak a little on hot days.",
      },
    ],
  },
  {
    slug: "blue-note-suite",
    name: "Blue Note Suite",
    category: "music",
    location: "Uttara Sector 7, Dhaka",
    rating: 4.9,
    price: 75,
    gradient: "bg-linear-to-br from-[#a9c5f7] via-[#7f8ef5] to-[#38306e]",
    description:
      "A 300 sq ft muted writing room with a Rhodes, two Nord patches and a wall of pedals into a Universal Audio front end. Tuned regularly, monitored flat, and quiet enough for late-night work. Good for songwriters and producers.",
    deposit: 90,
    capacity: 5,
    minHours: 2,
    reviewsCount: 82,
    host: {
      name: "Tanvir Ahmed",
      initials: "TA",
      tagline: "Verified host · responds within 2 hours",
      ownerEmail: "tanvir@studiospace.dev",
    },
    amenities: [
      "Rhodes & synths",
      "Pedal wall",
      "Flat monitors",
      "Wi-Fi",
      "Air conditioning",
      "Restroom",
    ],
    reviews: [
      {
        name: "Rayaan V.",
        rating: 5,
        comment: "Wrote a full B-side here in one session. The Rhodes is alive.",
      },
      {
        name: "Meher A.",
        rating: 5,
        comment: "Flat monitoring means no eleven-o'clock surprises.",
      },
    ],
  },
  {
    slug: "clay-makers-workshop",
    name: "Clay Makers Workshop",
    category: "workshop",
    location: "Mohammadpur, Dhaka",
    rating: 4.5,
    price: 35,
    gradient: "bg-linear-to-br from-[#f5c98a] via-[#e79a6f] to-[#9c4f6e]",
    description:
      "A bright 800 sq ft maker bench with six pottery wheels, a slab roller and a mid-fire kiln loan. Glaze pantry stocked; aprons included. Suited for ceramics classes, team builds and small-batch production runs.",
    deposit: 50,
    capacity: 15,
    minHours: 2,
    reviewsCount: 39,
    host: {
      name: "Mehrin Islam",
      initials: "MI",
      tagline: "Verified host · responds within 4 hours",
      ownerEmail: "mehrin@studiospace.dev",
    },
    amenities: [
      "6 wheels",
      "Slab roller",
      "Kiln access",
      "Glaze pantry",
      "Aprons",
      "Wi-Fi",
    ],
    reviews: [
      {
        name: "Sharmin T.",
        rating: 5,
        comment: "Host walked my workshop group through throws for ages.",
      },
      {
        name: "Dipto N.",
        rating: 4,
        comment: "Great wheels. Bring your own trim tools if picky.",
      },
    ],
  },
];
