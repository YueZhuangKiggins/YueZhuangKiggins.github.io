import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, type Project } from "@/lib/api";
import { mockProjects } from "@/lib/mock";

export const Route = createFileRoute("/")({
  component: ProjectsPage,
  head: () => ({
    meta: [
      { title: "Projects · Evidentia" },
      { name: "description", content: "Your evidence-mapping projects." },
    ],
  }),
});

function StatusPill({ status }: { status: Project["status"] }) {
  const map: Record<Project["status"], string> = {
    draft: "bg-muted text-muted-foreground",
    processing: "bg-gap-synthesis/15 text-foreground",
    "review-ready": "bg-primary/15 text-primary",
    completed: "bg-gap-knowledge/15 text-foreground",
    failed: "bg-destructive/15 text-destructive",
  };
  return (
    <span className={`text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${map[status]}`}>
      {status}
    </span>
  );
}

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listProjects()
      .then((p) => setProjects(p))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <section className="grid md:grid-cols-[2fr_1fr] gap-8 mb-12 items-end">
        <div>
          <div className="label-eyebrow mb-3">A research workspace</div>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] mb-4">
            From a question
            <br />
            to an evidence map.
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Frame a clinical question in PICO, ingest the studies, and inspect where the
            evidence is rich, conflicting, or absent — with ranked research opportunities
            for what to investigate next.
          </p>
        </div>
        <div className="flex md:justify-end">
          <Link
            to="/new"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-md text-sm font-medium hover:opacity-90 transition"
          >
            Start a new project
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <div className="flex items-center justify-between mb-4">
        <div className="label-eyebrow">Your projects</div>
        <div className="text-xs text-muted-foreground font-mono">Demo workspace</div>
      </div>

      <div className="border-t border-rule">
        {loading && (
          <div className="py-12 text-sm text-muted-foreground">Loading…</div>
        )}
        {!loading && projects.length === 0 && (
          <div className="py-12 text-sm text-muted-foreground">No projects yet.</div>
        )}
        <ul>
          {projects.map((p) => (
            <li key={p.project_id} className="border-b border-rule">
              <Link
                to="/projects/$projectId"
                params={{ projectId: p.project_id }}
                className="grid md:grid-cols-[1fr_auto_auto] gap-6 py-6 items-center group"
              >
                <div>
                  <h3 className="font-display text-2xl mb-1 group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                    {p.question_text}
                  </p>
                </div>
                <StatusPill status={p.status} />
                <div className="text-xs font-mono text-muted-foreground">
                  Updated {p.updated_at.slice(0, 10)}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
