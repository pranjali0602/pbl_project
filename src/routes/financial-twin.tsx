import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/Nav";
import { Button } from "@/components/ui/button";
import {
  getFinancialTwinPrediction,
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

function TwinAvatar() {
  return (
    <div className="relative mx-auto grid aspect-square w-full max-w-[330px] place-items-center border-8 border-paper bg-electric shadow-[16px_16px_0_0_var(--color-hot)]">
      <div className="absolute left-5 top-5 h-10 w-10 bg-acid" /><div className="absolute bottom-5 right-5 h-12 w-12 bg-neon" />
      <div className="relative h-48 w-44 border-8 border-ink bg-hot">
        <div className="absolute left-7 top-10 h-9 w-9 border-4 border-ink bg-acid" /><div className="absolute right-7 top-10 h-9 w-9 border-4 border-ink bg-acid" />
        <div className="absolute bottom-8 left-1/2 h-5 w-20 -translate-x-1/2 bg-ink" />
      </div>
      <span className="absolute -bottom-5 -left-5 border-4 border-ink bg-acid px-4 py-2 font-display text-2xl text-ink">₹ YOU 2.0</span>
    </div>
  );
}

function TwinResult({ twin, onRebuild }: { twin: FinancialTwin; onRebuild: () => void }) {
  const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;
  const patterns = [
    ["Saving tendency", twin.savingBehavior], ["Spending tendency", twin.spendingBehavior],
    ["Risk approach", twin.riskTolerance], ["Investment approach", twin.investmentBehavior],
    ["Planning style", twin.planningBehavior],
  ] as const;
  return (
    <Shell>
      <section className="grid-noise border-4 border-paper bg-electric p-6 text-paper shadow-[12px_12px_0_0_var(--color-hot)] sm:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-acid">Profile unlocked</p>
        <div className="mt-5 grid items-center gap-8 md:grid-cols-[220px_1fr]">
          <TwinAvatar />
          <div><h1 className="font-display text-5xl leading-none tracking-wide sm:text-7xl">MEET YOUR FINANCIAL TWIN</h1><p className="mt-4 font-display text-6xl tracking-wide text-acid">{twin.profile.toUpperCase()}</p><p className="font-mono text-sm uppercase tracking-[0.3em]">{Math.round(twin.confidence * 100)}% confidence</p></div>
        </div>
      </section>

      <section className="mt-14 border-b-4 border-paper pb-10">
        <h2 className="font-display text-4xl tracking-wide text-acid">YOUR FINANCIAL SNAPSHOT</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[["Income", twin.income], ["Expenses", twin.monthlyExpenses], ["Savings", twin.savings], ["Debt", twin.debt]].map(([label, value]) => <div key={label} className="border-l-4 border-neon pl-4"><p className="font-mono text-[10px] uppercase tracking-widest text-paper/50">{label}</p><p className="font-display text-2xl tracking-wide text-paper sm:text-3xl">{money(value as number)}</p></div>)}
        </div>
      </section>

      <section className="mt-10 grid gap-10 lg:grid-cols-2">
        <div><h2 className="font-display text-4xl tracking-wide text-acid">YOUR MONEY PATTERNS</h2><div className="mt-5 space-y-5">{patterns.map(([label, score]) => <div key={label}><div className="mb-2 flex justify-between font-mono text-xs uppercase tracking-wider text-paper"><span>{label}</span><span>{score}/10</span></div><div className="h-5 border-4 border-paper"><div className="h-full bg-neon" style={{ width: `${score * 10}%` }} /></div></div>)}</div></div>
        <div><h2 className="font-display text-4xl tracking-wide text-acid">YOUR MONEY PERSONALITY</h2><div className="mt-5 border-l-8 border-neon pl-5"><p className="font-mono text-xs uppercase tracking-widest text-paper/50">Strength</p><p className="mt-1 text-xl font-semibold text-paper">You're showing a balanced approach to saving and spending.</p></div><div className="mt-6 border-l-8 border-hot pl-5"><p className="font-mono text-xs uppercase tracking-widest text-paper/50">Growth area</p><p className="mt-1 text-xl font-semibold text-paper">Strengthen your long-term investment planning.</p></div></div>
      </section>

      <section className="neo mt-14 bg-acid p-6 text-ink sm:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em]">Your next challenge</p><h2 className="mt-2 font-display text-5xl leading-none tracking-wide sm:text-6xl">INVESTMENT & GOAL PLANNING</h2><p className="mt-4 max-w-2xl text-lg font-semibold">Your profile shows a balanced financial approach. Let's see how you handle a long-term financial decision.</p><p className="mt-6 font-mono text-xs uppercase tracking-widest">Why this scenario?</p><p className="mt-1 text-sm font-medium">Recommended based on your current financial behaviour.</p>
        <Link to="/play/$scenarioId" params={{ scenarioId: twin.recommendedScenarioId }} className="press neo mt-7 inline-block bg-ink px-7 py-4 font-display text-2xl tracking-wide text-acid">PLAY THIS CHALLENGE →</Link>
      </section>
      <Button variant="link" onClick={onRebuild} className="mt-8 text-paper/50">Rebuild my twin</Button>
    </Shell>
  );
}