import { useEffect, useMemo, useState } from "react";
import { api, type EvidenceMap, type EvidenceMapCell } from "@/lib/api";
import { mockEvidenceMap } from "@/lib/mock";

const directionColor: Record<string, string> = {
  favours_intervention: "var(--color-dir-intervention)",
  favours_comparator: "var(--color-dir-comparator)",
  mixed: "var(--color-dir-mixed)",
  unclear: "var(--color-dir-unclear)",
};

const gapBorder: Record<string, string> = {
  innovation: "var(--color-gap-innovation)",
  synthesis: "var(--color-gap-synthesis)",
  knowledge: "var(--color-gap-knowledge)",
};

export function MapTab({ projectId }: { projectId: string }) {
  const [data, setData] = useState<EvidenceMap>(mockEvidenceMap);
  const [selected, setSelected] = useState<EvidenceMapCell | null>(null);

  useEffect(() => {
    api.getEvidenceMap(projectId).then(setData);
  }, [projectId]);

  const maxCount = useMemo(
    () => Math.max(1, ...data.cells.map((c) => c.study_count)),
    [data],
  );

  function cellFor(intervention: string, outcome: string) {
    return data.cells.find(
      (c) => c.intervention_label === intervention && c.outcome_label === outcome,
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <div className="label-eyebrow mb-1">Visualisation</div>
          <h2 className="font-display text-3xl">Intervention × Outcome map</h2>
        </div>
        <Legend />
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        <div className="bg-card border border-rule rounded-lg p-6 overflow-auto">
          <div
            className="grid gap-px bg-rule"
            style={{
              gridTemplateColumns: `200px repeat(${data.outcomes.length}, minmax(110px, 1fr))`,
            }}
          >
            <div className="bg-card" />
            {data.outcomes.map((o) => (
              <div
                key={o}
                className="bg-card p-2 text-xs font-mono uppercase tracking-wider text-muted-foreground text-center"
              >
                {o}
              </div>
            ))}
            {data.interventions.map((i) => (
              <RowFragment
                key={i}
                intervention={i}
                outcomes={data.outcomes}
                cellFor={cellFor}
                maxCount={maxCount}
                onSelect={setSelected}
                selected={selected}
              />
            ))}
          </div>
        </div>

        <aside className="bg-card border border-rule rounded-lg p-6 sticky top-24">
          {!selected ? (
            <>
              <div className="label-eyebrow mb-2">Inspector</div>
              <p className="text-sm text-muted-foreground">
                Click any cell to inspect study counts, dominant direction, and the gap
                classification (if any).
              </p>
            </>
          ) : (
            <>
              <div className="label-eyebrow mb-1">Cell</div>
              <h3 className="font-display text-xl mb-4">
                {selected.intervention_label} × {selected.outcome_label}
              </h3>
              <dl className="grid grid-cols-2 gap-y-3 text-sm">
                <dt className="text-muted-foreground">Studies</dt>
                <dd className="font-mono">{selected.study_count}</dd>
                <dt className="text-muted-foreground">Direction</dt>
                <dd>{selected.dominant_direction ?? "—"}</dd>
                <dt className="text-muted-foreground">Gap type</dt>
                <dd>
                  {selected.gap_type ? (
                    <span
                      className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `color-mix(in oklab, ${gapBorder[selected.gap_type]} 18%, transparent)`,
                        color: gapBorder[selected.gap_type],
                      }}
                    >
                      {selected.gap_type}
                    </span>
                  ) : (
                    "—"
                  )}
                </dd>
              </dl>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function RowFragment({
  intervention,
  outcomes,
  cellFor,
  maxCount,
  onSelect,
  selected,
}: {
  intervention: string;
  outcomes: string[];
  cellFor: (i: string, o: string) => EvidenceMapCell | undefined;
  maxCount: number;
  onSelect: (c: EvidenceMapCell) => void;
  selected: EvidenceMapCell | null;
}) {
  return (
    <>
      <div className="bg-card p-3 text-sm font-medium flex items-center">{intervention}</div>
      {outcomes.map((o) => {
        const cell = cellFor(intervention, o);
        if (!cell) return <div key={o} className="bg-card" />;
        const size = 16 + (cell.study_count / maxCount) * 44;
        const empty = cell.study_count === 0;
        const isSel =
          selected?.intervention_label === intervention && selected?.outcome_label === o;
        return (
          <button
            key={o}
            onClick={() => onSelect(cell)}
            className={`bg-card grid place-items-center aspect-square min-h-[88px] hover:bg-muted/40 transition ${isSel ? "outline outline-2 outline-primary" : ""}`}
          >
            {empty ? (
              <div
                className="w-6 h-6 rounded-full border-2 border-dashed"
                style={{ borderColor: cell.gap_type ? gapBorder[cell.gap_type] : "var(--rule)" }}
              />
            ) : (
              <div
                className="rounded-full"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: cell.dominant_direction
                    ? directionColor[cell.dominant_direction]
                    : "var(--color-dir-unclear)",
                  outline: cell.gap_type ? `2px solid ${gapBorder[cell.gap_type]}` : "none",
                  outlineOffset: 2,
                }}
                title={`${cell.study_count} study(ies)`}
              />
            )}
          </button>
        );
      })}
    </>
  );
}

function Legend() {
  return (
    <div className="hidden md:flex items-center gap-5 text-xs">
      <LegendDot color="var(--color-dir-intervention)" label="Favours intervention" />
      <LegendDot color="var(--color-dir-comparator)" label="Favours comparator" />
      <LegendDot color="var(--color-dir-mixed)" label="Mixed" />
      <span className="w-px h-4 bg-rule" />
      <LegendRing color="var(--color-gap-innovation)" label="Innovation gap" />
      <LegendRing color="var(--color-gap-synthesis)" label="Synthesis gap" />
      <LegendRing color="var(--color-gap-knowledge)" label="Knowledge gap" />
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}

function LegendRing({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="w-3 h-3 rounded-full border-2"
        style={{ borderColor: color, backgroundColor: "transparent" }}
      />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}
