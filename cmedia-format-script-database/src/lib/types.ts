export type ProjectType = "tv_format" | "script" | "draaiboek" | "pitchdeck";
export type ProjectStatus = "concept" | "in_development" | "internal_review" | "sent" | "approved" | "in_production";
export type AppRole = "admin" | "editor" | "viewer";

export type Project = {
  id: string;
  owner_id: string;
  title: string;
  document_type: ProjectType;
  status: ProjectStatus;
  synopsis: string | null;
  cover_image_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type FormatContent = Record<string, string | number | null>;
export type PitchdeckContent = Record<string, string | null>;

export type Scene = {
  id?: string;
  scene_number: number;
  title?: string | null;
  location?: string | null;
  day_night?: string | null;
  interior_exterior?: string | null;
  cast?: string | null;
  voice_over?: string | null;
  interview_questions?: string | null;
  direction_notes?: string | null;
  camera_angles?: string | null;
  audio?: string | null;
  music?: string | null;
  notes?: string | null;
  sort_order: number;
};

export type DraaiboekRow = {
  Tijd: string;
  Onderdeel: string;
  Locatie: string;
  Verantwoordelijke: string;
  Techniek: string;
  Opmerkingen: string;
};

export type ProjectImage = {
  id: string;
  project_id: string;
  storage_path: string;
  public_url: string | null;
  alt_text: string | null;
  sort_order: number;
};

export type ProjectBundle = {
  project: Project;
  format?: FormatContent | null;
  script?: { id: string; working_title: string | null; logline: string | null; notes: string | null } | null;
  scenes?: Scene[];
  draaiboek?: { rows: DraaiboekRow[] } | null;
  pitchdeck?: PitchdeckContent | null;
  images: ProjectImage[];
};
