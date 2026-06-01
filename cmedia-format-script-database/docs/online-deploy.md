# Online omgeving

De aanbevolen productieopzet is:

- Frontend en server routes: Vercel
- Database, login en bestanden: Supabase
- Regio: Amsterdam waar mogelijk

## Stap 1: Supabase

1. Maak een project aan op Supabase.
2. Open SQL Editor.
3. Draai `supabase/schema.sql`.
4. Draai `supabase/storage.sql`.
5. Draai optioneel `supabase/seed.sql`.
6. Kopieer deze waarden:
   - Project URL
   - Anon public key
   - Service role key

## Stap 2: Vercel

1. Maak een nieuw Vercel project.
2. Importeer deze map als Next.js project.
3. Voeg environment variables toe:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://jouw-domein.vercel.app
```

4. Deploy.
5. Zet in Supabase Auth de Vercel URL bij Redirect URLs:

```text
https://jouw-domein.vercel.app/dashboard
```

## Stap 3: Eigen domein

Koppel in Vercel het domein, bijvoorbeeld:

```text
app.cmediaproductions.nl
```

Voeg daarna ook deze redirect URL toe in Supabase:

```text
https://app.cmediaproductions.nl/dashboard
```

## Wat ik nodig heb om dit voor je online te zetten

- Toegang tot een Vercel account of Vercel token.
- Toegang tot een Supabase project of de drie Supabase keys.
- Het gewenste domein, als je geen standaard Vercel URL wilt.
