import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/Nav";
import { Button } from "@/components/ui/button";
import {
  getFinancialTwinPrediction,
  financialTwinScore,
  readFinancialTwin,
  saveFinancialTwin,
  scoresFromAnswers,
  type DecisionAnswers,
  type FinancialTwin,
} from "@/lib/financial-twin";

export const Route = createFileRoute("/financial-twin")({
  head: () => ({
    meta: [
      { title: "Create Your Financial Twin — PAISA.BOOM" },
      {
        name: "description",
        content: "Build a playful profile of how you make money decisions and unlock a personalized challenge.",
      },
      { property: "og:title", content: "Create Your Financial Twin — PAISA.BOOM" },
      {
        property: "og:description",
        content: "Don't just learn about money. Learn how you make money decisions.",
      },
    ],
  }),
  component: FinancialTwinPage,
});

type Stage = "intro" | "snapshot" | "decisions" | "building" | "result";
type Snapshot = { income: string; monthlyExpenses: string; savings: string; debt: string };
type QuestionKey = keyof DecisionAnswers;

const QUESTIONS: Array<{
  key: QuestionKey;
  label: string;
  question: string;
  options: Array<{ text: string; score: number }>;
}> = [
  {
    key: "saving",
    label: "Saving",
    question: "You receive some extra money this month. What would you most likely do?",
    options: [
      { text: "Spend most of it", score: 2 },
      { text: "Save most of it", score: 9 },
      { text: "Split it between saving and spending", score: 7 },
      { text: "Invest part of it and save the rest", score: 8 },
    ],
  },
  {
    key: "spending",
    label: "Spending",
    question: "You want something expensive, but buying it would use a large part of this month's budget. What do you do?",
    options: [
      { text: "Buy it immediately", score: 9 },
      { text: "Wait and see if I still want it", score: 5 },
      { text: "Check my budget first", score: 4 },
      { text: "Postpone it or find a cheaper option", score: 2 },
    ],
  },
  {
    key: "risk",
    label: "Risk",
    question: "You get an investment opportunity with higher potential returns but higher risk. What would you do?",
    options: [
      { text: "Invest a large amount", score: 10 },
      { text: "Invest a small amount", score: 7 },
      { text: "Research before deciding", score: 5 },
      { text: "Choose a safer option", score: 2 },
    ],
  },
  {
    key: "investment",
    label: "Investment",
    question: "You have some money left after your regular expenses. What would you most likely do?",
    options: [
      { text: "Keep it as cash", score: 3 },
      { text: "Put it into savings", score: 6 },
      { text: "Explore investments", score: 10 },
      { text: "Spend it", score: 1 },
    ],
  },
  {
    key: "planning",
    label: "Planning",
    question: "You receive your income at the beginning of the month. What is your first move?",
    options: [
      { text: "Spend normally and see what remains", score: 2 },
      { text: "Pay important expenses first", score: 6 },
      { text: "Set aside savings first", score: 8 },
      { text: "Create a plan for spending, saving and future goals", score: 10 },
    ],
  },
];

const BUILD_MESSAGES = [
  "Analysing your financial snapshot...",
  "Understanding your money decisions...",
  "Mapping your financial behaviour...",
  "Preparing your personalized journey...",
];

