import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, type Project } from "@/lib/api";
import { mockProjects } from "@/lib/mock";

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectLayout,
});

const tabs = [
  { slug: "pico", label: "PICO" },
  { slug: "ingest", label: "Ingest" },
  { slug: "map", label: "Evidence map" },
  { slug: "gaps", label: "Gaps" },
  { slug: "report", label: "Report" },
];

function ProjectLayout() {
  const { projectId } = Route.useParams();
  const location = useLocation();
  const [project, setProject] = useState<Project | null>(
    mockProjects.find((p) => p.project_id === projectId) ?? null,
  );

  useEffect(() => {
    api.getProject(projectId).then(setProject).catch(() => {});
  }, [projectId]);

  const activeSlug = location.pathname.split("/").pop();

  return (
    <div>
      <div className="border-b border-rule bg-card/50">
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
          <Link to="/" className="label-eyebrow hover:text-foreground transition">
            ← All projects
          </Link>
          <h1 className="font-display text-3xl md:text-4xl mt-3 max-w-4xl">
            {project?.title ?? "Loading project…"}
          </h1>
          {project?.question_text && (
            <p className="text-muted-foreground mt-2 max-w-3xl">{project.question_text}</p>
          )}
          <nav className="flex gap-1 mt-6 -mb-[1px]">
            {tabs.map((t) => {
              const active = activeSlug === t.slug ||
                (t.slug === "pico" && (activeSlug === projectId || !tabs.some(x => x.slug === activeSlug)));
              return (
                <Link
                  key={t.slug}
                  to="/projects/$projectId/$tab"
                  params={{ projectId, tab: t.slug }}
                  className={`px-4 py-2.5 text-sm border-b-2 transition-colors ${
                    active
                      ? "border-primary text-foreground font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
