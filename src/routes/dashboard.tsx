import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Nav";
import { SCENARIOS } from "@/data/scenarios";
import { levelFor, levelName, topTrait, useProgress } from "@/lib/progress";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your money dashboard — PAISA.BOOM" },
      {
        name: "description",
        content:
          "Your level, streak, unlocked concepts and the next scenario picked for how you actually decide.",
      },
      { property: "og:title", content: "Your money dashboard — PAISA.BOOM" },
      {
        property: "og:description",
        content: "Track your money instincts as they change, run by run.",
      },
    ],
  }),
  component: Dashboard,
});

const TRAIT_COPY: Record<string, string> = {
  spender: "You enjoy the now. We'll work on making future-you a co-signer.",
  saver: "You protect your buffer. Next up: making that money grow.",
  investor: "You think long term. Let's stress-test your risk appetite.",
  cautious: "You avoid blow-ups. Careful that caution isn't costing you growth.",
  risky: "You go big. Let's talk position sizing before it goes bad.",
  planner: "You plan before you spend. Rare. Keep it.",
};

function Dashboard() {
  const { progress, ready, reset } = useProgress();
  const { level, into, pct } = levelFor(progress.xp);
  const trait = topTrait(progress.traits);
  const nextScenario =
    SCENARIOS.find((s) => !progress.completed.includes(s.id)) ?? SCENARIOS[0];

  return (
    <Shell>
      <h1 className="font-display text-6xl tracking-wide text-paper sm:text-8xl">DASHBOARD</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="neo bg-hot p-6 text-paper lg:col-span-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em]">Level {level}</p>
          <h2 className="font-display text-5xl leading-none tracking-wide">
            {levelName(level).toUpperCase()}
          </h2>
          <div className="mt-5 h-6 w-full border-4 border-paper">
            <div className="h-full bg-acid" style={{ width: `${ready ? pct : 0}%` }} />
          </div>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest">
            {into} / 500 XP to level {level + 1} · {progress.xp} XP total
          </p>
        </div>

        <div className="neo bg-acid p-6 text-ink">
          <p className="font-mono text-xs uppercase tracking-[0.3em]">Streak</p>
          <p className="font-display text-7xl leading-none">🔥{progress.streak}</p>
          <p className="mt-2 text-sm font-semibold">
            {progress.streak ? "Keep it alive — one scenario a day." : "Play one to start it."}
          </p>
        </div>

        <Card label="Scenarios played" value={`${progress.completed.length}/${SCENARIOS.length}`} />
        <Card label="Concepts unlocked" value={`${progress.concepts.length}`} />
        <Card
          label="Simulated savings"
          value={`₹${progress.savings.toLocaleString("en-IN")}`}
        />
      </div>

      <div className="neo mt-6 bg-electric p-6 text-paper">
        <p className="font-mono text-xs uppercase tracking-[0.3em]">Your money personality</p>
        <h2 className="mt-1 font-display text-4xl tracking-wide">
          {trait ? `THE ${trait.toUpperCase()}` : "UNDECIDED"}
        </h2>
        <p className="mt-2 max-w-xl font-medium">
          {trait
            ? TRAIT_COPY[trait]
            : "Play a scenario or two and we'll read your decision style — no judgement, just patterns."}
        </p>
      </div>

      <div className="neo mt-6 bg-neon p-6 text-ink">
        <p className="font-mono text-xs uppercase tracking-[0.3em]">Recommended next</p>
        <h2 className="mt-1 font-display text-4xl leading-none tracking-wide">
          {nextScenario.emoji} {nextScenario.title}
        </h2>
        <p className="mt-2 max-w-xl font-medium">{nextScenario.blurb}</p>
        <Link
          to="/play/$scenarioId"
          params={{ scenarioId: nextScenario.id }}
          className="press neo mt-5 inline-block bg-ink px-6 py-3 font-display text-2xl tracking-wide text-acid"
        >
          PLAY IT
        </Link>
      </div>

      <button
        onClick={reset}
        className="mt-8 font-mono text-xs uppercase tracking-widest text-paper/50 underline"
      >
        Reset my progress
      </button>
    </Shell>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="neo bg-paper p-6 text-ink">
      <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-60">{label}</p>
      <p className="font-display text-5xl leading-none tracking-wide">{value}</p>
    </div>
  );
}
