import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Nav";
import { CONCEPTS, TRACKS } from "@/data/concepts";
import { SCENARIOS } from "@/data/scenarios";
import { levelFor, levelName, useProgress } from "@/lib/progress";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Your progress — PAISA.BOOM" },
      {
        name: "description",
        content:
          "See which money tracks you're strong in, which concepts you've unlocked and what to hit next.",
      },
      { property: "og:title", content: "Your progress — PAISA.BOOM" },
      {
        property: "og:description",
        content: "Track strength across spending, saving, investing, credit and reality.",
      },
    ],
  }),
  component: ProgressPage,
});

const BADGES = [
  { id: "first", label: "First Steps", emoji: "🐣", test: (c: number) => c >= 1 },
  { id: "three", label: "On A Roll", emoji: "🎳", test: (c: number) => c >= 3 },
  { id: "all", label: "Completionist", emoji: "👑", test: (c: number) => c >= SCENARIOS.length },
];

function ProgressPage() {
  const { progress } = useProgress();
  const { level } = levelFor(progress.xp);

  return (
    <Shell>
      <h1 className="font-display text-6xl tracking-wide text-paper sm:text-8xl">PROGRESS</h1>
      <p className="mt-3 font-medium text-paper/70">
        Level {level} · {levelName(level)} · {progress.xp} XP
      </p>

      <h2 className="mt-10 font-display text-4xl tracking-wide text-acid">TRACK STRENGTH</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {TRACKS.map((t) => {
          const total = CONCEPTS.filter((c) => c.track === t.id).length;
          const got = CONCEPTS.filter(
            (c) => c.track === t.id && progress.concepts.includes(c.id),
          ).length;
          const pct = total ? Math.round((got / total) * 100) : 0;
          return (
            <div key={t.id} className="neo bg-paper p-5 text-ink">
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl tracking-wide">
                  {t.emoji} {t.label}
                </span>
                <span className="font-mono text-xs">{pct}%</span>
              </div>
              <div className="mt-3 h-5 border-4 border-ink">
                <div className="h-full bg-hot" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mt-12 font-display text-4xl tracking-wide text-acid">BADGES</h2>
      <div className="mt-4 flex flex-wrap gap-4">
        {BADGES.map((b) => {
          const earned = b.test(progress.completed.length);
          return (
            <div
              key={b.id}
              className={`neo px-5 py-4 ${earned ? "bg-acid text-ink" : "bg-muted text-paper/40"}`}
            >
              <span className="text-3xl">{b.emoji}</span>
              <p className="font-display text-xl tracking-wide">{b.label}</p>
            </div>
          );
        })}
      </div>

      <h2 className="mt-12 font-display text-4xl tracking-wide text-acid">SCENARIO LOG</h2>
      <div className="mt-4 grid gap-3">
        {SCENARIOS.map((s) => {
          const done = progress.completed.includes(s.id);
          return (
            <Link
              key={s.id}
              to="/play/$scenarioId"
              params={{ scenarioId: s.id }}
              className={`flex items-center justify-between border-4 p-4 ${
                done ? "border-acid bg-acid/10 text-paper" : "border-paper/30 text-paper/60"
              }`}
            >
              <span className="font-display text-2xl tracking-wide">
                {s.emoji} {s.title}
              </span>
              <span className="font-mono text-xs uppercase tracking-widest">
                {done ? "Completed" : "Not played"}
              </span>
            </Link>
          );
        })}
      </div>
    </Shell>
  );
}
