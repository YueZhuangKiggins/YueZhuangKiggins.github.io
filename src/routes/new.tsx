import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/new")({
  component: NewProjectPage,
  head: () => ({
    meta: [{ title: "New project · Evidentia" }],
  }),
});

function NewProjectPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const p = await api.createProject({ title, question_text: question });
      navigate({ to: "/projects/$projectId", params: { projectId: p.project_id } });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="label-eyebrow mb-3">Step 1 of 4</div>
      <h1 className="font-display text-4xl mb-2">Start a new project</h1>
      <p className="text-muted-foreground mb-10">
        Begin with a working title and the natural-language research question. We'll
        translate it into a structured PICO frame next.
      </p>

      <form onSubmit={submit} className="space-y-8">
        <div>
          <label className="label-eyebrow block mb-2" htmlFor="title">
            Project title
          </label>
          <input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. SGLT2 inhibitors in elderly heart failure patients"
            className="w-full bg-card border border-input rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="label-eyebrow block mb-2" htmlFor="q">
            Research question
          </label>
          <textarea
            id="q"
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={5}
            placeholder="In adults over 70 with HFpEF, how do SGLT2 inhibitors compare to standard diuretic therapy on hospitalisation and quality of life?"
            className="w-full bg-card border border-input rounded-md px-4 py-3 text-base font-display leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {error && (
          <div className="text-sm text-destructive border border-destructive/30 bg-destructive/5 rounded-md px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-rule">
          <p className="text-xs text-muted-foreground max-w-md">
            Your question stays private to your workspace. Nothing is sent to external
            literature sources until you confirm keywords.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-md text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Continue to PICO →"}
          </button>
        </div>
      </form>
    </div>
  );
}
