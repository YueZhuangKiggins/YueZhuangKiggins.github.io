import { Link, Outlet, useLocation } from "@tanstack/react-router";

const nav = [
  { to: "/", label: "Projects" },
  { to: "/new", label: "New project" },
];

export function AppShell() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-rule bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground grid place-items-center font-display font-semibold">
              E
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg">Evidentia</div>
              <div className="label-eyebrow">Evidence Gap Mapping</div>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            {nav.map((n) => {
              const active = location.pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-rule mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <span className="label-eyebrow">Evidentia · v0.1</span>
          <span>For research support. Not for direct clinical decision-making.</span>
        </div>
      </footer>
    </div>
  );
}
