export const navigation = [
  { label: "Games", href: "/games" },
  { label: "Cabinets", href: "/cabinets" },
  { label: "Products", href: "/products" },
  { label: "Player journey", href: "/player-journey" },
] as const;

export const company = {
  address: "145 Challenger Ct, Suite 2, Columbus, GA 31904.",
  phone: "706-575-8838",
  phoneHref: "tel:+17065758838",
  email: "info@tierplay.com",
  emailHref: "mailto:info@tierplay.com",
} as const;

export const legacyNotice =
  "Recovered from Tierplay’s public legacy website. Product claims and availability require current Tierplay approval.";

export const games = [
  { slug: "sunscapes", title: "Rise of the Dragon", image: "/media/generated/theme-v3/rise-of-the-dragon-v3.webp", index: "01", board: "Sunscape 1" },
  { slug: "sunscape-2", title: "Rich Times", image: "/media/generated/theme-v3/rich-times-v3.webp", index: "02", board: "Sunscape 1" },
  { slug: "sunscape-3", title: "Gang of Evils", image: "/media/generated/theme-v3/gangs-of-evil-v3.webp", index: "03", board: "Sunscape 1" },
  { slug: "sunscape-4", title: "Bison Showdown", image: "/media/generated/theme-v3/bison-showdown-v4.webp", index: "04", board: "Sunscape 2" },
  { slug: "sunscape-5", title: "Sinister Show", image: "/media/generated/theme-v3/sinister-show-v4.webp", index: "05", board: "Sunscape 2" },
  { slug: "sunscape-6", title: "Tiki Twist", image: "/media/generated/theme-v3/tiki-twist-v4.webp", index: "06", board: "Sunscape 2" },
] as const;

const sharedBoardFeatures = [
  "Progressive and Link Jackpots",
  "Loyalty system",
  "Remote control via TCM",
  "43-inch flat and curved HD LED touch-screens",
  "Epic Edge and Mothagoose ticketing systems",
  "JCM UBA validators",
] as const;

export const boards = [
  {
    slug: "sunscapes", number: "01", title: "Sunscape 1 Skill Game Board", shortTitle: "Sunscape 1",
    image: "/media/legacy/1_sunscape-720x508-1.webp", poster: "/media/legacy/Thumbnails_Raise_of_Dragons-updated.webp",
    games: ["Rich Times", "Gang of Evils", "Rise of the Dragon"], grid: "Rising 8×5 grid lines",
    jackpot: "Three progressive jackpots described in the board introduction",
    intro: "Introducing the Sunscape 1 skill game board, featuring Rich Times, Gang of Evils and Rise of the Dragon. The legacy release describes Link Jackpot connectivity, rising 8×5 free-spin grids, nudge features and unique bonuses.",
    features: sharedBoardFeatures,
  },
  {
    slug: "sunscape-2", number: "02", title: "Sunscape 2 Skill Game Board", shortTitle: "Sunscape 2",
    image: "/media/legacy/2_sunscape-2-720x508-1.webp", poster: "/media/legacy/tikitwist-thumnails.webp",
    games: ["Bison Showdown", "Tiki Twist", "Sinister Show"], grid: "Rising 10×5 grid lines",
    jackpot: "Eight progressive jackpots described in the board introduction",
    intro: "Sunscape 2 brings together Bison Showdown, Tiki Twist and Sinister Show. The legacy release describes Link Jackpot connectivity, rising 10×5 free-spin grids, nudge features and multiplier bonuses.",
    features: sharedBoardFeatures,
  },
  {
    slug: "sunscape-3", number: "03", title: "Sunscape 3 Skill Game Board", shortTitle: "Sunscape 3",
    image: "/media/legacy/3_sunscape.webp", poster: "/media/legacy/3_sunscape.webp",
    games: ["Fortune Quest", "Birix Haven", "Fiery Frenzy"], grid: "Rising 10×5 grid lines",
    jackpot: "Five gamified jackpots described in the board introduction",
    intro: "Sunscape 3 features Fortune Quest, Birix Haven and Fiery Frenzy. Its public legacy description highlights Link Jackpot connectivity, rising 10×5 free-spin grids, nudge features and multiplier bonuses.",
    features: sharedBoardFeatures,
  },
  {
    slug: "sunscape-4", number: "04", title: "Sunscape 4 Skill Game Board", shortTitle: "Sunscape 4",
    image: "/media/legacy/4_sunscape.webp", poster: "/media/legacy/4_sunscape.webp",
    games: ["Jade Empire", "Fiesta Riches", "Mermaid’s Treasure"], grid: "Rising 4×5 grid lines",
    jackpot: "Three gamified jackpots described in the board introduction",
    intro: "Sunscape 4 brings Jade Empire, Fiesta Riches and Mermaid’s Treasure together. Its legacy release describes rising 4×5 free-spin grids, nudge features, multiplier bonuses and Link Jackpot connectivity.",
    features: sharedBoardFeatures,
  },
  {
    slug: "sunscape-5", number: "05", title: "Sunscape 5 Skill Game Board", shortTitle: "Sunscape 5",
    image: "/media/legacy/5_sunscape.webp", poster: "/media/legacy/5_sunscape.webp",
    games: ["Eagle Strike", "Frozen War", "Bandit Bounty"], grid: "Rising 10×5 grid lines",
    jackpot: "Eight gamified jackpots described in the board introduction",
    intro: "Sunscape 5 features Eagle Strike, Frozen War and Bandit Bounty. The public legacy release highlights a rising 10×5 free-spin grid, nudge features, multiplier bonuses and Link Jackpot connectivity.",
    features: sharedBoardFeatures,
  },
  {
    slug: "sunscape-6", number: "06", title: "Sunscape 6 archive entry", shortTitle: "Sunscape 6",
    image: "/media/legacy/6_sunscape.webp", poster: "/media/legacy/6_sunscape.webp",
    games: [] as string[], grid: "Not supplied in the public archive", jackpot: "Not supplied in the public archive",
    intro: "The public site published this sixth route under a duplicate Sunscape 5 title without a board description or named games. It remains visible here so the original catalogue is not silently reduced.",
    features: ["Technical support", "Supporting-assets entry", "Sunscapes flyer reference"],
  },
] as const;

