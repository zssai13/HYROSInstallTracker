# HYROS Install Tracker - Architecture Document

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        HYROS Install Tracker                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────┐  │
│  │   React     │    │  Tailwind   │    │     Supabase Storage        │  │
│  │   UI Layer  │    │  CSS        │    │     (file hosting)          │  │
│  └──────┬──────┘    └─────────────┘    └──────────────┬──────────────┘  │
│         │                                              │                 │
│         ▼                                              │                 │
│  ┌─────────────────────────────────────────┐          │                 │
│  │         State Management                 │          │                 │
│  │         (React useState)                 │◄─────────┘                 │
│  └──────────────────────────┬──────────────┘   file URLs                │
│                             │                                            │
│                             ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                    localStorage                                      ││
│  │                    (App State Persistence)                           ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Public URLs
                                    ▼
                        ┌───────────────────────┐
                        │  HYROS Chrome Extension │
                        │  (fetches index.txt    │
                        │   and doc files)       │
                        └───────────────────────┘
```

---

## Technology Stack

### Frontend Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI components and state management |
| Vite | 5.0.0 | Build tool and dev server |
| Tailwind CSS | 3.4.0 | Utility-first styling |
| JSZip | 3.10.1 | ZIP file generation for bulk export |
| @supabase/supabase-js | latest | Supabase client for file storage |

### Backend Services
| Service | Purpose |
|---------|---------|
| Supabase Storage | File hosting for .txt documentation |
| Public Bucket | Unauthenticated read access for extension |

### Development Tools
| Tool | Purpose |
|------|---------|
| PostCSS | CSS processing for Tailwind |
| Autoprefixer | Browser compatibility |

---

## Project Structure

```
hyros-tracker-app/
├── docs/
│   ├── PRD.md              # Product requirements
│   └── ARCHITECTURE.md     # This file
├── public/
│   └── favicon.svg         # Skull favicon
├── src/
│   ├── lib/
│   │   └── supabase.js     # Supabase client configuration
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles + Tailwind
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── .env.local              # Environment variables (not in git)
├── .gitignore              # Git ignore rules
├── CLAUDE.md               # Development guidelines
└── README.md               # Setup instructions
```

---

## Data Model

### Install Object
```typescript
interface Install {
  id: number;              // Unique identifier (1-104)
  name: string;            // Integration name (e.g., "Facebook Ads")
  version: 'v1' | 'v2';    // Documentation version
  category: string;        // Category (e.g., "Ads", "Payment")
  status: boolean | null;  // true=Good, false=Bad, null=Unchecked
  lastChecked: string | null;  // Date string "M/D/YYYY"
  checkedBy: string;       // Person who checked
  critical: boolean;       // Critical flag for prioritization
  file: FileData | null;   // Uploaded documentation reference
}

interface FileData {
  name: string;            // Original filename
  url: string;             // Supabase public URL
  uploadDate: string;      // Upload date "M/D/YYYY"
}
```

### Storage Schema
```typescript
// localStorage (app state only - no file content)
interface StorageData {
  installs: Install[];     // All 104 installs with their state
  defaultChecker: string;  // Default name for "Checked By" field
}

// Supabase Storage (files)
// Bucket: hyros-docs (public)
// Files: index.txt, [uploaded-docs].txt
```

### localStorage Key
```
hyros-install-tracker-data
```

---

## Supabase Integration

### Configuration
```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
export const BUCKET_NAME = 'hyros-docs'

