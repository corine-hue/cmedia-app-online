# CMedia Format & Script Database

Premium SaaS-webapplicatie voor CMedia Productions om TV-formats, scripts, draaiboeken, pitchdecks en documentaireconcepten centraal te maken, beheren, dupliceren, verrijken met afbeeldingen en exporteren naar PDF of Word.

## Stack

- Next.js 15, React, TypeScript
- Tailwind CSS met ShadCN-achtige lokale UI componenten
- Supabase Auth, PostgreSQL en Storage
- PDF export via `pdf-lib`
- Word export via `docx`

## Installatie

```bash
npm install
cp .env.example .env.local
npm run dev
```

Vul in `.env.local` je Supabase URL, anon key en service role key in.

## Supabase setup

1. Maak een nieuw Supabase project.
2. Open SQL Editor.
3. Draai `supabase/schema.sql`.
4. Draai optioneel `supabase/seed.sql` voor voorbeelddata.
5. Maak storage buckets aan via `supabase/storage.sql`.
6. Zet email auth of magic links aan in Supabase Auth.

## Rollen

- `admin`: volledige toegang, gebruikersbeheer via profielrollen.
- `editor`: projecten maken, bewerken, dupliceren, exporteren.
- `viewer`: projecten bekijken en exporteren.

## Belangrijkste routes

- `/login`: inloggen via email magic link.
- `/dashboard`: zoeken, filteren, nieuw project, dupliceren, verwijderen, exporteren.
- `/projects/new`: project aanmaken met typekeuze.
- `/projects/[id]`: project bekijken en bewerken.
- `/api/projects/[id]/export?type=pdf`: PDF export.
- `/api/projects/[id]/export?type=docx`: Word export.

## Folderstructuur

Zie `docs/folder-structure.md` voor een overzicht van alle mappen en verantwoordelijkheden.

## Voorbeeldworkflow

1. Log in via `/login`.
2. Maak via `/projects/new` een TV Format, Script, Draaiboek of Pitchdeck aan.
3. Vul de templatevelden in.
4. Voeg afbeeldingen toe aan de beeldbank.
5. Sla het project op.
6. Exporteer naar PDF of Word vanaf dashboard of editor.

## Productie

```bash
npm run build
npm run start
```

Gebruik in productie Supabase Row Level Security uit `supabase/schema.sql`, aparte buckets voor afbeeldingen en exports, en een server-side service role key uitsluitend in server routes.

Zie `docs/production-checklist.md` voor de oplever- en acceptatiepunten.

## Online zetten

Zie `docs/online-deploy.md` voor de Vercel + Supabase stappen en environment variables.
