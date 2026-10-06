import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/Nav";
import { SCENARIOS, type Choice, type Trait } from "@/data/scenarios";
import { conceptById } from "@/data/concepts";
import { applyRun, useProgress } from "@/lib/progress";

export const Route = createFileRoute("/play/$scenarioId")({
  head: () => ({
    meta: [
      { title: "Play a scenario — PAISA.BOOM" },
      {
        name: "description",
        content: "Make the call and watch what it does to your money, short term and long term.",
      },
      { property: "og:title", content: "Play a scenario — PAISA.BOOM" },
      {
        property: "og:description",
        content: "Decision, consequence, concept. The money loop you can practise safely.",
      },
    ],
  }),
  component: Play,
});

const VERDICT: Record<string, { bg: string; label: string }> = {
  great: { bg: "bg-acid text-ink", label: "SOLID CALL" },
  okay: { bg: "bg-neon text-ink", label: "MIXED BAG" },
  rough: { bg: "bg-hot text-paper", label: "THAT'LL COST YOU" },
};

const inr = (n: number) =>
  `${n < 0 ? "-" : "+"}₹${Math.abs(n).toLocaleString("en-IN")}`;

function Play() {
  const { scenarioId } = Route.useParams();
  const foundScenario = SCENARIOS.find((s) => s.id === scenarioId);
  if (!foundScenario) throw notFound();
  const scenario = foundScenario;

  const { update } = useProgress();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Choice | null>(null);
  const [balance, setBalance] = useState(scenario.startingBalance);
  const [savings, setSavings] = useState(0);
  const [risk, setRisk] = useState(20);
  const [traits, setTraits] = useState<Trait[]>([]);
  const [done, setDone] = useState(false);

  const situation = scenario.situations[step] ?? scenario.situations[0];
  if (!situation) throw notFound();
  const concept = conceptById(situation.conceptId);

  function choose(c: Choice) {
    setPicked(c);
    setBalance((b) => b + c.balance);
    setSavings((s) => s + c.savings);
    setRisk(c.risk);
    setTraits((t) => [...t, ...c.traits]);
  }

  function next() {
    if (step + 1 < scenario.situations.length) {
      setStep(step + 1);
      setPicked(null);
      return;
    }
    update((p) =>
      applyRun(p, {
        scenarioId: scenario.id,
        conceptIds: scenario.situations.map((s) => s.conceptId),
        xp: scenario.xp,
        traits,
        balance: balance - scenario.startingBalance,
        savings,
      }),
    );
    setDone(true);
  }

  if (done) {
    return (
      <Shell>
        <div className="neo bg-acid p-8 text-ink">
          <p className="font-mono text-xs uppercase tracking-[0.3em]">Scenario complete</p>
          <h1 className="mt-2 font-display text-6xl leading-none tracking-wide">
            +{scenario.xp} XP
          </h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Stat label="Wallet" value={`₹${balance.toLocaleString("en-IN")}`} />
            <Stat label="Saved / invested" value={`₹${savings.toLocaleString("en-IN")}`} />
            <Stat label="Risk level" value={`${risk}/100`} />
          </div>
          <p className="mt-6 max-w-xl font-medium">
            No score-shaming here. You just saw how these calls play out — that's the whole point.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/dashboard"
              className="press neo bg-ink px-6 py-3 font-display text-2xl tracking-wide text-acid"
            >
              MY DASHBOARD
            </Link>
            <Link
              to="/scenarios"
              className="press neo bg-paper px-6 py-3 font-display text-2xl tracking-wide text-ink"
            >
              NEXT SCENARIO
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-acid">
            {scenario.category}
          </p>
          <h1 className="font-display text-4xl tracking-wide text-paper sm:text-6xl">
            {scenario.emoji} {scenario.title}
          </h1>
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-paper/60">
          Step {step + 1} / {scenario.situations.length}
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat label="Wallet" value={`₹${balance.toLocaleString("en-IN")}`} dark />
        <Stat label="Saved" value={`₹${savings.toLocaleString("en-IN")}`} dark />
        <Stat label="Risk" value={`${risk}/100`} dark />
      </div>

      <div className="neo mt-8 bg-paper p-6 text-ink">
        <h2 className="font-display text-3xl leading-none tracking-wide sm:text-4xl">
          {situation.headline}
        </h2>
        <p className="mt-3 font-medium">{situation.prompt}</p>

        {!picked ? (
          <div className="mt-6 grid gap-4">
            {situation.choices.map((c) => (
              <button
                key={c.key}
                onClick={() => choose(c)}
                className="press border-4 border-ink bg-neon p-4 text-left"
                style={{ boxShadow: "6px 6px 0 0 var(--color-ink)" }}
              >
                <span className="font-display text-2xl tracking-wide">
                  {c.key}. {c.label}
                </span>
                <p className="text-sm font-medium text-ink/80">{c.sub}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className={`neo p-5 ${VERDICT[picked.verdict]?.bg ?? VERDICT.okay?.bg}`}>
              <p className="font-mono text-xs uppercase tracking-[0.3em]">
                {VERDICT[picked.verdict]?.label ?? "MIXED BAG"}
              </p>
              <p className="mt-2 font-display text-3xl leading-none tracking-wide">
                {picked.reaction}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <p className="border-4 border-current p-3 text-sm font-semibold">
                  Right now: {picked.shortTerm} ({inr(picked.balance)} wallet
                  {picked.savings ? `, ${inr(picked.savings)} saved` : ""})
                </p>
                <p className="border-4 border-current p-3 text-sm font-semibold">
                  Down the line: {picked.longTerm}
                </p>
              </div>
            </div>

            {concept && (
              <div className="neo bg-electric p-5 text-paper">
                <p className="font-mono text-xs uppercase tracking-[0.3em]">Concept unlocked</p>
                <h3 className="mt-1 font-display text-3xl tracking-wide">
                  {concept.emoji} {concept.name}
                </h3>
                <p className="mt-2 text-sm font-medium">{concept.explain}</p>
                <p className="mt-3 bg-paper p-3 text-sm font-semibold text-ink">
                  💡 {situation.tip}
                </p>
              </div>
            )}

            <button
              onClick={next}
              className="press neo w-full bg-ink px-6 py-4 font-display text-3xl tracking-wide text-acid"
            >
              {step + 1 < scenario.situations.length ? "NEXT SITUATION →" : "FINISH RUN →"}
            </button>
          </div>
        )}
      </div>
    </Shell>
  );
}

function Stat({ label, value, dark }: { label: string; value: string; dark?: boolean }) {
  return (
    <div
      className={`border-4 p-3 ${dark ? "border-paper text-paper" : "border-ink bg-paper text-ink"}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-70">{label}</p>
      <p className="font-display text-2xl tracking-wide">{value}</p>
    </div>
  );
}
