// Studio taxonomy + mock catalog shared by the landing page and /studios.
export const STUDIO_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "photo", label: "Photo Studio" },
  { value: "film", label: "Film Stage" },
  { value: "podcast", label: "Podcast Lounge" },
  { value: "music", label: "Music Suite" },
  { value: "workshop", label: "Workshop" },
];

export function categoryLabel(category) {
  return STUDIO_CATEGORIES.find((filter) => filter.value === category)?.label ?? category;
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
  },
  {
    slug: "reverb-room-recording-suite",
    name: "Reverb Room Recording Suite",
    category: "music",
    location: "Banani, Dhaka",
    rating: 4.9,
    price: 120,
    gradient: "bg-linear-to-br from-[#c9b8fb] via-[#8b7cf7] to-[#4f3fd6]",
  },
  {
    slug: "blackbox-sound-stage",
    name: "Blackbox Sound Stage",
    category: "film",
    location: "Tejgaon Industrial Area, Dhaka",
    rating: 4.8,
    price: 220,
    gradient: "bg-linear-to-br from-[#f6a35c] via-[#e4743e] to-[#401f2e]",
  },
  {
    slug: "pink-paper-portrait",
    name: "Pink Paper Portrait Studio",
    category: "photo",
    location: "Mirpur DOHS, Dhaka",
    rating: 4.8,
    price: 60,
    gradient: "bg-linear-to-br from-[#f49a72] via-[#ec7b95] to-[#7b5cf1]",
  },
  {
    slug: "north-sound-stage",
    name: "North Sound Stage",
    category: "film",
    location: "Banani, Dhaka",
    rating: 4.7,
    price: 120,
    gradient: "bg-linear-to-br from-[#8fb2f9] via-[#8a79f2] to-[#4c3ea8]",
  },
  {
    slug: "rooftop-podcast-lounge",
    name: "Rooftop Podcast Lounge",
    category: "podcast",
    location: "Dhanmondi, Dhaka",
    rating: 4.6,
    price: 45,
    gradient: "bg-linear-to-br from-[#77d8b4] via-[#53b98c] to-[#2d6a74]",
  },
  {
    slug: "blue-note-suite",
    name: "Blue Note Suite",
    category: "music",
    location: "Uttara Sector 7, Dhaka",
    rating: 4.9,
    price: 75,
    gradient: "bg-linear-to-br from-[#a9c5f7] via-[#7f8ef5] to-[#38306e]",
  },
  {
    slug: "clay-makers-workshop",
    name: "Clay Makers Workshop",
    category: "workshop",
    location: "Mohammadpur, Dhaka",
    rating: 4.5,
    price: 35,
    gradient: "bg-linear-to-br from-[#f5c98a] via-[#e79a6f] to-[#9c4f6e]",
  },
];
