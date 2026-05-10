import { r as reactExports, V as jsxRuntimeExports } from "./server-CsSHuzdL.js";
import { u as useNavigate } from "./router-ClubPYl5.js";
import { a as api } from "./api-BBfGI-_Z.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function NewProjectPage() {
  const navigate = useNavigate();
  const [title, setTitle] = reactExports.useState("");
  const [question, setQuestion] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const p = await api.createProject({
        title,
        question_text: question
      });
      navigate({
        to: "/projects/$projectId",
        params: {
          projectId: p.project_id
        }
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-6 py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-eyebrow mb-3", children: "Step 1 of 4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl mb-2", children: "Start a new project" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-10", children: "Begin with a working title and the natural-language research question. We'll translate it into a structured PICO frame next." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-eyebrow block mb-2", htmlFor: "title", children: "Project title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "title", required: true, value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. SGLT2 inhibitors in elderly heart failure patients", className: "w-full bg-card border border-input rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-eyebrow block mb-2", htmlFor: "q", children: "Research question" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { id: "q", required: true, value: question, onChange: (e) => setQuestion(e.target.value), rows: 5, placeholder: "In adults over 70 with HFpEF, how do SGLT2 inhibitors compare to standard diuretic therapy on hospitalisation and quality of life?", className: "w-full bg-card border border-input rounded-md px-4 py-3 text-base font-display leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring" })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-destructive border border-destructive/30 bg-destructive/5 rounded-md px-4 py-3", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-rule", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-md", children: "Your question stays private to your workspace. Nothing is sent to external literature sources until you confirm keywords." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: submitting, className: "bg-primary text-primary-foreground px-6 py-3 rounded-md text-sm font-medium hover:opacity-90 transition disabled:opacity-50", children: submitting ? "Creating…" : "Continue to PICO →" })
      ] })
    ] })
  ] });
}
export {
  NewProjectPage as component
};
