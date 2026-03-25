export const industryFacts = [
  "Over 90% of world trade is carried by sea — the backbone of the global economy.",
  "Malcolm McLean shipped the first container in 1956 — 58 aluminum boxes on the SS Ideal-X from Newark to Houston.",
  "A single 40ft container can hold about 8,000 pairs of shoes or 48,000 bananas.",
  "The Ever Given blocked the Suez Canal for 6 days in 2021, holding up an estimated $9.6 billion in daily trade.",
  "Port of Shanghai handles over 47 million TEUs annually — more than the entire United States combined.",
  "There are approximately 17 million shipping containers circulating the world right now.",
  "Container ships are the most fuel-efficient form of cargo transport, moving 1 ton of goods 150 miles on a single gallon of fuel.",
  "A fully loaded Maersk Triple-E class ship carries 18,000 containers and is longer than the Empire State Building is tall.",
  "LCL consolidation can reduce shipping costs by 30–40% compared to booking a full container.",
  "The global container fleet, if lined up end to end, would circle the equator over 2.5 times.",
  "A TEU (Twenty-foot Equivalent Unit) is the standard measure — a single 20ft container equals 1 TEU.",
  "The Panama Canal expanded in 2016 to fit Neopanamax vessels carrying up to 14,000 TEUs.",
  "Modern container ships can travel at 24 knots — roughly 28 mph — burning 150+ tons of fuel per day.",
  "The average container makes 2.5 trips per year, spending more time in port than at sea.",
  "Global shipping produces about 2.5% of the world's greenhouse gas emissions — less than aviation.",
  "A shipping container can last 10–12 years in active service before being retired or repurposed.",
  "Approximately 10,000 containers are lost at sea each year — most sink to the ocean floor.",
  "The world's busiest shipping route is between Asia and Europe, passing through the Strait of Malacca.",
  "It costs roughly $2,000–$4,000 to ship a 40ft container from China to the US West Coast.",
  "Container standardization in the 1960s reduced cargo loading time from weeks to hours.",
];

export const industryQuotes = [
  { text: "A ship in harbor is safe, but that is not what ships are built for.", author: "John A. Shedd" },
  { text: "The sea, once it casts its spell, holds one in its net of wonder forever.", author: "Jacques Cousteau" },
  { text: "Twenty feet of steel, and the world changed forever.", author: "Marc Levinson, The Box" },
  { text: "The container made shipping so efficient that the cost of transport became almost irrelevant.", author: "The Economist" },
  { text: "He that would learn to pray, let him go to sea.", author: "George Herbert" },
  { text: "The ocean stirs the heart, inspires the imagination, and brings eternal joy to the soul.", author: "Wyland" },
];

export const freightwareLines = [
  "Optimizing every cubic meter, one container at a time.",
  "Where constraint programming meets the open ocean.",
  "Turning manifest data into perfect load plans.",
  "AI-powered logistics for the modern freight yard.",
];

export function getRandomFact() {
  const allContent = [
    ...industryFacts.map((text) => ({ type: 'fact', text })),
    ...industryQuotes.map((q) => ({ type: 'quote', text: `"${q.text}" — ${q.author}` })),
    ...freightwareLines.map((text) => ({ type: 'branded', text })),
  ];
  return allContent[Math.floor(Math.random() * allContent.length)];
}

export function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'dusk';
  return 'night';
}

export const pageConfig = {
  dashboard: { duration: 3000, loadingText: 'Preparing your operations overview...' },
  shipments: { duration: 2000, loadingText: 'Scanning manifest data...' },
  optimizer: { duration: 2000, loadingText: 'Preparing solver engine...' },
  loadplan:  { duration: 2000, loadingText: 'Rendering 3D environment...' },
  replan:    { duration: 2000, loadingText: 'Loading deviation scenarios...' },
  tablet:    { duration: 2000, loadingText: 'Preparing loading instructions...' },
  reports:   { duration: 2000, loadingText: 'Generating reports...' },
};
