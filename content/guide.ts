import { boards, cabinetCapabilities, cabinets, company, gameMechanics, gameplay, journey, products } from "./site";

// The guide answers only from facts already published in content/site.ts. No pricing, no invented specs.
export type GuideLink = { label: string; href: string };
export type GuideMedia = { image: string; label: string; href?: string; kind: "logo" | "cabinet" };
export type GuideAnswer = { text: string; bullets?: string[]; links?: GuideLink[]; chips?: string[]; media?: GuideMedia[] };
type Intent = { id: string; chip?: string; keywords: string[]; answer: () => GuideAnswer };

const [altitude, pinnacle] = cabinets;
const tcm = products.find((p) => p.code === "TCM")!;
const tlj = products.find((p) => p.code === "TLJ")!;
const allGames = boards.flatMap((b) => b.games.map((g) => ({ game: g, board: b })));
const logo = (title: string): GuideMedia | null => {
  const entry = gameplay.find((g) => g.title === title);
  return entry ? { image: entry.logo, label: entry.title, href: `/our_games/${entry.board}`, kind: "logo" } : null;
};
const cabinetCard = (cabinet: (typeof cabinets)[number]): GuideMedia => ({ image: cabinet.image, label: cabinet.name, href: `/cabinets#${cabinet.name.toLowerCase()}-3d`, kind: "cabinet" });

/** Home-screen topics. Each one asks the matching chip. */
export const guideTopics = [
  { chip: "Games", title: "Sunscape games", text: "Six boards, fifteen named games", icon: "games" },
  { chip: "Cabinets", title: "Cabinets", text: "Altitude and Pinnacle", icon: "cabinets" },
  { chip: "Systems", title: "Connected systems", text: "Collection management and Link Jackpot", icon: "systems" },
  { chip: "Support", title: "Support", text: "24/7/365 U.S.-based team", icon: "support" },
] as const;
export const guidePrompts = ["Which board has Tiki Twist?", "Compare Altitude and Pinnacle", "How does the link jackpot work?", "Where is Tierplay available?"];

export const starterChips = ["Games", "Cabinets", "Systems", "Support", "Availability"];

