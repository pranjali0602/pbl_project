import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/Nav";
import { CONCEPTS, TRACKS } from "@/data/concepts";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/concepts")({
  head: () => ({
    meta: [
      { title: "Concept Library — PAISA.BOOM" },
      {
        name: "description",
        content:
          "Plain-language explainers for compounding, credit scores, EMIs, inflation and every concept behind the scenarios.",
      },
      { property: "og:title", content: "Concept Library — PAISA.BOOM" },
      {
        property: "og:description",
        content: "Money concepts explained like a friend would, not like a textbook.",
      },
    ],
  }),
  component: ConceptsPage,
});

function ConceptsPage() {
  const { progress } = useProgress();
  const [track, setTrack] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);

  const list = CONCEPTS.filter((c) => track === "all" || c.track === track);

  return (
    <Shell>
      <h1 className="font-display text-6xl tracking-wide text-paper sm:text-8xl">CONCEPTS</h1>
      <p className="mt-3 max-w-xl font-medium text-paper/70">
        Every idea behind the scenarios, explained without the jargon.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {[{ id: "all", label: "Everything", emoji: "✨" }, ...TRACKS].map((t) => (
          <button
            key={t.id}
            onClick={() => setTrack(t.id)}
            className={`border-4 border-ink px-3 py-2 font-display text-lg tracking-wide ${
              track === t.id ? "bg-acid text-ink" : "bg-paper text-ink/70"
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {list.map((c) => {
          const unlocked = progress.concepts.includes(c.id);
          const isOpen = open === c.id;
          return (
            <div key={c.id} className="neo bg-paper p-5 text-ink">
              <div className="flex items-start justify-between gap-3">
                <span className="text-4xl">{c.emoji}</span>
                <span className="border-2 border-ink px-2 py-1 font-mono text-[10px] uppercase tracking-widest">
                  {unlocked ? "Unlocked" : c.difficulty}
                </span>
              </div>
              <h2 className="mt-3 font-display text-3xl leading-none tracking-wide">{c.name}</h2>
              <p className="mt-2 text-sm font-semibold">{c.oneLiner}</p>
              {isOpen && (
                <div className="mt-4 space-y-3 border-t-4 border-ink pt-4 text-sm">
                  <p>{c.explain}</p>
                  <p className="bg-acid p-3 font-semibold">Why it matters: {c.why}</p>
                  <div className="flex flex-wrap gap-2">
                    {c.relatedScenarios.map((id) => (
                      <Link
                        key={id}
                        to="/play/$scenarioId"
                        params={{ scenarioId: id }}
                        className="border-2 border-ink bg-neon px-2 py-1 font-mono text-[11px] uppercase tracking-wider"
                      >
                        Play {id.replace(/-/g, " ")}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => setOpen(isOpen ? null : c.id)}
                className="mt-4 font-mono text-xs uppercase tracking-widest underline"
              >
                {isOpen ? "Close" : "Read it"}
              </button>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}
