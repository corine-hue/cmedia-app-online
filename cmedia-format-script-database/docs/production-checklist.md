# Productiechecklist

## Supabase

- Draai `supabase/schema.sql`.
- Draai `supabase/storage.sql`.
- Controleer dat RLS op alle tabellen actief is.
- Maak de eerste gebruiker aan en zet diens rol in `public.users` op `admin`.
- Bewaar `SUPABASE_SERVICE_ROLE_KEY` alleen server-side.

## Deploy

- Configureer `.env.local` of hosting secrets.
- Draai `npm run build`.
- Deploy naar Vercel of een Node-host die Next.js 15 ondersteunt.
- Zet `NEXT_PUBLIC_APP_URL` op de publieke URL.

## Acceptatie

- Login werkt via Supabase Auth.
- Admin/editor kan projecten maken, bewerken, dupliceren en verwijderen.
- Viewer kan projecten openen en exporteren.
- Afbeeldingen komen in bucket `project-images`.
- PDF export downloadt als professioneel breedbeeld deck.
- Word export opent als volledig bewerkbaar `.docx`.
