import { r as reactExports, V as jsxRuntimeExports, a0 as Outlet } from "./server-CsSHuzdL.js";
import { R as Route, a as useLocation, L as Link } from "./router-ClubPYl5.js";
import { m as mockProjects, a as api } from "./api-BBfGI-_Z.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const tabs = [{
  slug: "pico",
  label: "PICO"
}, {
  slug: "ingest",
  label: "Ingest"
}, {
  slug: "map",
  label: "Evidence map"
}, {
  slug: "gaps",
  label: "Gaps"
}, {
  slug: "report",
  label: "Report"
}];
function ProjectLayout() {
  const {
    projectId
  } = Route.useParams();
  const location = useLocation();
  const [project, setProject] = reactExports.useState(mockProjects.find((p) => p.project_id === projectId) ?? null);
  reactExports.useEffect(() => {
    api.getProject(projectId).then(setProject).catch(() => {
    });
  }, [projectId]);
  const activeSlug = location.pathname.split("/").pop();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-rule bg-card/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 pt-8 pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "label-eyebrow hover:text-foreground transition", children: "← All projects" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl mt-3 max-w-4xl", children: project?.title ?? "Loading project…" }),
      project?.question_text && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 max-w-3xl", children: project.question_text }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex gap-1 mt-6 -mb-[1px]", children: tabs.map((t) => {
        const active = activeSlug === t.slug || t.slug === "pico" && (activeSlug === projectId || !tabs.some((x) => x.slug === activeSlug));
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/projects/$projectId/$tab", params: {
          projectId,
          tab: t.slug
        }, className: `px-4 py-2.5 text-sm border-b-2 transition-colors ${active ? "border-primary text-foreground font-medium" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: t.label }, t.slug);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
  ] });
}
export {
  ProjectLayout as component
};
