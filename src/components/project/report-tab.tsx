import { useEffect, useState } from "react";
import { api, type InsightReport } from "@/lib/api";
import { mockReport } from "@/lib/mock";

export function ReportTab({ projectId }: { projectId: string }) {
  const [report, setReport] = useState<InsightReport>(mockReport);

  useEffect(() => {
    api.getReport(projectId).then(setReport);
  }, [projectId]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="label-eyebrow mb-2">Insight report</div>
      <h2 className="font-display text-4xl mb-6">Landscape & opportunities</h2>

      <section className="mb-12">
        <h3 className="label-eyebrow mb-3">Summary</h3>
        <p className="font-display text-2xl leading-snug text-foreground/90">
          {report.summary}
        </p>
      </section>

      <section className="mb-12">
        <h3 className="label-eyebrow mb-3">Key clusters</h3>
        <ul className="space-y-2">
          {report.key_clusters.map((c, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="font-mono text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="label-eyebrow mb-4">Ranked research opportunities</h3>
        <div className="space-y-3">
          {report.opportunities.map((op, i) => (
            <article key={op.id} className="bg-card border border-rule rounded-lg p-6">
              <div className="grid md:grid-cols-[40px_1fr_auto] gap-4 items-start">
                <div className="font-display text-3xl text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h4 className="font-display text-xl mb-2">{op.title}</h4>
                  <p className="text-sm text-foreground/75 mb-3">{op.rationale}</p>
                  <div className="flex gap-6 text-xs">
                    <Score label="Clinical relevance" value={op.clinical_relevance} />
                    <Score label="Feasibility" value={op.feasibility} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="label-eyebrow">Priority</div>
                  <div className="font-display text-3xl text-primary">
                    {op.total_score.toFixed(2)}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="text-xs text-muted-foreground mt-10 border-t border-rule pt-4">
        Priority = weighted combination of relevance and feasibility. Weights are
        configurable. Each opportunity links back to a specific gap and its source studies.
      </p>
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex-1 max-w-[180px]">
      <div className="flex items-baseline justify-between mb-1">
        <span className="label-eyebrow">{label}</span>
        <span className="font-mono">{value.toFixed(2)}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary"
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
    </div>
  );
}
