import { createFileRoute, Link } from "@tanstack/react-router";
import { SCENARIOS, CATEGORY_META } from "@/data/scenarios";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PAISA.BOOM — Learn money by living it" },
      {
        name: "description",
        content:
          "Interactive money scenarios for Gen-Z. Make the call, see the consequence, learn the concept. No lectures, no jargon.",
      },
      { property: "og:title", content: "PAISA.BOOM — Learn money by living it" },
      {
        property: "og:description",
        content: "Play real-life money scenarios and find out what your choices actually cost.",
      },
    ],
  }),
  component: Landing,
});

const BAR = "SPEND · SAVE · INVEST · SURVIVE · REPEAT · ";

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-4 border-ink bg-acid">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="font-display text-2xl tracking-wide text-ink">PAISA.BOOM</span>
          <Link
            to="/financial-twin"
            className="press neo bg-hot px-4 py-2 font-display text-lg tracking-wide text-paper"
          >
            CREATE MY TWIN
          </Link>
        </div>
      </header>

      <section className="grid-noise border-b-4 border-ink bg-neon px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 inline-block border-2 border-ink bg-ink px-3 py-1 font-mono text-xs uppercase tracking-[0.25em] text-acid">
            Financial literacy, but make it playable
          </p>
          <h1 className="font-display text-[clamp(3rem,12vw,9rem)] leading-[0.85] tracking-tight text-ink">
            LEARN MONEY
            <br />
            BY <span className="bg-hot px-2 text-paper">LIVING</span> IT.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-medium text-ink">
            Build your financial twin and get a learning journey designed around you.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/financial-twin"
              className="press neo-lg bg-ink px-8 py-4 font-display text-2xl tracking-wide text-acid"
            >
              CREATE MY FINANCIAL TWIN →
            </Link>
            <Link
              to="/scenarios"
              className="press neo bg-paper px-6 py-4 font-display text-2xl tracking-wide text-ink"
            >
              EXPLORE SCENARIOS
            </Link>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-b-4 border-ink bg-ink py-3">
        <div className="flex w-max animate-[marquee_18s_linear_infinite] font-display text-2xl tracking-widest text-acid">
          <span className="px-4">{BAR.repeat(6)}</span>
          <span className="px-4">{BAR.repeat(6)}</span>
        </div>
      </div>

      <section className="border-b-4 border-ink bg-electric px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-5xl tracking-wide text-paper sm:text-7xl">THE LOOP</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "SITUATION", "You're dropped into a money moment with real numbers."],
              ["02", "DECISION", "Four options. None of them are obviously 'the right answer'."],
              ["03", "CONSEQUENCE", "Watch your balance, savings and risk move. Short and long term."],
              ["04", "CONCEPT", "The idea behind what just happened, in plain language."],
            ].map(([n, t, d]) => (
              <div key={n} className="neo bg-paper p-5">
                <span className="font-mono text-xs text-ink/60">{n}</span>
                <h3 className="font-display text-3xl tracking-wide text-ink">{t}</h3>
                <p className="mt-2 text-sm font-medium text-ink/80">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-ink bg-paper px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-5xl tracking-wide text-ink sm:text-7xl">
            PICK YOUR CHAOS
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(CATEGORY_META).map(([name, meta]) => (
              <div key={name} className="neo bg-acid p-5">
                <span className="text-3xl">{meta.emoji}</span>
                <h3 className="mt-2 font-display text-2xl tracking-wide text-ink">{name}</h3>
                <p className="mt-1 text-sm font-medium text-ink/80">{meta.blurb}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 font-mono text-sm uppercase tracking-widest text-ink/60">
            {SCENARIOS.length} scenarios live · more dropping
          </p>
        </div>
      </section>

      <section className="bg-hot px-4 py-20 text-center">
        <h2 className="font-display text-[clamp(2.5rem,9vw,6rem)] leading-none tracking-tight text-paper">
          YOUR FIRST BAD
          <br />
          MONEY CALL SHOULD
          <br />
          BE A FAKE ONE.
        </h2>
        <Link
          to="/scenarios"
          className="press neo mt-10 inline-block bg-ink px-10 py-5 font-display text-3xl tracking-wide text-acid"
        >
          LET'S GO
        </Link>
      </section>

      <footer className="border-t-4 border-ink bg-ink px-4 py-8 text-center text-xs uppercase tracking-[0.3em] text-paper/60">
        PAISA.BOOM — learn money by living it
      </footer>
    </div>
  );
}
