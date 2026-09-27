export const navigation = [
  { label: "Games", href: "/games" },
  { label: "Cabinets", href: "/cabinets" },
  { label: "Products", href: "/products" },
  { label: "Player journey", href: "/player-journey" },
] as const;

export const games = [
  { slug: "sunscapes", title: "Rise of the Dragon", image: "/media/generated/theme-v3/rise-of-the-dragon-v3.webp", index: "01" },
  { slug: "sunscape-2", title: "Rich Times", image: "/media/generated/theme-v3/rich-times-v3.webp", index: "02" },
  { slug: "sunscape-3", title: "Gang of Evils", image: "/media/generated/theme-v3/gangs-of-evil-v3.webp", index: "03" },
  { slug: "sunscape-4", title: "Bison Showdown", image: "/media/generated/theme-v3/bison-showdown-v4.webp", index: "04" },
  { slug: "sunscape-5", title: "Sinister Show", image: "/media/generated/theme-v3/sinister-show-v4.webp", index: "05" },
  { slug: "sunscape-6", title: "Tiki Twist", image: "/media/generated/theme-v3/tiki-twist-v4.webp", index: "06" },
] as const;

export const cabinets = [
  {
    name: "Altitude",
    label: "Vertical monitor cabinet",
    image: "/media/generated/theme-v3/altitude-cutout-v3.png",
    mobile: "/media/generated/theme-v3/altitude-cutout-v3.png",
    copy: "Discover Altitude, a vertical-monitor cabinet with a striking screen-first silhouette. Explore its place on your Tierplay floor.",
  },
  {
    name: "Pinnacle",
    label: "Curved monitor cabinet",
    image: "/media/generated/theme-v3/pinnacle-cutout-v3.png",
    mobile: "/media/generated/theme-v3/pinnacle-cutout-v3.png",
    copy: "Meet Pinnacle, a curved-monitor cabinet with a distinct architectural profile. A different perspective on the Tierplay experience.",
  },
] as const;

export const products = [
  {
    code: "TCM",
    name: "Tierplay Collection Management",
    copy: "Explore Tierplay’s collection-management product and discuss the needs of your operation with our team.",
  },
  {
    code: "TLJ",
    name: "Tierplay Link Jackpot",
    copy: "Discover Tierplay Link Jackpot, part of the connected Tierplay floor ecosystem.",
  },
] as const;