export const gameMechanics = [
  { title: "Free spins", image: "/media/legacy/Free-Spins.webp", copy: "Standout free-spin sequences appear throughout the recovered Sunscape material." },
  { title: "Nudge", image: "/media/legacy/Nudge.webp", copy: "Nudge mechanics are presented as a recurring feature across the published boards." },
  { title: "Bonus", image: "/media/legacy/Bonus.webp", copy: "Each recovered board pairs its worlds with distinct bonus concepts." },
  { title: "Jackpot", image: "/media/legacy/Jackpot.webp", copy: "Progressive and linked jackpot systems connect the wider game collection." },
] as const;

export const cabinets = [
  {
    name: "Altitude", label: "Vertical monitor cabinet", image: "/media/generated/theme-v3/altitude-cutout-v3.png",
    sourceImage: "/media/legacy/vertical-cabinet-with-tierplay-logo.webp",
    copy: "The published Altitude Console is a vertical-monitor cabinet built around a 43-inch touchscreen and a 4K display.",
    specifications: ["43-inch vertical touchscreen", "4K resolution display", "Modular, interchangeable build", "Published as made in the USA"],
  },
  {
    name: "Pinnacle", label: "Curved monitor cabinet", image: "/media/generated/theme-v3/pinnacle-cutout-v3.png",
    sourceImage: "/media/legacy/Curved-single-side-with-tierplay-logo.webp",
    copy: "The published Pinnacle Console is the curved-screen cabinet family, presented with a 43-inch touchscreen and a 4K display.",
    specifications: ["43-inch curved touchscreen", "4K resolution display", "Modular, interchangeable build", "Published as made in the USA"],
  },
] as const;

export const cabinetCapabilities = [
  "Remote machine control", "Standard and linked jackpots", "Loyalty offers via SMS and email",
  "Free spins, bonus wheel and promotional media", "Modern PCAP touchscreen", "Dual bash buttons and on-screen controls",
  "JCM UBA validators", "Epic Edge and Mothagoose ticketing", "Inductive phone charging", "Ambient monitor lighting",
  "Daily, weekly and archive game statistics", "Error logs and transaction reporting", "User-controlled audio", "24/7/365 U.S.-based support",
] as const;

export const products = [
  {
    code: "TCM", name: "Tierplay Collection Management", image: "/media/generated/theme-v3/tcm-system-v4.webp",
    copy: "Tierplay’s public product page describes remote machine shutdown and route monitoring designed to help operators manage payment-collection disputes and day-to-day operations.",
    features: ["Remote control for machines at specific locations", "Route monitoring and remote management", "Operational support for dispute resolution"],
  },
  {
    code: "TLJ", name: "Tierplay Link Jackpot", image: "/media/generated/theme-v3/tlj-system-v4.webp",
    copy: "The Link Jackpot product connects machines at a location into a shared progressive jackpot experience, as described on the legacy public site.",
    features: ["Connects machines at one location", "Shared progressive jackpot presentation", "Designed to increase excitement and repeat play"],
  },
] as const;

export const productPillars = [
  { title: "Innovative jackpot systems", copy: "Linked and standard progressive jackpot concepts form the connected layer of the Tierplay floor." },
  { title: "Advanced gaming features", copy: "TCM remote control and the published loyalty system connect operator tools with player return paths." },
  { title: "Technology and quality", copy: "The recovered source describes 43-inch displays, ticketing systems, validators and tested cabinet hardware." },
  { title: "Business-oriented operation", copy: "Modular setup, game statistics and U.S.-based support are presented as the operational foundation." },
] as const;

export const journey = [
  { number: "01", title: "Link jackpots", image: "/media/legacy/banner-player-journey-1.webp", copy: "The published player journey begins with Link Jackpot: machines at a location connect into a shared progressive jackpot designed to create a larger collective moment." },
  { number: "02", title: "Standard progressive jackpots", image: "/media/legacy/Link-Jackpot.webp", copy: "A second layer focuses on standard progressive jackpots across a three-game lobby, giving players multiple jackpot paths within the same board." },
  { number: "03", title: "Loyalty system", image: "/media/legacy/Loyalty-System.webp", copy: "The legacy loyalty concept uses phone and email registration to deliver free-play offers and encourage a return visit. Consent and current behavior require product approval." },
] as const;

export const supportCopy = "At Tierplay, exceptional customer service is our priority. The legacy public site describes a 24/7 U.S.-based support team focused on resolving technical concerns and general enquiries so operations can continue smoothly.";
