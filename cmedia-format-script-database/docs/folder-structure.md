# Folderstructuur

```text
cmedia-format-script-database/
├─ src/
│  ├─ app/
│  │  ├─ api/projects/              # Project CRUD, dupliceren en export
│  │  ├─ dashboard/                 # Centrale database view
│  │  ├─ login/                     # Supabase magic link login
│  │  └─ projects/                  # Nieuw project en editor
│  ├─ components/                   # App shell, dashboard cards, editor, UI
│  └─ lib/
│     ├─ export/                    # PDF en Word rendering
│     ├─ supabase/                  # Browser/server clients
│     ├─ constants.ts               # Statussen, types, templates
│     ├─ projects.ts                # Project bundling en defaults
│     └─ types.ts                   # Domeintypes
├─ supabase/
│  ├─ schema.sql                    # Tabellen, relaties, RLS, rollen
│  ├─ storage.sql                   # Buckets en policies
│  └─ seed.sql                      # Voorbeelddata
├─ docs/
│  ├─ folder-structure.md
│  └─ production-checklist.md
└─ README.md
```
