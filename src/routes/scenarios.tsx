import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Nav";
import { SCENARIOS } from "@/data/scenarios";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/scenarios")({
  head: () => ({
    meta: [
      { title: "Scenarios — PAISA.BOOM" },
      {
        name: "description",
        content:
          "Play money scenarios: your first paycheck, a crypto tip, an EMI trap. Every choice has a consequence.",
      },
      { property: "og:title", content: "Scenarios — PAISA.BOOM" },
      {
        property: "og:description",
        content: "Real-life money situations you can practise before they cost you.",
      },
    ],
  }),
  component: ScenarioList,
});

export const COLOR: Record<string, string> = {
  hot: "bg-hot text-paper",
  neon: "bg-neon text-ink",
  electric: "bg-electric text-paper",
  acid: "bg-acid text-ink",
};

function ScenarioList() {
  const { progress } = useProgress();

  return (
    <Shell>
      <h1 className="font-display text-6xl tracking-wide text-paper sm:text-8xl">SCENARIOS</h1>
      <p className="mt-3 max-w-xl font-medium text-paper/70">
        Pick a situation. Make the call. Live with it. Each run takes a few minutes.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {SCENARIOS.map((s) => {
          const done = progress.completed.includes(s.id);
          return (
            <Link
              key={s.id}
              to="/play/$scenarioId"
              params={{ scenarioId: s.id }}
              className={`press neo block p-6 ${COLOR[s.color]}`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-5xl">{s.emoji}</span>
                <span className="border-2 border-current px-2 py-1 font-mono text-[10px] uppercase tracking-widest">
                  {done ? "Replay" : s.category}
                </span>
              </div>
              <h2 className="mt-4 font-display text-4xl leading-none tracking-wide">{s.title}</h2>
              <p className="mt-2 text-sm font-medium opacity-90">{s.blurb}</p>
              <p className="mt-5 font-mono text-xs uppercase tracking-widest">
                {s.minutes} min · {s.xp} XP · {s.situations.length} decisions
              </p>
            </Link>
          );
        })}
      </div>
    </Shell>
  );
}
