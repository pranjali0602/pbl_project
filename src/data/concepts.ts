export type Difficulty = "Rookie" | "Intermediate" | "Advanced";

export type Concept = {
  id: string;
  name: string;
  emoji: string;
  oneLiner: string;
  explain: string;
  why: string;
  difficulty: Difficulty;
  track: TrackId;
  relatedScenarios: string[];
};

export type TrackId = "spending" | "saving" | "investing" | "credit" | "reality";

export const TRACKS: { id: TrackId; label: string; emoji: string }[] = [
  { id: "spending", label: "Spending Awareness", emoji: "💸" },
  { id: "saving", label: "Saving Awareness", emoji: "💰" },
  { id: "investing", label: "Investing Knowledge", emoji: "📈" },
  { id: "credit", label: "Credit Knowledge", emoji: "💳" },
  { id: "reality", label: "Financial Reality", emoji: "🌍" },
];

export const CONCEPTS: Concept[] = [
  {
    id: "budgeting",
    name: "50/30/20 Budgeting",
    emoji: "🧮",
    oneLiner: "Half for needs, a third for wants, a fifth for future you.",
    explain:
      "Split your income three ways: 50% needs (rent, food, travel), 30% wants (fun stuff), 20% savings. It's a starting line, not a law — shift the numbers to fit your life.",
    why: "Without a split, wants quietly eat the money that was supposed to become savings.",
    difficulty: "Rookie",
    track: "spending",
    relatedScenarios: ["first-salary", "month-end-crunch"],
  },
  {
    id: "emergency-fund",
    name: "Emergency Fund",
    emoji: "🛟",
    oneLiner: "3–6 months of expenses parked where you can grab it fast.",
    explain:
      "An emergency fund is boring money that sits in a savings account doing nothing — until your laptop dies or you lose a job. Then it's the difference between a bad week and a debt spiral.",
    why: "Without it, every surprise becomes a credit card at 42% interest.",
    difficulty: "Rookie",
    track: "saving",
    relatedScenarios: ["laptop-dies", "first-salary"],
  },
  {
    id: "lifestyle-creep",
    name: "Lifestyle Creep",
    emoji: "🐍",
    oneLiner: "Income goes up, so do your 'necessary' expenses. Savings stay flat.",
    explain:
      "You got a raise and upgraded your rent, your phone, your weekends. Six months later you earn 40% more and save exactly the same amount as before.",
    why: "The whole point of earning more is keeping more. Creep steals the raise.",
    difficulty: "Intermediate",
    track: "spending",
    relatedScenarios: ["month-end-crunch", "first-salary"],
  },
  {
    id: "compound-interest",
    name: "Compound Interest",
    emoji: "🌱",
    oneLiner: "Your money earns money, then that money earns money too.",
    explain:
      "₹5,000/month at 12% for 25 years is roughly ₹95 lakh — and only ₹15 lakh of that is money you put in. The rest is time doing the work.",
    why: "Starting 5 years earlier beats investing twice as much later. Time is the cheat code.",
    difficulty: "Rookie",
    track: "investing",
    relatedScenarios: ["sip-or-skip", "first-salary"],
  },
  {
    id: "risk-return",
    name: "Risk vs Return",
    emoji: "🎲",
    oneLiner: "Higher possible returns always come with higher possible losses.",
    explain:
      "If something promises 10x in two weeks with no risk, the risk is you. Real returns scale with volatility — index funds wobble, small caps swing, memecoins vanish.",
    why: "Knowing your risk appetite stops you panicking at the worst possible moment.",
    difficulty: "Intermediate",
    track: "investing",
    relatedScenarios: ["crypto-friend", "sip-or-skip"],
  },
  {
    id: "credit-score",
    name: "Credit Score",
    emoji: "📊",
    oneLiner: "A number that decides how much future money costs you.",
    explain:
      "In India it's 300–900. Pay bills on time, use under 30% of your limit, don't apply for 5 cards at once. A 750+ score gets you cheaper loans for a decade.",
    why: "A weak score can add lakhs to a future home loan. Same house, more money.",
    difficulty: "Intermediate",
    track: "credit",
    relatedScenarios: ["credit-card-trap", "phone-emi"],
  },
  {
    id: "emi-cost",
    name: "The Real Cost of EMIs",
    emoji: "🧾",
    oneLiner: "'No cost EMI' is usually a discount you gave up.",
    explain:
      "Splitting ₹60,000 across 12 months feels painless, but you often lose the cash discount and lock future income. Stack three EMIs and half your salary is spoken for before it lands.",
    why: "EMIs convert today's want into tomorrow's obligation.",
    difficulty: "Intermediate",
    track: "credit",
    relatedScenarios: ["phone-emi", "credit-card-trap"],
  },
  {
    id: "inflation",
    name: "Inflation",
    emoji: "🎈",
    oneLiner: "Why ₹500 today won't buy what ₹500 bought five years ago.",
    explain:
      "Prices rise roughly 6% a year in India. Cash sitting in a savings account at 3% is quietly losing about 3% of its power every single year.",
    why: "'Safe' money that doesn't grow is still losing. Doing nothing is a decision.",
    difficulty: "Intermediate",
    track: "reality",
    relatedScenarios: ["sip-or-skip", "laptop-dies"],
  },
  {
    id: "opportunity-cost",
    name: "Opportunity Cost",
    emoji: "🔀",
    oneLiner: "Every rupee spent is a different rupee you didn't get.",
    explain:
      "That ₹8,000 pair of sneakers isn't just ₹8,000. Invested at 12%, it's about ₹25,000 in ten years. You didn't buy sneakers, you traded a future ₹25,000 for them.",
    why: "Thinking in trade-offs beats thinking in prices.",
    difficulty: "Rookie",
    track: "spending",
    relatedScenarios: ["first-salary", "phone-emi"],
  },
  {
    id: "insurance",
    name: "Insurance",
    emoji: "🩺",
    oneLiner: "Small predictable cost to avoid a huge unpredictable one.",
    explain:
      "Health insurance at 23 is cheap because you're healthy. One hospital bill without it can wipe out three years of savings in a week.",
    why: "Insurance protects your savings, not your lifestyle.",
    difficulty: "Advanced",
    track: "reality",
    relatedScenarios: ["laptop-dies", "crypto-friend"],
  },
];

export const conceptById = (id: string) => CONCEPTS.find((c) => c.id === id);
