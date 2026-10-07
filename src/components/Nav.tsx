import { Link } from "@tanstack/react-router";

const links = [
  { to: "/financial-twin", label: "Twin" },
  { to: "/scenarios", label: "Scenarios" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/concepts", label: "Concepts" },
  { to: "/progress", label: "Progress" },
] as const;

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-ink bg-acid">
      <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center border-4 border-ink bg-hot text-paper">
            ₹
          </span>
          <span className="font-display text-2xl tracking-wide text-ink">PAISA.BOOM</span>
        </Link>
        <nav className="flex w-full items-center justify-between gap-1 overflow-x-auto sm:w-auto sm:justify-start sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="shrink-0 border-2 border-transparent px-1.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink sm:px-2 sm:text-sm"
              activeProps={{ className: "border-ink bg-ink text-acid" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      <footer className="border-t-4 border-ink bg-ink px-4 py-8 text-center text-xs uppercase tracking-[0.3em] text-paper/60">
        PAISA.BOOM — learn money by living it
      </footer>
    </div>
  );
}
