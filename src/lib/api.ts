// Demo-mode API client. No real network calls — everything is simulated in
// memory with a small artificial delay so the UI feels live.
//
// To wire up a real backend later, replace the bodies below with `fetch`
// calls against API_BASE_URL.
export const API_BASE_URL = "http://localhost:8000";

export type ProjectStatus =
  | "draft"
  | "processing"
  | "review-ready"
  | "completed"
  | "failed";

export type IngestionMode = "retrieval" | "upload" | "hybrid";

export interface Project {
  project_id: string;
  title: string;
  question_text: string;
  status: ProjectStatus;
  ingestion_mode?: IngestionMode;
  created_at: string;
  updated_at: string;
}

export interface PICO {
  population: string;
  intervention: string;
  comparator?: string;
  outcome?: string;
  structured_text?: string;
  keywords?: string[];
}

export interface Study {
  id: string;
  title: string;
  citation?: string;
  design?: string;
  interventions?: string[];
  outcomes?: string[];
  population?: string;
  sample_size?: number;
  conclusion_direction?:
    | "favours_intervention"
    | "favours_comparator"
    | "mixed"
    | "unclear";
}

export interface EvidenceMapCell {
  intervention_label: string;
  outcome_label: string;
  linked_study_ids: string[];
  study_count: number;
  total_sample_size?: number;
  dominant_direction?: Study["conclusion_direction"];
  gap_type?: GapType;
}

export interface EvidenceMap {
  interventions: string[];
  outcomes: string[];
  cells: EvidenceMapCell[];
}

export type GapType = "innovation" | "synthesis" | "knowledge";

export interface Gap {
  id: string;
  type: GapType;
  intervention_label: string;
  outcome_label: string;
  rationale: string;
  confidence?: number;
  next_question?: string;
  linked_study_ids: string[];
}

export interface ResearchOpportunity {
  id: string;
  title: string;
  linked_gap_id: string;
  clinical_relevance: number;
  feasibility: number;
  total_score: number;
  rationale: string;
}

export interface InsightReport {
  summary: string;
  key_clusters: string[];
  opportunities: ResearchOpportunity[];
}

import {
  mockProjects,
  mockEvidenceMap,
  mockGaps,
  mockReport,
  mockPico,
} from "./mock";

// In-memory demo store (resets on page reload — that's fine for a demo).
const store = {
  projects: [...mockProjects] as Project[],
  picos: new Map<string, PICO>(),
};

function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function newId() {
  return `proj-${Math.random().toString(36).slice(2, 8)}`;
}

export const api = {
  listProjects: () => delay([...store.projects]),

  getProject: (id: string) => {
    const p = store.projects.find((x) => x.project_id === id);
    return delay(p ?? store.projects[0]);
  },

  createProject: (body: { title: string; question_text: string }) => {
    const now = new Date().toISOString();
    const p: Project = {
      project_id: newId(),
      title: body.title,
      question_text: body.question_text,
      status: "draft",
      ingestion_mode: "upload",
      created_at: now,
      updated_at: now,
    };
    store.projects = [p, ...store.projects];
    return delay(p, 600);
  },

  getPico: (id: string) => {
    const existing = store.picos.get(id);
    if (existing) return delay(existing);
    return delay(mockPico);
  },

  savePico: (id: string, body: PICO) => {
    store.picos.set(id, body);
    return delay(body, 500);
  },

  confirmKeywords: (_id: string, keywords: string[]) =>
    delay({ keywords }, 400),

  retrieve: (_id: string) =>
    delay({ job_id: `job-${Math.random().toString(36).slice(2, 8)}` }, 800),

  upload: (_id: string, _files: File[]) =>
    delay({ job_id: `job-${Math.random().toString(36).slice(2, 8)}` }, 1200),

  getStatus: (_id: string) =>
    delay({ status: "review-ready" as ProjectStatus, progress: 100 }),

  getEvidenceMap: (_id: string) => delay(mockEvidenceMap, 500),
  getGaps: (_id: string) => delay(mockGaps, 400),
  getReport: (_id: string) => delay(mockReport, 400),
};
