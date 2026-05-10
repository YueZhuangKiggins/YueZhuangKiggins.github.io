const mockPico = {
  population: "Adults aged 70+ with HFpEF",
  intervention: "SGLT2 inhibitors",
  comparator: "Standard diuretic therapy",
  outcome: "Hospitalisation, quality of life",
  keywords: ["SGLT2", "HFpEF", "elderly", "empagliflozin", "dapagliflozin"]
};
const mockProjects = [
  {
    project_id: "demo-1",
    title: "SGLT2 inhibitors in elderly heart failure patients",
    question_text: "In adults over 70 with HFpEF, how do SGLT2 inhibitors compare to standard diuretic therapy on hospitalisation and quality of life?",
    status: "review-ready",
    ingestion_mode: "upload",
    created_at: "2026-04-12T10:00:00Z",
    updated_at: "2026-04-22T14:00:00Z"
  },
  {
    project_id: "demo-2",
    title: "Digital CBT for adolescent anxiety",
    question_text: "In adolescents with generalised anxiety, does app-delivered CBT reduce symptoms vs in-person therapy?",
    status: "processing",
    ingestion_mode: "retrieval",
    created_at: "2026-04-30T09:00:00Z",
    updated_at: "2026-05-01T08:00:00Z"
  }
];
const mockEvidenceMap = {
  interventions: ["Empagliflozin", "Dapagliflozin", "Canagliflozin", "Standard diuretic"],
  outcomes: ["Hospitalisation", "Mortality", "Quality of life", "Renal function"],
  cells: [
    { intervention_label: "Empagliflozin", outcome_label: "Hospitalisation", linked_study_ids: ["s1", "s2", "s3", "s4"], study_count: 4, dominant_direction: "favours_intervention" },
    { intervention_label: "Empagliflozin", outcome_label: "Mortality", linked_study_ids: ["s5", "s6"], study_count: 2, dominant_direction: "mixed", gap_type: "synthesis" },
    { intervention_label: "Empagliflozin", outcome_label: "Quality of life", linked_study_ids: [], study_count: 0, gap_type: "innovation" },
    { intervention_label: "Empagliflozin", outcome_label: "Renal function", linked_study_ids: ["s7", "s8", "s9"], study_count: 3, dominant_direction: "favours_intervention", gap_type: "knowledge" },
    { intervention_label: "Dapagliflozin", outcome_label: "Hospitalisation", linked_study_ids: ["s10", "s11"], study_count: 2, dominant_direction: "favours_intervention" },
    { intervention_label: "Dapagliflozin", outcome_label: "Mortality", linked_study_ids: [], study_count: 0, gap_type: "innovation" },
    { intervention_label: "Dapagliflozin", outcome_label: "Quality of life", linked_study_ids: ["s12"], study_count: 1, dominant_direction: "unclear" },
    { intervention_label: "Canagliflozin", outcome_label: "Hospitalisation", linked_study_ids: ["s13"], study_count: 1, dominant_direction: "favours_intervention" },
    { intervention_label: "Canagliflozin", outcome_label: "Renal function", linked_study_ids: [], study_count: 0, gap_type: "innovation" },
    { intervention_label: "Standard diuretic", outcome_label: "Hospitalisation", linked_study_ids: ["s14", "s15"], study_count: 2, dominant_direction: "mixed", gap_type: "synthesis" }
  ]
};
const mockGaps = [
  { id: "g1", type: "innovation", intervention_label: "Empagliflozin", outcome_label: "Quality of life", rationale: "No studies in this PICO frame measure patient-reported QoL outcomes for empagliflozin in HFpEF over 70.", next_question: "Does empagliflozin improve KCCQ scores in HFpEF patients aged 70+?", linked_study_ids: [] },
  { id: "g2", type: "synthesis", intervention_label: "Empagliflozin", outcome_label: "Mortality", rationale: "Two studies report opposing mortality effects with overlapping confidence intervals.", next_question: "Is the mortality benefit of empagliflozin moderated by baseline eGFR?", linked_study_ids: ["s5", "s6"] },
  { id: "g3", type: "knowledge", intervention_label: "Empagliflozin", outcome_label: "Renal function", rationale: "All 3 studies trend strongly positive in narrow populations; broader populations are not represented.", next_question: "Do renal benefits persist in patients with CKD stage 4?", linked_study_ids: ["s7", "s8", "s9"] }
];
const mockReport = {
  summary: "Evidence concentrates around empagliflozin for hospitalisation and renal function. Mortality evidence is conflicting and quality-of-life outcomes are largely unmeasured across the SGLT2 class.",
  key_clusters: [
    "Empagliflozin → Hospitalisation (4 studies, consistent benefit)",
    "Empagliflozin → Renal function (3 studies, one-sided)",
    "Standard diuretic → Hospitalisation (mixed evidence)"
  ],
  opportunities: [
    { id: "o1", title: "Trial empagliflozin QoL outcomes in HFpEF >70", linked_gap_id: "g1", clinical_relevance: 0.86, feasibility: 0.72, total_score: 0.8, rationale: "High patient impact, recruitable population, validated QoL instruments available." },
    { id: "o2", title: "Mortality moderator analysis (eGFR strata)", linked_gap_id: "g2", clinical_relevance: 0.78, feasibility: 0.55, total_score: 0.68, rationale: "Resolves conflicting findings; requires individual patient data access." },
    { id: "o3", title: "Empagliflozin in advanced CKD cohorts", linked_gap_id: "g3", clinical_relevance: 0.74, feasibility: 0.48, total_score: 0.63, rationale: "Addresses one-sided evidence; recruitment of CKD stage 4 challenging." }
  ]
};
const store = {
  projects: [...mockProjects],
  picos: /* @__PURE__ */ new Map()
};
function delay(value, ms = 350) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
function newId() {
  return `proj-${Math.random().toString(36).slice(2, 8)}`;
}
const api = {
  listProjects: () => delay([...store.projects]),
  getProject: (id) => {
    const p = store.projects.find((x) => x.project_id === id);
    return delay(p ?? store.projects[0]);
  },
  createProject: (body) => {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const p = {
      project_id: newId(),
      title: body.title,
      question_text: body.question_text,
      status: "draft",
      ingestion_mode: "upload",
      created_at: now,
      updated_at: now
    };
    store.projects = [p, ...store.projects];
    return delay(p, 600);
  },
  getPico: (id) => {
    const existing = store.picos.get(id);
    if (existing) return delay(existing);
    return delay(mockPico);
  },
  savePico: (id, body) => {
    store.picos.set(id, body);
    return delay(body, 500);
  },
  confirmKeywords: (_id, keywords) => delay({ keywords }, 400),
  retrieve: (_id) => delay({ job_id: `job-${Math.random().toString(36).slice(2, 8)}` }, 800),
  upload: (_id, _files) => delay({ job_id: `job-${Math.random().toString(36).slice(2, 8)}` }, 1200),
  getStatus: (_id) => delay({ status: "review-ready", progress: 100 }),
  getEvidenceMap: (_id) => delay(mockEvidenceMap, 500),
  getGaps: (_id) => delay(mockGaps, 400),
  getReport: (_id) => delay(mockReport, 400)
};
export {
  api as a,
  mockEvidenceMap as b,
  mockGaps as c,
  mockReport as d,
  mockProjects as m
};
