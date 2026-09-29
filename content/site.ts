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
  "Product details are based on Tierplay’s earlier public catalogue. Confirm current specifications and availability with the team.";

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
    intro: "Sunscape 1 brings Rich Times, Gang of Evils and Rise of the Dragon together with Link Jackpot connectivity, rising 8×5 free-spin grids, nudges and bonuses.",
    features: sharedBoardFeatures,
  },
  {
    slug: "sunscape-2", number: "02", title: "Sunscape 2 Skill Game Board", shortTitle: "Sunscape 2",
    image: "/media/legacy/2_sunscape-2-720x508-1.webp", poster: "/media/legacy/tikitwist-thumnails.webp",
    games: ["Bison Showdown", "Tiki Twist", "Sinister Show"], grid: "Rising 10×5 grid lines",
    jackpot: "Eight progressive jackpots described in the board introduction",
    intro: "Sunscape 2 brings Bison Showdown, Tiki Twist and Sinister Show together with Link Jackpot connectivity, rising 10×5 free-spin grids, nudges and multiplier bonuses.",
    features: sharedBoardFeatures,
  },
  {
    slug: "sunscape-3", number: "03", title: "Sunscape 3 Skill Game Board", shortTitle: "Sunscape 3",
    image: "/media/legacy/3_sunscape.webp", poster: "/media/legacy/3_sunscape.webp",
    games: ["Fortune Quest", "Birix Haven", "Fiery Frenzy"], grid: "Rising 10×5 grid lines",
    jackpot: "Five gamified jackpots described in the board introduction",
    intro: "Sunscape 3 features Fortune Quest, Birix Haven and Fiery Frenzy, alongside Link Jackpot connectivity, rising 10×5 free-spin grids, nudges and multiplier bonuses.",
    features: sharedBoardFeatures,
  },
  {
    slug: "sunscape-4", number: "04", title: "Sunscape 4 Skill Game Board", shortTitle: "Sunscape 4",
    image: "/media/legacy/4_sunscape.webp", poster: "/media/legacy/4_sunscape.webp",
    games: ["Jade Empire", "Fiesta Riches", "Mermaid’s Treasure"], grid: "Rising 4×5 grid lines",
    jackpot: "Three gamified jackpots described in the board introduction",
    intro: "Sunscape 4 brings Jade Empire, Fiesta Riches and Mermaid’s Treasure together with rising 4×5 free-spin grids, nudges, multiplier bonuses and Link Jackpot connectivity.",
    features: sharedBoardFeatures,
  },
  {
    slug: "sunscape-5", number: "05", title: "Sunscape 5 Skill Game Board", shortTitle: "Sunscape 5",
    image: "/media/legacy/5_sunscape.webp", poster: "/media/legacy/5_sunscape.webp",
    games: ["Eagle Strike", "Frozen War", "Bandit Bounty"], grid: "Rising 10×5 grid lines",
    jackpot: "Eight gamified jackpots described in the board introduction",
    intro: "Sunscape 5 features Eagle Strike, Frozen War and Bandit Bounty, with a rising 10×5 free-spin grid, nudges, multiplier bonuses and Link Jackpot connectivity.",
    features: sharedBoardFeatures,
  },
  {
    slug: "sunscape-6", number: "06", title: "Sunscape 6 archive entry", shortTitle: "Sunscape 6",
    image: "/media/legacy/6_sunscape.webp", poster: "/media/legacy/6_sunscape.webp",
    games: [] as string[], grid: "Not supplied in the public archive", jackpot: "Not supplied in the public archive",
    intro: "The sixth Sunscape board is listed without a published game lineup or feature description. Contact Tierplay for current details.",
    features: ["Technical support", "Supporting-assets entry", "Sunscapes flyer reference"],
  },
] as const;

export const gameMechanics = [
  { title: "Free spins", image: "/media/legacy/Free-Spins.webp", copy: "Free-spin sequences appear across the Sunscape boards." },
  { title: "Nudge", image: "/media/legacy/Nudge.webp", copy: "Nudges add another turn to the published game mechanics." },
  { title: "Bonus", image: "/media/legacy/Bonus.webp", copy: "Each board pairs its games with bonus features." },
  { title: "Jackpot", image: "/media/legacy/Jackpot.webp", copy: "Progressive and linked jackpots connect the collection." },
] as const;

const shots = (freeSpins: string, nudge: string, bonus: string, jackpot: string) => [
  { mechanic: "Free spins", image: `/media/legacy/${freeSpins}` },
  { mechanic: "Nudge", image: `/media/legacy/${nudge}` },
  { mechanic: "Bonus", image: `/media/legacy/${bonus}` },
  { mechanic: "Jackpot", image: `/media/legacy/${jackpot}` },
];

