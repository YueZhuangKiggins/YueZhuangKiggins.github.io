import { useEffect, useState } from "react";
import { api, type Gap, type GapType } from "@/lib/api";
import { mockGaps } from "@/lib/mock";

const meta: Record<GapType, { label: string; color: string; desc: string }> = {
  innovation: {
    label: "Innovation gap",
    color: "var(--color-gap-innovation)",
    desc: "No evidence identified for this intervention–outcome cell.",
  },
  synthesis: {
    label: "Synthesis gap",
    color: "var(--color-gap-synthesis)",
    desc: "Multiple studies disagree on direction or magnitude.",
  },
  knowledge: {
    label: "Knowledge gap",
    color: "var(--color-gap-knowledge)",
    desc: "Evidence is one-sided or narrowly framed.",
  },
};

export function GapsTab({ projectId }: { projectId: string }) {
  const [gaps, setGaps] = useState<Gap[]>(mockGaps);
  const [filter, setFilter] = useState<GapType | "all">("all");

  useEffect(() => {
    api.getGaps(projectId).then(setGaps);
  }, [projectId]);

  const visible = gaps.filter((g) => filter === "all" || g.type === filter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <div className="label-eyebrow mb-1">Decision support</div>
          <h2 className="font-display text-3xl">Identified gaps</h2>
        </div>
        <div className="flex gap-1">
          {(["all", "innovation", "synthesis", "knowledge"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition ${
                filter === t
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {visible.map((g) => {
          const m = meta[g.type];
          return (
            <article
              key={g.id}
              className="bg-card border border-rule rounded-lg p-6 grid md:grid-cols-[200px_1fr] gap-6"
            >
              <div>
                <span
                  className="inline-block text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded mb-3"
                  style={{
                    backgroundColor: `color-mix(in oklab, ${m.color} 18%, transparent)`,
                    color: m.color,
                  }}
                >
                  {m.label}
                </span>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
              <div>
                <h3 className="font-display text-xl mb-2">
                  {g.intervention_label} × {g.outcome_label}
                </h3>
                <p className="text-sm text-foreground/80 mb-4">{g.rationale}</p>
                {g.next_question && (
                  <div className="border-l-2 pl-4 py-1" style={{ borderColor: m.color }}>
                    <div className="label-eyebrow mb-1">Possible next question</div>
                    <p className="font-display text-base">{g.next_question}</p>
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-4 font-mono">
                  Linked studies: {g.linked_study_ids.length || "0 (innovation cell)"}
                </div>
              </div>
            </article>
          );
        })}
        {visible.length === 0 && (
          <div className="text-sm text-muted-foreground py-12 text-center">
            No gaps in this category.
          </div>
        )}
      </div>
    </div>
  );
}
