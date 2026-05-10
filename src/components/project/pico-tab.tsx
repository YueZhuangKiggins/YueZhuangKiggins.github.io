import { useEffect, useState } from "react";
import { api, type PICO } from "@/lib/api";

const empty: PICO = { population: "", intervention: "", comparator: "", outcome: "", keywords: [] };

export function PicoTab({ projectId }: { projectId: string }) {
  const [pico, setPico] = useState<PICO>(empty);
  const [keywordsInput, setKeywordsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    api.getPico(projectId).then((p) => {
      setPico(p);
      setKeywordsInput((p.keywords ?? []).join(", "));
    });
  }, [projectId]);

  async function save() {
    setSaving(true);
    const body: PICO = {
      ...pico,
      keywords: keywordsInput.split(",").map((s) => s.trim()).filter(Boolean),
    };
    await api.savePico(projectId, body);
    setSaving(false);
    setSavedAt(new Date().toLocaleTimeString());
  }

  const structured = `In ${pico.population || "[population]"}, what are the effects of ${pico.intervention || "[intervention]"}${pico.comparator ? ` compared to ${pico.comparator}` : ""}${pico.outcome ? ` on ${pico.outcome}` : ""}?`;

  const fields: Array<{ key: keyof PICO; label: string; required?: boolean; placeholder: string }> = [
    { key: "population", label: "Population", required: true, placeholder: "e.g. Adults 70+ with HFpEF" },
    { key: "intervention", label: "Intervention", required: true, placeholder: "e.g. SGLT2 inhibitors" },
    { key: "comparator", label: "Comparator (optional)", placeholder: "e.g. Standard diuretic" },
    { key: "outcome", label: "Outcome (optional)", placeholder: "e.g. Hospitalisation, QoL" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-[1.2fr_1fr] gap-10">
      <div>
        <div className="label-eyebrow mb-3">Structured framing</div>
        <h2 className="font-display text-3xl mb-6">Define the PICO</h2>
        <div className="space-y-5">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="label-eyebrow block mb-1.5">
                {f.label} {f.required && <span className="text-accent">*</span>}
              </label>
              <input
                value={(pico[f.key] as string) ?? ""}
                onChange={(e) => setPico({ ...pico, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full bg-card border border-input rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
          <div>
            <label className="label-eyebrow block mb-1.5">Candidate keywords (comma separated)</label>
            <textarea
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              rows={3}
              className="w-full bg-card border border-input rounded-md px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="text-xs text-muted-foreground mt-1.5">
              Generated suggestions appear here. Edit before retrieval.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={save}
            disabled={saving}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save PICO"}
          </button>
          {savedAt && <span className="text-xs text-muted-foreground">Saved at {savedAt}</span>}
        </div>
      </div>

      <aside>
        <div className="sticky top-24 bg-card border border-rule rounded-lg p-6">
          <div className="label-eyebrow mb-2">Structured statement</div>
          <p className="font-display text-xl leading-relaxed mb-6">{structured}</p>
          <div className="label-eyebrow mb-2">Keywords</div>
          <div className="flex flex-wrap gap-1.5">
            {keywordsInput
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .map((k) => (
                <span
                  key={k}
                  className="text-xs font-mono bg-muted px-2 py-1 rounded border border-rule"
                >
                  {k}
                </span>
              ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