// Recovered legacy gameplay artwork for the six games with published mechanic images.
export const gameplay = [
  { title: "Rise of the Dragon", board: "sunscapes", logo: "/media/legacy/01-Logo-Rise-of-The-Dragon.webp", shots: shots("Raise-of-Dragon-Free-Spins.webp", "Raise-of-Dragon-Nudge.webp", "Raise-of-Dragon-Bonus.webp", "Raise-of-Dragon-Jackpot.webp") },
  { title: "Gang of Evils", board: "sunscapes", logo: "/media/legacy/02-Gangs-of-Evils.webp", shots: shots("Gang_of_Evil-Free-Spins.webp", "Gang_of_Evil-Nudge.webp", "Gang_of_Evil-Bonus.webp", "Gang_of_Evil-Jackpot.webp") },
  { title: "Rich Times", board: "sunscapes", logo: "/media/legacy/03-Rich-Times.webp", shots: shots("Free-Spins.webp", "Nudge.webp", "Bonus.webp", "Jackpot.webp") },
  { title: "Bison Showdown", board: "sunscape-2", logo: "/media/legacy/04-Rise-of-Showdown.webp", shots: shots("Bison_Showdown-Free-Spins_5x5-copy.webp", "Bison_Showdown-Nudge-copy.webp", "Bison_Showdown-Bonus-copy.webp", "Bison_Showdown-Jackpot-copy.webp") },
  { title: "Tiki Twist", board: "sunscape-2", logo: "/media/legacy/05-Tiki-Twist.webp", shots: shots("tiki-twist-Free-Spins.webp", "tiki-twist-Nudge.webp", "tiki-twist-Bonus.webp", "tiki-twist-Jackpot.webp") },
  { title: "Sinister Show", board: "sunscape-2", logo: "/media/legacy/06-logo-sinister-show.webp", shots: shots("Sinister_Show-Free-Spins-copy.webp", "Sinister_Show-Nudge.webp", "Sinister_Show-Bonus-copy.webp", "Sinister_Show-Jackpot-copy.webp") },
] as const;

export const cabinets = [
  {
    name: "Altitude", label: "Vertical monitor cabinet", image: "/media/generated/theme-v3/altitude-cutout-v3.png",
    sourceImage: "/media/legacy/vertical-cabinet-with-tierplay-logo.webp",
    copy: "A vertical cabinet with a 43-inch touchscreen and 4K display.",
    specifications: ["43-inch vertical touchscreen", "4K resolution display", "Modular, interchangeable build", "Published as made in the USA"],
  },
  {
    name: "Pinnacle", label: "Curved monitor cabinet", image: "/media/generated/theme-v3/pinnacle-cutout-v3.png",
    sourceImage: "/media/legacy/Curved-single-side-with-tierplay-logo.webp",
    copy: "A curved-screen cabinet with a 43-inch touchscreen and 4K display.",
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
    code: "TCM", name: "Tierplay Collection Management", image: "/media/generated/tierplay-floor-network-v1.webp",
    copy: "Remote machine control and route monitoring help operators manage locations and resolve payment-collection disputes.",
    features: ["Remote control for machines at specific locations", "Route monitoring and remote management", "Operational support for dispute resolution"],
  },
  {
    code: "TLJ", name: "Tierplay Link Jackpot", image: "/media/generated/tierplay-link-energy-v1.webp",
    copy: "Connect machines at one location for a shared progressive jackpot experience.",
    features: ["Connects machines at one location", "Shared progressive jackpot presentation", "Designed to increase excitement and repeat play"],
  },
] as const;

export const productPillars = [
  { title: "Jackpot systems", copy: "Linked and standard progressive jackpots connect play across the floor." },
  { title: "Operator tools", copy: "TCM remote control helps teams manage machines and routes." },
  { title: "Cabinet hardware", copy: "The published range lists 43-inch displays, ticketing systems and validators." },
  { title: "Daily operation", copy: "Modular setup, game statistics and support help keep the floor running." },
] as const;

export const journey = [
  { number: "01", title: "Link jackpots", image: "/media/generated/tierplay-link-energy-v1.webp", copy: "Machines at one location connect into a shared progressive jackpot." },
  { number: "02", title: "Standard progressive jackpots", image: "/media/generated/tierplay-floor-network-v1.webp", copy: "A three-game lobby gives players multiple jackpot paths within one board." },
  { number: "03", title: "Loyalty system", image: "/media/generated/theme-v3/entrance-editorial-v5.webp", copy: "A loyalty concept connects registration and offers with a return visit. Ask Tierplay about current availability and consent settings." },
] as const;

export const supportCopy = "At Tierplay, exceptional customer service is our priority. The legacy public site describes a 24/7 U.S.-based support team focused on resolving technical concerns and general enquiries so operations can continue smoothly.";

// Answers restate facts published elsewhere in this file; no new claims.
export const siteFaq = [
  { q: "Where are Tierplay products available?", a: "Tierplay products are not available for Georgia market. Contact the team about availability for your location." },
  { q: "Which cabinets does Tierplay offer?", a: "Two consoles: Altitude, a vertical cabinet, and Pinnacle, a curved-screen cabinet. Both are listed with a 43-inch touchscreen and 4K display." },
  { q: "How many Sunscape games are there?", a: "Six Sunscape boards, with fifteen named games across the first five releases. The sixth lineup has yet to be published." },
  { q: "What is Tierplay Collection Management (TCM)?", a: "Remote machine control and route monitoring that help operators manage locations and resolve payment-collection disputes." },
  { q: "What is Tierplay Link Jackpot (TLJ)?", a: "It connects machines at one location for a shared progressive jackpot experience." },
  { q: "How do I reach support?", a: "The published support model is a 24/7/365 U.S.-based team. Call 706-575-8838 or email info@tierplay.com." },
  { q: "Which payment and ticketing hardware is listed?", a: "The cabinet range lists JCM UBA validators and Epic Edge and Mothagoose ticketing systems." },
  { q: "Are these specifications current?", a: "Product details are based on Tierplay’s earlier public catalogue. Confirm current specifications and availability with the team." },
] as const;