const intents: Intent[] = [
  { id: "greet", keywords: ["hi", "hello", "hey", "help", "start", "who are you"], answer: () => ({
    text: "Greetings, traveller. I’m the Tierplay guide. Ask me about Sunscape games, the Altitude and Pinnacle cabinets, connected systems or support.",
    chips: starterChips,
  }) },
  { id: "games", chip: "Games", keywords: ["game", "games", "sunscape", "board", "boards", "title", "slot", "lineup", "collection"], answer: () => ({
    text: "Six Sunscape boards with fifteen named games across the first five releases.",
    bullets: boards.filter((b) => b.games.length).map((b) => `${b.shortTitle}: ${b.games.join(", ")}`),
    links: [{ label: "Browse the games", href: "/games" }, { label: "Full collection", href: "/games-collection" }],
    media: gameplay.slice(0, 6).map((g) => logo(g.title)).filter((m): m is GuideMedia => m !== null),
    chips: ["Game mechanics", "Cabinets", "Availability"],
  }) },
  { id: "mechanics", chip: "Game mechanics", keywords: ["mechanic", "mechanics", "free spin", "spins", "nudge", "bonus", "feature", "features", "play"], answer: () => ({
    text: "Four mechanics feature across the Sunscape range:",
    bullets: gameMechanics.map((m) => `${m.title}: ${m.copy}`),
    links: [{ label: "See the mechanics", href: "/games" }],
    chips: ["Jackpots", "Games"],
  }) },
  { id: "jackpots", chip: "Jackpots", keywords: ["jackpot", "jackpots", "progressive", "link jackpot", "tlj", "prize", "shared"], answer: () => ({
    text: `${tlj.name}: ${tlj.copy}`,
    bullets: [...tlj.features, `Standard progressive jackpots: ${journey[1].copy}`],
    links: [{ label: "Explore products", href: "/products" }, { label: "Player journey", href: "/player-journey" }],
    chips: ["Systems", "Loyalty"],
  }) },
  { id: "cabinets", chip: "Cabinets", keywords: ["cabinet", "cabinets", "hardware", "machine", "console", "screen", "display", "touchscreen", "4k", "specs", "specification"], answer: () => ({
    text: "Two cabinet forms:",
    bullets: [`${altitude.name} (${altitude.label}): ${altitude.specifications.join(", ")}`, `${pinnacle.name} (${pinnacle.label}): ${pinnacle.specifications.join(", ")}`],
    links: [{ label: "Tour both in 3D", href: "/cabinets" }, { label: "Compare cabinets", href: "/cabinets#cabinet-compare" }],
    media: cabinets.map(cabinetCard),
    chips: ["Altitude", "Pinnacle", "Capabilities"],
  }) },
  { id: "compare", keywords: ["compare", "comparison", "difference", "differences", "versus", "vs", "which cabinet"], answer: () => ({
    text: "Both consoles are listed with a 4K resolution display and a modular, interchangeable build, published as made in the USA. The screen sets them apart:",
    bullets: [`${altitude.name}: ${altitude.specifications[0]}`, `${pinnacle.name}: ${pinnacle.specifications[0]}`],
    links: [{ label: "Compare cabinets", href: "/cabinets#cabinet-compare" }],
    media: cabinets.map(cabinetCard),
    chips: ["Capabilities", "Contact sales"],
  }) },
  { id: "altitude", chip: "Altitude", keywords: ["altitude", "vertical", "upright"], answer: () => ({
    text: `${altitude.name}: ${altitude.copy}`, bullets: [...altitude.specifications], media: [cabinetCard(altitude)],
    links: [{ label: "Tour the Altitude in 3D", href: "/cabinets#altitude-3d" }], chips: ["Pinnacle", "Capabilities"],
  }) },
  { id: "pinnacle", chip: "Pinnacle", keywords: ["pinnacle", "curved"], answer: () => ({
    text: `${pinnacle.name}: ${pinnacle.copy}`, bullets: [...pinnacle.specifications], media: [cabinetCard(pinnacle)],
    links: [{ label: "Tour the Pinnacle in 3D", href: "/cabinets#pinnacle-3d" }, { label: "Compare cabinets", href: "/cabinets#cabinet-compare" }], chips: ["Altitude", "Capabilities"],
  }) },
  { id: "capabilities", chip: "Capabilities", keywords: ["capability", "capabilities", "validator", "jcm", "ticket", "ticketing", "charging", "bash", "button", "audio", "statistics", "reporting", "payment"], answer: () => ({
    text: "Capabilities listed for the cabinet range (confirm model-specific details with Tierplay):",
    bullets: [...cabinetCapabilities],
    links: [{ label: "Cabinet capabilities", href: "/cabinets" }], chips: ["Cabinets", "Support"],
  }) },
  { id: "systems", chip: "Systems", keywords: ["system", "systems", "product", "products", "tcm", "collection management", "remote", "route", "operator", "software"], answer: () => ({
    text: "Two connected systems:",
    bullets: [`${tcm.name}: ${tcm.copy}`, `${tlj.name}: ${tlj.copy}`],
    links: [{ label: "Explore products", href: "/products" }], chips: ["Jackpots", "Loyalty"],
  }) },
  { id: "loyalty", chip: "Loyalty", keywords: ["loyalty", "return", "journey", "reward", "rewards", "sms", "email offers"], answer: () => ({
    text: journey[2].copy,
    links: [{ label: "Player journey", href: "/player-journey" }], chips: ["Jackpots", "Systems"],
  }) },
  { id: "support", chip: "Support", keywords: ["support", "help desk", "technical", "issue", "problem", "broken", "service", "24/7", "repair"], answer: () => ({
    text: "The published support model is a 24/7/365 U.S.-based team focused on technical concerns and general enquiries.",
    bullets: [`Call ${company.phone}`, `Email ${company.email}`],
    links: [{ label: "Support page", href: "/24-7-support" }, { label: "Call now", href: company.phoneHref }],
    chips: ["Contact sales", "Availability"],
  }) },
  { id: "availability", chip: "Availability", keywords: ["available", "availability", "georgia", "state", "where", "location", "market", "region", "buy"], answer: () => ({
    text: "Tierplay products are not available for Georgia market. For availability in your location, speak with the team.",
    links: [{ label: "Contact sales", href: "/contact-sales" }], chips: ["Contact sales", "Games"],
  }) },
  { id: "sales", chip: "Contact sales", keywords: ["price", "pricing", "cost", "quote", "sales", "contact", "distributor", "distribution", "partner", "order", "call", "email", "phone", "address", "office"], answer: () => ({
    text: "Pricing isn’t published. The team handles quotes and distribution directly.",
    bullets: [`Email ${company.email}`, `Call ${company.phone}`, company.address],
    links: [{ label: "Contact sales", href: "/contact-sales" }, { label: "Email the team", href: `${company.emailHref}?subject=Tierplay%20enquiry` }],
    chips: ["Cabinets", "Games"],
  }) },
];

const fallback: GuideAnswer = {
  text: "I only know Tierplay’s published catalogue, so I can’t answer that one. Try a topic below, or ask the team directly.",
  links: [{ label: "Contact sales", href: "/contact-sales" }],
  chips: starterChips,
};

const normalize = (value: string) => value.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9/ ]+/g, " ").replace(/\s+/g, " ").trim();

/** Keyword scoring with game-title and board lookups first, so specific questions get specific answers. */
export function answer(question: string): GuideAnswer {
  const q = ` ${normalize(question)} `;
  const chipHit = intents.find((i) => i.chip && normalize(i.chip) === q.trim());
  if (chipHit) return chipHit.answer();
  const game = allGames.find(({ game }) => q.includes(` ${normalize(game)} `) || q.includes(normalize(game)));
  if (game) return {
    text: `${game.game} is on ${game.board.shortTitle}, alongside ${game.board.games.filter((g) => g !== game.game).join(" and ")}.`,
    bullets: [game.board.grid, game.board.jackpot],
    links: [{ label: `Open ${game.board.shortTitle}`, href: `/our_games/${game.board.slug}` }],
    media: game.board.games.map((title) => logo(title)).filter((m): m is GuideMedia => m !== null),
    chips: ["Game mechanics", "Availability"],
  };
  const board = boards.find((b) => q.includes(normalize(b.shortTitle)));
  if (board) return {
    text: board.intro,
    links: [{ label: `Open ${board.shortTitle}`, href: `/our_games/${board.slug}` }],
    chips: ["Games", "Game mechanics"],
  };
  let best: { intent: Intent; score: number } | null = null;
  for (const intent of intents) {
    const score = intent.keywords.reduce((sum, k) => sum + (q.includes(` ${k} `) || (k.length > 4 && q.includes(k)) ? k.split(" ").length : 0), 0);
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }
  return best ? best.intent.answer() : fallback;
}

export const greeting = intents[0].answer();