export function getPublicUrl(filename) {
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${filename}`
}
```

### Environment Variables
```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### File Operations

| Operation | Method | Description |
|-----------|--------|-------------|
| Upload | `supabase.storage.from(bucket).upload(name, file, { upsert: true })` | Upload/replace file |
| Delete | `supabase.storage.from(bucket).remove([name])` | Delete file |
| Get URL | `getPublicUrl(filename)` | Get public access URL |

### Index.txt Auto-Generation
When files are uploaded or deleted, `index.txt` is regenerated:

```javascript
async function regenerateIndex(installs) {
  const filesWithDocs = installs.filter(i => i.file)

  const content = `HYROS Installation Documentation Index
=======================================
Last Updated: ${new Date().toLocaleDateString()}
Total Files: ${filesWithDocs.length}

Instructions for Claude:
- Find the platform the user needs from the list below
- Fetch the file at the URL shown
- Base URL: ${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/

Available Documentation:
------------------------
${filesWithDocs.map(i =>
  `${i.name} | ${i.file.name} | ${i.category} | ${i.version}`
).join('\n')}`

  await supabase.storage
    .from(BUCKET_NAME)
    .upload('index.txt', content, { contentType: 'text/plain', upsert: true })
}
```

---

## Component Architecture

### Single-Component Design (MVP)
The current MVP uses a single `App.jsx` component for simplicity.

```
App.jsx
├── State Management (useState hooks)
├── Effects (useEffect for persistence)
├── Supabase Handlers
│   ├── handleFileUpload → Supabase + regenerateIndex
│   ├── handleFileDownload → Open URL
│   ├── handleFileDelete → Supabase + regenerateIndex
│   └── handleDownloadAll → Fetch URLs + ZIP
├── Render
│   ├── Header + Download All button (with loading state)
│   ├── Stats Dashboard (6 cards)
│   ├── Tabs (Critical / Secondary)
│   ├── Filters Bar
│   └── Data Table
│       └── Row (per install)
│           ├── Skull Toggle
│           ├── Name
│           ├── Version Badge
│           ├── Category
│           ├── Status Toggle
│           ├── Date Picker
│           ├── Checked By Input
│           └── File Upload/Download (with loading state)
```

---

## State Flow

### Data Flow Diagram
```
User Action (Upload File)
    │
    ▼
┌─────────────┐
│ handleFile  │
│ Upload      │
└──────┬──────┘
       │
       ├──────────────────────┐
       │                      │
       ▼                      ▼
┌─────────────┐      ┌─────────────────┐
│ setUploading│      │ Supabase Storage│
│ (loading)   │      │ .upload()       │
└──────┬──────┘      └────────┬────────┘
       │                      │
       │                      ▼
       │             ┌─────────────────┐
       │             │ regenerateIndex │
       │             └────────┬────────┘
       │                      │
       ▼                      ▼
┌─────────────┐      ┌─────────────────┐
│ setInstalls │      │ Upload index.txt│
│ (url ref)   │      └─────────────────┘
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ useEffect   │
│ (save)      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ localStorage│ ◄─── App state only (no file content)
└─────────────┘
```

### State Variables
| State | Type | Purpose |
|-------|------|---------|
| `installs` | Install[] | All install data |
| `filter` | string | Status filter (all/good/bad/unchecked) |
| `versionFilter` | string | Version filter (all/v1/v2) |
| `categoryFilter` | string | Category filter |
| `search` | string | Search query |
| `defaultChecker` | string | Default checker name |
| `editingDateId` | number\|null | Currently editing date row |
| `activeTab` | string | Current tab (critical/secondary) |
| `isLoading` | boolean | Initial loading state |
| `uploading` | number\|null | ID of install currently uploading |
| `downloading` | boolean | Download All in progress |

---

## Key Algorithms

### Status Toggle Cycle
```javascript
// null → true → false → null
const newStatus = status === null ? true : status === true ? false : null;
```

### Date Click Behavior
```javascript
if (!currentDate) {
  // First click: Set today's date
  setDate(today);
} else {
  // Second click: Open date picker
  setEditingDateId(id);
}
```

### Filter Chain
```javascript
const filtered = installs
  .filter(matchesStatus)
  .filter(matchesVersion)
  .filter(matchesCategory)
  .filter(matchesSearch);

const critical = filtered.filter(i => i.critical);
const secondary = filtered.filter(i => !i.critical);
```

### ZIP Export (from URLs)
```javascript
const zip = new JSZip();
await Promise.all(installsWithFiles.map(async (install) => {
  const response = await fetch(install.file.url);
  const content = await response.text();
  zip.file(install.file.name, content);
}));
const blob = await zip.generateAsync({ type: 'blob' });
```

---

## Persistence Strategy

### Current: Hybrid (localStorage + Supabase)

| Data | Storage | Why |
|------|---------|-----|
| App state (status, dates, etc.) | localStorage | Fast, offline-capable |
| Documentation files | Supabase Storage | Cloud-hosted, public URLs |
| Index.txt | Supabase Storage | Extension access |

### Future: Full Backend Migration
```
Current State
    │
    ▼
Phase 2: Supabase Database
    ├── PostgreSQL for app state
    ├── Auth (email/magic link)
    ├── Real-time subscriptions
    └── Row-level security
```

---

## Deployment

### Vercel Configuration
```json
// vercel.json (if needed)
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Environment Variables (Vercel)
Add in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Build Output
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── favicon.svg
```

---

## Public URLs

### Extension Access Points

| Resource | URL Pattern |
|----------|-------------|
| Index | `https://[project].supabase.co/storage/v1/object/public/hyros-docs/index.txt` |
| Any doc | `https://[project].supabase.co/storage/v1/object/public/hyros-docs/[filename]` |

---

## Security Considerations

### Current
- No auth required (internal tool)
- App state in user's browser only
- Files in public Supabase bucket (read-only for extension)
- Write operations require Supabase anon key

### Future (with auth)
- User authentication
- Row-level security in Supabase
- Bucket policies for write access

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01 | Initial MVP release |
| 1.1.0 | 2026-01 | Supabase Storage integration, index.txt auto-generation |

---

## Contact

For questions about this architecture, contact the HYROS development team.
