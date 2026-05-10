import { r as reactExports, V as jsxRuntimeExports } from "./server-CsSHuzdL.js";
import { a as api, b as mockEvidenceMap, c as mockGaps, d as mockReport } from "./api-BBfGI-_Z.js";
import { c as Route } from "./router-ClubPYl5.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const empty = { population: "", intervention: "", comparator: "", outcome: "", keywords: [] };
function PicoTab({ projectId }) {
  const [pico, setPico] = reactExports.useState(empty);
  const [keywordsInput, setKeywordsInput] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [savedAt, setSavedAt] = reactExports.useState(null);
  reactExports.useEffect(() => {
    api.getPico(projectId).then((p) => {
      setPico(p);
      setKeywordsInput((p.keywords ?? []).join(", "));
    });
  }, [projectId]);
  async function save() {
    setSaving(true);
    const body = {
      ...pico,
      keywords: keywordsInput.split(",").map((s) => s.trim()).filter(Boolean)
    };
    await api.savePico(projectId, body);
    setSaving(false);
    setSavedAt((/* @__PURE__ */ new Date()).toLocaleTimeString());
  }
  const structured = `In ${pico.population || "[population]"}, what are the effects of ${pico.intervention || "[intervention]"}${pico.comparator ? ` compared to ${pico.comparator}` : ""}${pico.outcome ? ` on ${pico.outcome}` : ""}?`;
  const fields = [
    { key: "population", label: "Population", required: true, placeholder: "e.g. Adults 70+ with HFpEF" },
    { key: "intervention", label: "Intervention", required: true, placeholder: "e.g. SGLT2 inhibitors" },
    { key: "comparator", label: "Comparator (optional)", placeholder: "e.g. Standard diuretic" },
    { key: "outcome", label: "Outcome (optional)", placeholder: "e.g. Hospitalisation, QoL" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-[1.2fr_1fr] gap-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-eyebrow mb-3", children: "Structured framing" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl mb-6", children: "Define the PICO" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        fields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "label-eyebrow block mb-1.5", children: [
            f.label,
            " ",
            f.required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: pico[f.key] ?? "",
              onChange: (e) => setPico({ ...pico, [f.key]: e.target.value }),
              placeholder: f.placeholder,
              className: "w-full bg-card border border-input rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring"
            }
          )
        ] }, f.key)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-eyebrow block mb-1.5", children: "Candidate keywords (comma separated)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: keywordsInput,
              onChange: (e) => setKeywordsInput(e.target.value),
              rows: 3,
              className: "w-full bg-card border border-input rounded-md px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1.5", children: "Generated suggestions appear here. Edit before retrieval." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: save,
            disabled: saving,
            className: "bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50",
            children: saving ? "Saving…" : "Save PICO"
          }
        ),
        savedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          "Saved at ",
          savedAt
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-24 bg-card border border-rule rounded-lg p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-eyebrow mb-2", children: "Structured statement" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl leading-relaxed mb-6", children: structured }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-eyebrow mb-2", children: "Keywords" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: keywordsInput.split(",").map((s) => s.trim()).filter(Boolean).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-xs font-mono bg-muted px-2 py-1 rounded border border-rule",
          children: k
        },
        k
      )) })
    ] }) })
  ] });
}
function IngestTab({ projectId }) {
  const [files, setFiles] = reactExports.useState([]);
  const [status, setStatus] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  async function handleRetrieve() {
    setBusy(true);
    setStatus("Querying configured literature sources…");
    await api.retrieve(projectId);
    setStatus("Retrieval complete. 24 candidate studies screened, 11 included.");
    setBusy(false);
  }
  async function handleUpload() {
    if (!files.length) return;
    setBusy(true);
    setStatus(`Uploading ${files.length} file(s)…`);
    await api.upload(projectId, files);
    setStatus(`Processed ${files.length} document(s). Structured study records created.`);
    setBusy(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-card border border-rule rounded-lg p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-eyebrow mb-2", children: "Variant A" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl mb-2", children: "Retrieve from sources" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Use the keywords confirmed in the PICO step to query configured literature databases. Screening and extraction run automatically." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleRetrieve,
          disabled: busy,
          className: "bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50",
          children: "Start retrieval"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-card border border-rule rounded-lg p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-eyebrow mb-2", children: "Variant B" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl mb-2", children: "Upload PDFs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Drop in study PDFs you've already collected. Each is parsed into a structured study record with provenance preserved." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block border-2 border-dashed border-rule rounded-md px-4 py-8 text-center cursor-pointer hover:bg-muted/40 transition mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "file",
            multiple: true,
            accept: "application/pdf",
            className: "hidden",
            onChange: (e) => setFiles(Array.from(e.target.files ?? []))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Click to choose PDFs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: files.length ? `${files.length} file(s) selected` : "or drag here" })
      ] }),
      files.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "text-xs font-mono mb-4 space-y-1 max-h-32 overflow-auto", children: files.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-muted-foreground truncate", children: [
        "· ",
        f.name
      ] }, f.name)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleUpload,
          disabled: busy || !files.length,
          className: "bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50",
          children: "Process uploads"
        }
      )
    ] }),
    status && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 border border-rule rounded-lg px-4 py-3 bg-muted/40 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-eyebrow mr-3", children: "Status" }),
      status
    ] })
  ] });
}
const directionColor = {
  favours_intervention: "var(--color-dir-intervention)",
  favours_comparator: "var(--color-dir-comparator)",
  mixed: "var(--color-dir-mixed)",
  unclear: "var(--color-dir-unclear)"
};
const gapBorder = {
  innovation: "var(--color-gap-innovation)",
  synthesis: "var(--color-gap-synthesis)",
  knowledge: "var(--color-gap-knowledge)"
};
function MapTab({ projectId }) {
  const [data, setData] = reactExports.useState(mockEvidenceMap);
  const [selected, setSelected] = reactExports.useState(null);
  reactExports.useEffect(() => {
    api.getEvidenceMap(projectId).then(setData);
  }, [projectId]);
  const maxCount = reactExports.useMemo(
    () => Math.max(1, ...data.cells.map((c) => c.study_count)),
    [data]
  );
  function cellFor(intervention, outcome) {
    return data.cells.find(
      (c) => c.intervention_label === intervention && c.outcome_label === outcome
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-eyebrow mb-1", children: "Visualisation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl", children: "Intervention × Outcome map" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[1fr_320px] gap-8 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-rule rounded-lg p-6 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "grid gap-px bg-rule",
          style: {
            gridTemplateColumns: `200px repeat(${data.outcomes.length}, minmax(110px, 1fr))`
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card" }),
            data.outcomes.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "bg-card p-2 text-xs font-mono uppercase tracking-wider text-muted-foreground text-center",
                children: o
              },
              o
            )),
            data.interventions.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              RowFragment,
              {
                intervention: i,
                outcomes: data.outcomes,
                cellFor,
                maxCount,
                onSelect: setSelected,
                selected
              },
              i
            ))
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "bg-card border border-rule rounded-lg p-6 sticky top-24", children: !selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-eyebrow mb-2", children: "Inspector" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Click any cell to inspect study counts, dominant direction, and the gap classification (if any)." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-eyebrow mb-1", children: "Cell" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-xl mb-4", children: [
          selected.intervention_label,
          " × ",
          selected.outcome_label
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "grid grid-cols-2 gap-y-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Studies" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-mono", children: selected.study_count }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Direction" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: selected.dominant_direction ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Gap type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: selected.gap_type ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded",
              style: {
                backgroundColor: `color-mix(in oklab, ${gapBorder[selected.gap_type]} 18%, transparent)`,
                color: gapBorder[selected.gap_type]
              },
              children: selected.gap_type
            }
          ) : "—" })
        ] })
      ] }) })
    ] })
  ] });
}
function RowFragment({
  intervention,
  outcomes,
  cellFor,
  maxCount,
  onSelect,
  selected
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card p-3 text-sm font-medium flex items-center", children: intervention }),
    outcomes.map((o) => {
      const cell = cellFor(intervention, o);
      if (!cell) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card" }, o);
      const size = 16 + cell.study_count / maxCount * 44;
      const empty2 = cell.study_count === 0;
      const isSel = selected?.intervention_label === intervention && selected?.outcome_label === o;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onSelect(cell),
          className: `bg-card grid place-items-center aspect-square min-h-[88px] hover:bg-muted/40 transition ${isSel ? "outline outline-2 outline-primary" : ""}`,
          children: empty2 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-6 h-6 rounded-full border-2 border-dashed",
              style: { borderColor: cell.gap_type ? gapBorder[cell.gap_type] : "var(--rule)" }
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "rounded-full",
              style: {
                width: size,
                height: size,
                backgroundColor: cell.dominant_direction ? directionColor[cell.dominant_direction] : "var(--color-dir-unclear)",
                outline: cell.gap_type ? `2px solid ${gapBorder[cell.gap_type]}` : "none",
                outlineOffset: 2
              },
              title: `${cell.study_count} study(ies)`
            }
          )
        },
        o
      );
    })
  ] });
}
function Legend() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-5 text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegendDot, { color: "var(--color-dir-intervention)", label: "Favours intervention" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegendDot, { color: "var(--color-dir-comparator)", label: "Favours comparator" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegendDot, { color: "var(--color-dir-mixed)", label: "Mixed" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-px h-4 bg-rule" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegendRing, { color: "var(--color-gap-innovation)", label: "Innovation gap" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegendRing, { color: "var(--color-gap-synthesis)", label: "Synthesis gap" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegendRing, { color: "var(--color-gap-knowledge)", label: "Knowledge gap" })
  ] });
}
function LegendDot({ color, label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-full", style: { backgroundColor: color } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label })
  ] });
}
function LegendRing({ color, label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "w-3 h-3 rounded-full border-2",
        style: { borderColor: color, backgroundColor: "transparent" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label })
  ] });
}
const meta = {
  innovation: {
    label: "Innovation gap",
    color: "var(--color-gap-innovation)",
    desc: "No evidence identified for this intervention–outcome cell."
  },
  synthesis: {
    label: "Synthesis gap",
    color: "var(--color-gap-synthesis)",
    desc: "Multiple studies disagree on direction or magnitude."
  },
  knowledge: {
    label: "Knowledge gap",
    color: "var(--color-gap-knowledge)",
    desc: "Evidence is one-sided or narrowly framed."
  }
};
function GapsTab({ projectId }) {
  const [gaps, setGaps] = reactExports.useState(mockGaps);
  const [filter, setFilter] = reactExports.useState("all");
  reactExports.useEffect(() => {
    api.getGaps(projectId).then(setGaps);
  }, [projectId]);
  const visible = gaps.filter((g) => filter === "all" || g.type === filter);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-eyebrow mb-1", children: "Decision support" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl", children: "Identified gaps" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["all", "innovation", "synthesis", "knowledge"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setFilter(t),
          className: `px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition ${filter === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`,
          children: t
        },
        t
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
      visible.map((g) => {
        const m = meta[g.type];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "article",
          {
            className: "bg-card border border-rule rounded-lg p-6 grid md:grid-cols-[200px_1fr] gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "inline-block text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded mb-3",
                    style: {
                      backgroundColor: `color-mix(in oklab, ${m.color} 18%, transparent)`,
                      color: m.color
                    },
                    children: m.label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: m.desc })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-xl mb-2", children: [
                  g.intervention_label,
                  " × ",
                  g.outcome_label
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80 mb-4", children: g.rationale }),
                g.next_question && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-l-2 pl-4 py-1", style: { borderColor: m.color }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-eyebrow mb-1", children: "Possible next question" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base", children: g.next_question })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-4 font-mono", children: [
                  "Linked studies: ",
                  g.linked_study_ids.length || "0 (innovation cell)"
                ] })
              ] })
            ]
          },
          g.id
        );
      }),
      visible.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground py-12 text-center", children: "No gaps in this category." })
    ] })
  ] });
}
function ReportTab({ projectId }) {
  const [report, setReport] = reactExports.useState(mockReport);
  reactExports.useEffect(() => {
    api.getReport(projectId).then(setReport);
  }, [projectId]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-6 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-eyebrow mb-2", children: "Insight report" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl mb-6", children: "Landscape & opportunities" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "label-eyebrow mb-3", children: "Summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl leading-snug text-foreground/90", children: report.summary })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "label-eyebrow mb-3", children: "Key clusters" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: report.key_clusters.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-muted-foreground", children: String(i + 1).padStart(2, "0") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "label-eyebrow mb-4", children: "Ranked research opportunities" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: report.opportunities.map((op, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("article", { className: "bg-card border border-rule rounded-lg p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-[40px_1fr_auto] gap-4 items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl text-muted-foreground", children: String(i + 1).padStart(2, "0") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-xl mb-2", children: op.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/75 mb-3", children: op.rationale }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Score, { label: "Clinical relevance", value: op.clinical_relevance }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Score, { label: "Feasibility", value: op.feasibility })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-eyebrow", children: "Priority" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl text-primary", children: op.total_score.toFixed(2) })
        ] })
      ] }) }, op.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-10 border-t border-rule pt-4", children: "Priority = weighted combination of relevance and feasibility. Weights are configurable. Each opportunity links back to a specific gap and its source studies." })
  ] });
}
function Score({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 max-w-[180px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-eyebrow", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: value.toFixed(2) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-full bg-primary",
        style: { width: `${Math.round(value * 100)}%` }
      }
    ) })
  ] });
}
function TabRouter() {
  const {
    projectId,
    tab
  } = Route.useParams();
  switch (tab) {
    case "pico":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(PicoTab, { projectId });
    case "ingest":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(IngestTab, { projectId });
    case "map":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(MapTab, { projectId });
    case "gaps":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(GapsTab, { projectId });
    case "report":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ReportTab, { projectId });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-6 py-12 text-muted-foreground", children: "Unknown section." });
  }
}
export {
  TabRouter as component
};
