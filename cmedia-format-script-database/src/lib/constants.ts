export const projectTypes = [
  { value: "tv_format", label: "TV Format" },
  { value: "script", label: "Script" },
  { value: "draaiboek", label: "Draaiboek" },
  { value: "pitchdeck", label: "Pitchdeck" }
] as const;

export const projectStatuses = [
  { value: "concept", label: "Concept" },
  { value: "in_development", label: "In ontwikkeling" },
  { value: "internal_review", label: "Intern review" },
  { value: "sent", label: "Verstuurd" },
  { value: "approved", label: "Goedgekeurd" },
  { value: "in_production", label: "In productie" }
] as const;

export const formatFields = [
  ["working_title", "Werknaam"],
  ["genre", "Genre"],
  ["audience", "Doelgroep"],
  ["platform", "Platform / Zender"],
  ["duration", "Duur"],
  ["episode_count", "Aantal afleveringen"],
  ["logline", "Logline"],
  ["short_description", "Korte omschrijving"],
  ["format_dna", "Format DNA"],
  ["main_characters", "Hoofdpersonen"],
  ["setting", "Setting"],
  ["episode_structure", "Afleverstructuur"],
  ["recurring_segments", "Rubrieken"],
  ["visual_style", "Visuele stijl"],
  ["tone_of_voice", "Tone of voice"],
  ["why_it_works", "Waarom werkt dit format"],
  ["commercial_opportunities", "Commerciële kansen"],
  ["production_approach", "Productie-aanpak"],
  ["future_seasons", "Toekomstige seizoenen"]
] as const;

export const pitchdeckFields = [
  ["cover", "Cover"],
  ["logline", "Logline"],
  ["program_description", "Programma omschrijving"],
  ["cast_description", "Cast"],
  ["episode_build", "Afleveropbouw"],
  ["visual_style", "Visuele stijl"],
  ["why_now", "Waarom nu"],
  ["commercial_opportunities", "Commerciële kansen"],
  ["production", "Productie"],
  ["contact", "Contact"]
] as const;

export const sceneFields = [
  ["title", "Titel"],
  ["location", "Locatie"],
  ["day_night", "Dag/Nacht"],
  ["interior_exterior", "Binnen/Buiten"],
  ["cast", "Cast"],
  ["voice_over", "Voice-over"],
  ["interview_questions", "Interviewvragen"],
  ["direction_notes", "Regie aanwijzingen"],
  ["camera_angles", "Camerastandpunten"],
  ["audio", "Audio"],
  ["music", "Muziek"],
  ["notes", "Notities"]
] as const;

export const draaiboekColumns = [
  "Tijd",
  "Onderdeel",
  "Locatie",
  "Verantwoordelijke",
  "Techniek",
  "Opmerkingen"
] as const;
