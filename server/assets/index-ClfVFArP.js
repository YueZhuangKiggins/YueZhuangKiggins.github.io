import { r as reactExports, V as jsxRuntimeExports } from "./server-CsSHuzdL.js";
import { L as Link } from "./router-ClubPYl5.js";
import { m as mockProjects, a as api } from "./api-BBfGI-_Z.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function StatusPill({
  status
}) {
  const map = {
    draft: "bg-muted text-muted-foreground",
    processing: "bg-gap-synthesis/15 text-foreground",
    "review-ready": "bg-primary/15 text-primary",
    completed: "bg-gap-knowledge/15 text-foreground",
    failed: "bg-destructive/15 text-destructive"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${map[status]}`, children: status });
}
function ProjectsPage() {
  const [projects, setProjects] = reactExports.useState(mockProjects);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    api.listProjects().then((p) => setProjects(p)).finally(() => setLoading(false));
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid md:grid-cols-[2fr_1fr] gap-8 mb-12 items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-eyebrow mb-3", children: "A research workspace" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl md:text-6xl leading-[1.05] mb-4", children: [
          "From a question",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "to an evidence map."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-xl", children: "Frame a clinical question in PICO, ingest the studies, and inspect where the evidence is rich, conflicting, or absent — with ranked research opportunities for what to investigate next." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex md:justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/new", className: "inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-md text-sm font-medium hover:opacity-90 transition", children: [
        "Start a new project",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, children: "→" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-eyebrow", children: "Your projects" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-mono", children: "Demo workspace" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-rule", children: [
      loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-sm text-muted-foreground", children: "Loading…" }),
      !loading && projects.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-sm text-muted-foreground", children: "No projects yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: projects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "border-b border-rule", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/projects/$projectId", params: {
        projectId: p.project_id
      }, className: "grid md:grid-cols-[1fr_auto_auto] gap-6 py-6 items-center group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl mb-1 group-hover:text-primary transition-colors", children: p.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2 max-w-2xl", children: p.question_text })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: p.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono text-muted-foreground", children: [
          "Updated ",
          p.updated_at.slice(0, 10)
        ] })
      ] }) }, p.project_id)) })
    ] })
  ] });
}
export {
  ProjectsPage as component
};