function FinancialTwinPage() {
  const existing = useMemo(() => readFinancialTwin(), []);
  const [stage, setStage] = useState<Stage>(existing ? "result" : "intro");
  const [snapshot, setSnapshot] = useState<Snapshot>({
    income: existing ? String(existing.income) : "",
    monthlyExpenses: existing ? String(existing.monthlyExpenses) : "",
    savings: existing ? String(existing.savings) : "",
    debt: existing ? String(existing.debt) : "",
  });
  const [answers, setAnswers] = useState<Partial<DecisionAnswers>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof Snapshot, string>>>({});
  const [message, setMessage] = useState(0);
  const [twin, setTwin] = useState<FinancialTwin | null>(existing);

  useEffect(() => {
    if (stage !== "building") return;
    const ticker = window.setInterval(() => setMessage((m) => Math.min(m + 1, 3)), 400);
    const timer = window.setTimeout(async () => {
      const scores = scoresFromAnswers(answers as DecisionAnswers);
      const financials = {
        income: Number(snapshot.income),
        monthlyExpenses: Number(snapshot.monthlyExpenses),
        savings: Number(snapshot.savings),
        debt: Number(snapshot.debt),
        ...scores,
      };
      const prediction = await getFinancialTwinPrediction(financials);
      const result = { ...financials, ...prediction };
      saveFinancialTwin(result);
      setTwin(result);
      setStage("result");
    }, 1800);
    return () => {
      window.clearInterval(ticker);
      window.clearTimeout(timer);
    };
  }, [stage, answers, snapshot]);

  function validateSnapshot() {
    const next: Partial<Record<keyof Snapshot, string>> = {};
    if (!snapshot.income || Number(snapshot.income) <= 0) next.income = "Income must be greater than ₹0.";
    (["monthlyExpenses", "savings", "debt"] as const).forEach((key) => {
      if (snapshot[key] === "" || Number(snapshot[key]) < 0) next[key] = "Enter ₹0 or more.";
    });
    setErrors(next);
    if (Object.keys(next).length === 0) setStage("decisions");
  }

  if (stage === "intro") {
    return (
      <Shell>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-acid">Your money decision double</p>
            <h1 className="mt-3 font-display text-6xl leading-[0.9] tracking-wide text-paper sm:text-8xl">
              CREATE YOUR <span className="text-neon">FINANCIAL TWIN</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl font-semibold text-paper">
              Let's understand how you handle money — then we'll build a learning journey around you.
            </p>
            <p className="mt-4 max-w-xl text-paper/70">
              Your Financial Twin is a digital representation of your financial behaviour. It helps PAISA.BOOM personalize the challenges and concepts you experience.
            </p>
            <Button onClick={() => setStage("snapshot")} className="press neo mt-8 h-auto rounded-none bg-acid px-8 py-4 font-display text-2xl tracking-wide text-ink hover:bg-acid">
              BUILD MY TWIN →
            </Button>
          </div>
          <TwinAvatar />
        </div>
      </Shell>
    );
  }

  if (stage === "snapshot") {
    return (
      <Shell>
        <StepHeader step="01 / 02" title="YOUR FINANCIAL SNAPSHOT" copy="Just the numbers your twin needs. Nothing bank-ish." />
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {([
            ["income", "Monthly Income"],
            ["monthlyExpenses", "Monthly Expenses"],
            ["savings", "Current Savings"],
            ["debt", "Current Debt"],
          ] as Array<[keyof Snapshot, string]>).map(([key, label]) => (
            <label key={key} className="font-mono text-xs uppercase tracking-widest text-paper">
              {label}
              <div className="mt-2 flex border-4 border-paper bg-paper text-ink focus-within:border-acid">
                <span className="border-r-4 border-ink bg-acid px-4 py-3 font-display text-2xl">₹</span>
                <input
                  inputMode="numeric"
                  min="0"
                  type="number"
                  value={snapshot[key]}
                  onChange={(event) => setSnapshot((s) => ({ ...s, [key]: event.target.value }))}
                  className="min-w-0 flex-1 bg-paper px-4 py-3 font-display text-2xl outline-none"
                  aria-invalid={Boolean(errors[key])}
                />
              </div>
              {errors[key] && <span className="mt-2 block normal-case tracking-normal text-hot">{errors[key]}</span>}
            </label>
          ))}
        </div>
        <Button onClick={validateSnapshot} className="press neo mt-8 h-auto rounded-none bg-hot px-8 py-4 font-display text-2xl tracking-wide text-paper hover:bg-hot">
          CONTINUE →
        </Button>
      </Shell>
    );
  }

  if (stage === "decisions") {
    const complete = QUESTIONS.every((q) => answers[q.key] !== undefined);
    return (
      <Shell>
        <StepHeader step="02 / 02" title="HOW DO YOU MAKE MONEY DECISIONS?" copy="Pick what you would really do. Your twin can handle the truth." />
        <div className="mt-8 space-y-8">
          {QUESTIONS.map((q, index) => (
            <fieldset key={q.key} className="border-t-4 border-paper pt-5">
              <legend className="font-mono text-xs uppercase tracking-[0.3em] text-acid">{String(index + 1).padStart(2, "0")} · {q.label}</legend>
              <p className="mt-3 max-w-3xl font-display text-2xl tracking-wide text-paper sm:text-3xl">{q.question}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {q.options.map((option, optionIndex) => {
                  const selected = answers[q.key] === option.score;
                  return (
                    <Button
                      key={option.text}
                      type="button"
                      variant="outline"
                      onClick={() => setAnswers((a) => ({ ...a, [q.key]: option.score }))}
                      className={`h-auto min-h-16 justify-start whitespace-normal rounded-none border-4 border-ink px-4 py-3 text-left font-semibold ${selected ? "bg-acid text-ink hover:bg-acid" : "bg-paper text-ink hover:bg-neon"}`}
                    >
                      <span className="font-display text-xl">{String.fromCharCode(65 + optionIndex)}.</span> {option.text}
                    </Button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
        <Button disabled={!complete} onClick={() => setStage("building")} className="press neo mt-10 h-auto w-full rounded-none bg-hot px-8 py-4 font-display text-2xl tracking-wide text-paper hover:bg-hot sm:w-auto">
          BUILD MY FINANCIAL TWIN →
        </Button>
      </Shell>
    );
  }

  if (stage === "building") {
    return (
      <Shell>
        <div className="grid min-h-[65vh] place-items-center text-center">
          <div>
            <div className="mx-auto h-28 w-28 animate-[wobble_0.7s_ease-in-out_infinite] border-8 border-acid bg-hot shadow-[12px_12px_0_0_var(--color-neon)]" />
            <h1 className="mt-10 font-display text-5xl tracking-wide text-paper sm:text-7xl">BUILDING YOUR FINANCIAL TWIN...</h1>
            <div className="mt-6 space-y-2 font-mono text-sm text-paper/50">
              {BUILD_MESSAGES.map((item, index) => (
                <p key={item} className={index <= message ? "text-acid" : ""}>{index <= message ? "✓" : "·"} {item}</p>
              ))}
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  if (!twin) return null;
  return <TwinResult twin={twin} onRebuild={() => setStage("snapshot")} />;
}

function StepHeader({ step, title, copy }: { step: string; title: string; copy: string }) {
  return <div><p className="font-mono text-xs uppercase tracking-[0.3em] text-acid">{step}</p><h1 className="mt-2 font-display text-5xl leading-none tracking-wide text-paper sm:text-7xl">{title}</h1><p className="mt-4 max-w-xl font-medium text-paper/70">{copy}</p></div>;
}

function TwinAvatar({ twin }: { twin?: FinancialTwin }) {
  const c = (n: string) => `var(--color-${n})`;
  // pixel face: 0 empty, 1 skin, 2 eye, 3 mouth, 4 hair/visor
  const face = [
    "00444444440",
    "04444444444",
    "41111111114",
    "41221112214",
    "41221112214",
    "41111111114",
    "41111111114",
    "41133333114",
    "04111111140",
    "00411111400",
  ];
  const colors: Record<string, string> = { "1": c("hot"), "2": c("acid"), "3": c("ink"), "4": c("neon") };
  const px = 14;
  const ox = 200 - (11 * px) / 2;
  const oy = 200 - (10 * px) / 2 - 4;
  const signals = [
    { label: "SAVE", v: twin?.savingBehavior ?? 7, x: 30, y: 70, col: "neon", d: "0s" },
    { label: "SPEND", v: twin?.spendingBehavior ?? 4, x: 300, y: 50, col: "hot", d: "1.2s" },
    { label: "RISK", v: twin?.riskTolerance ?? 5, x: 318, y: 300, col: "acid", d: "2.1s" },
    { label: "INVEST", v: twin?.investmentBehavior ?? 6, x: 18, y: 320, col: "neon", d: "0.6s" },
  ];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible" aria-label="Your digital financial twin">
        <circle cx="200" cy="200" r="190" fill="none" stroke={c("paper")} strokeOpacity="0.12" strokeWidth="1" />
        <g className="twin-spin" style={{ transformOrigin: "200px 200px" }}>
          <circle cx="200" cy="200" r="165" fill="none" stroke={c("neon")} strokeWidth="2" strokeDasharray="4 10" />
          <circle cx="365" cy="200" r="7" fill={c("acid")} />
          <circle cx="35" cy="200" r="4" fill={c("hot")} />
        </g>
        <g className="twin-spin-rev" style={{ transformOrigin: "200px 200px" }}>
          <path d="M 70 200 A 130 130 0 0 1 330 200" fill="none" stroke={c("hot")} strokeWidth="6" strokeLinecap="square" strokeDasharray="60 18" />
        </g>
        {/* data ring from twin scores */}
        {[...Array(40)].map((_, i) => {
          const a = (i / 40) * Math.PI * 2;
          const len = 6 + ((i * 7) % 11);
          const r1 = 112;
          return <line key={i} x1={200 + Math.cos(a) * r1} y1={200 + Math.sin(a) * r1} x2={200 + Math.cos(a) * (r1 + len)} y2={200 + Math.sin(a) * (r1 + len)} stroke={i % 5 === 0 ? c("acid") : c("paper")} strokeOpacity={i % 5 === 0 ? 1 : 0.35} strokeWidth="3" />;
        })}
        <circle cx="200" cy="200" r="100" fill={c("electric")} stroke={c("paper")} strokeWidth="4" />
        <g style={{ filter: `drop-shadow(6px 6px 0 ${c("ink")})` }}>
          {face.flatMap((row, y) => row.split("").map((v, x) => v === "0" ? null : <rect key={`${x}-${y}`} x={ox + x * px} y={oy + y * px} width={px} height={px} fill={colors[v]} />))}
          <rect x={ox + 2 * px + 3} y={oy + 3 * px + 3} width="6" height="6" fill={c("paper")} />
          <rect x={ox + 7 * px + 3} y={oy + 3 * px + 3} width="6" height="6" fill={c("paper")} />
        </g>
        {signals.map((s) => (
          <g key={s.label} className="twin-float" style={{ animationDelay: s.d }}>
            <line x1={s.x + 30} y1={s.y + 10} x2="200" y2="200" stroke={c(s.col)} strokeOpacity="0.35" strokeDasharray="2 5" />
            <text x={s.x} y={s.y} fill={c(s.col)} fontFamily="monospace" fontSize="11" letterSpacing="2">{s.label}</text>
            {[0, 1, 2, 3, 4].map((b) => <rect key={b} className="twin-bar" style={{ animationDelay: `${b * 0.15}s`, transformOrigin: `0 ${s.y + 22}px` }} x={s.x + b * 9} y={s.y + 22 - (b < Math.ceil(s.v / 2) ? 6 + b * 3 : 4)} width="6" height={b < Math.ceil(s.v / 2) ? 6 + b * 3 : 4} fill={b < Math.ceil(s.v / 2) ? c(s.col) : c("paper")} fillOpacity={b < Math.ceil(s.v / 2) ? 1 : 0.25} />)}
            <text x={s.x + 50} y={s.y + 22} fill={c("paper")} fontFamily="monospace" fontSize="10">{s.v}/10</text>
          </g>
        ))}
      </svg>
      <span className="absolute right-[6%] top-[42%] flex items-center gap-2 bg-ink px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-acid"><span className="h-2 w-2 animate-pulse rounded-full bg-neon" />Live twin</span>
      <span className="absolute bottom-[6%] left-1/2 -translate-x-1/2 -rotate-3 bg-acid px-4 py-1 font-display text-2xl tracking-wide text-ink shadow-[4px_4px_0_0_var(--color-hot)]">YOU 2.0</span>
    </div>
  );
}

function TwinResult({ twin, onRebuild }: { twin: FinancialTwin; onRebuild: () => void }) {
  const money = (value: number) => value >= 1000 ? `₹${+(value / 1000).toFixed(1)}K` : `₹${value}`;
  const twinScore = financialTwinScore(twin);
  const patterns = [
    ["Saving", twin.savingBehavior, "bg-neon"], ["Spending", twin.spendingBehavior, "bg-hot"],
    ["Risk", twin.riskTolerance, "bg-acid"], ["Investment", twin.investmentBehavior, "bg-neon"],
    ["Planning", twin.planningBehavior, "bg-acid"],
  ] as const;
  const Rule = () => <div className="my-14 h-px w-full bg-paper/20 sm:my-20" />;
  return (
    <Shell>
      <section className="text-center text-paper">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-acid">Profile unlocked</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.35em] text-paper/50">Digital identity active</p>
        <div className="mt-4"><TwinAvatar twin={twin} /></div>
        <h1 className="mt-6 font-display text-5xl leading-[0.9] tracking-wide sm:text-7xl">MEET YOUR<br />FINANCIAL TWIN</h1>
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.3em] text-paper/60">Your money type</p>
        <p className="font-display text-7xl leading-none tracking-wide text-acid sm:text-9xl">{twin.profile.toUpperCase()}</p>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-paper/60">{Math.round(twin.confidence * 100)}% model confidence</p>
        <p className="mt-8 font-display text-2xl tracking-wide text-neon">YOUR TWIN EVOLVES AS YOU PLAY.</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-paper/60">Every financial decision you make helps PAISA.BOOM understand your behaviour better.</p>
      </section>

      <Rule />
      <section>
        <h2 className="font-display text-3xl tracking-wide text-acid sm:text-4xl">YOUR FINANCIAL SNAPSHOT</h2>
        <div className="mt-6 grid grid-cols-2 gap-y-6 md:grid-cols-4">
          {[["Income", twin.income], ["Expenses", twin.monthlyExpenses], ["Savings", twin.savings], ["Debt", twin.debt]].map(([label, value], i) => (
            <div key={label as string} className={`px-4 ${i % 2 ? "border-l border-paper/25" : ""} ${i === 2 ? "md:border-l md:border-paper/25" : ""}`}>
              <p className="font-display text-4xl tracking-wide text-paper sm:text-5xl">{money(value as number)}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-paper/50">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <Rule />
      <section className="grid gap-14 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <h2 className="font-display text-3xl tracking-wide text-acid sm:text-4xl">YOUR MONEY PATTERNS</h2>
          <p className="mt-1 text-sm text-paper/50">Signals from your financial snapshot and decisions.</p>
          <div className="mt-8 space-y-4">
            {patterns.map(([label, score, col]) => (
              <div key={label} className="grid grid-cols-[90px_1fr_40px] items-center gap-3 font-mono text-xs uppercase tracking-wider text-paper sm:grid-cols-[120px_1fr_48px]">
                <span>{label}</span>
                <div className="flex gap-1">{[...Array(10)].map((_, i) => <span key={i} className={`h-4 flex-1 ${i < score ? col : "bg-paper/15"}`} />)}</div>
                <span className="text-right text-paper/60">{score}/10</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-l-4 border-hot pl-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-paper/60">Financial twin score</p>
          <div className="mt-2 flex items-end gap-2"><span className="font-display text-8xl leading-none text-neon">{twinScore}</span><span className="pb-2 font-display text-3xl text-paper/40">/ 100</span></div>
          <div className="mt-3 h-1.5 bg-paper/15"><div className="h-full bg-hot" style={{ width: `${twinScore}%` }} /></div>
          <p className="mt-4 font-semibold text-paper">Your starting financial behaviour score</p>
          <p className="mt-1 text-sm text-paper/50">This is a starting snapshot — your Twin evolves as you make decisions.</p>
        </div>
      </section>

      <Rule />
      <section>
        <h2 className="font-display text-3xl tracking-wide text-acid sm:text-4xl">YOUR MONEY PERSONALITY</h2>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div><p className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-neon"><span className="h-0.5 w-8 bg-neon" />Strength</p><p className="mt-3 font-display text-3xl leading-tight tracking-wide text-paper">Balanced saving + spending behaviour</p></div>
          <div><p className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-hot"><span className="h-0.5 w-8 bg-hot" />Growth area</p><p className="mt-3 font-display text-3xl leading-tight tracking-wide text-paper">Long-term investment planning</p></div>
        </div>
      </section>

      <Rule />
      <section className="relative">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-hot">Your next challenge</p>
        <h2 className="mt-3 font-display text-6xl leading-[0.85] tracking-wide text-paper sm:text-8xl lg:text-9xl">INVESTMENT &<br /><span className="text-acid">GOAL PLANNING</span></h2>
        <p className="mt-6 max-w-2xl text-lg font-medium text-paper/80">Your profile shows a balanced financial approach. Let's see how you handle a long-term financial decision.</p>
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-paper/50">Why this scenario?</p>
        <p className="mt-1 text-sm text-paper/70">Recommended based on your current financial behaviour.</p>
        <Link to="/play/$scenarioId" params={{ scenarioId: twin.recommendedScenarioId }} className="press neo-lg mt-10 inline-block bg-acid px-8 py-5 font-display text-3xl tracking-wide text-ink sm:text-4xl">PLAY THIS CHALLENGE →</Link>
      </section>

      <Rule />
      <section className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-paper/50">Your twin evolves as you play</p>
        <div className="mt-3 flex items-center justify-center gap-3 font-display text-2xl tracking-wide text-paper sm:gap-5"><span>PLAY</span><span className="text-acid">→</span><span>DECIDE</span><span className="text-hot">→</span><span>EVOLVE</span></div>
        <Button variant="link" onClick={onRebuild} className="mt-6 text-paper/50">Rebuild my twin</Button>
      </section>
    </Shell>
  );
}