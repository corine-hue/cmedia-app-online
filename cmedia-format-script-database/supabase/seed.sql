insert into public.projects (id, owner_id, title, document_type, status, synopsis, metadata)
select
  '00000000-0000-0000-0000-000000000101',
  id,
  'De Nieuwe Makers',
  'tv_format',
  'in_development',
  'Een premium factual entertainment format waarin jonge makers een stad opnieuw leren bekijken.',
  '{"channel":"CMedia Originals","season":"S01"}'::jsonb
from public.users
limit 1
on conflict do nothing;

insert into public.formats (
  project_id,
  working_title,
  genre,
  audience,
  platform,
  duration,
  episode_count,
  logline,
  short_description,
  format_dna,
  visual_style,
  why_it_works,
  commercial_opportunities,
  production_approach
) values (
  '00000000-0000-0000-0000-000000000101',
  'De Nieuwe Makers',
  'Factual entertainment',
  '25-54, urban minded',
  'NPO / RTL / Streamer',
  '45 minuten',
  6,
  'Talent, stad en urgentie komen samen in een visueel sterk format over de makers van morgen.',
  'Elke aflevering volgt drie creatieve talenten die een maatschappelijk thema vertalen naar een concreet werk.',
  'Observational storytelling, duidelijke opdrachten, emotionele progressie en een sterke final reveal.',
  'Cinematic handheld, warm contrast, grootstedelijke texturen, grafische chapter cards.',
  'Het format combineert herkenbare ambitie met maatschappelijke relevantie en visuele beloning.',
  'Brand partnerships met cultuurfondsen, opleidingen, tech en lifestylemerken.',
  'Compacte crews, real locations, centrale regie per stad en modulaire postproductie.'
) on conflict do nothing;
