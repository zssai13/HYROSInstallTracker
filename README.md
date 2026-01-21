# HYROS Install Tracker

Internal tool for tracking HYROS integration installation documentation status.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/react-18.2.0-61dafb)
![Tailwind](https://img.shields.io/badge/tailwind-3.4.0-38bdf8)

## Features

- ✅ Track 104 integration install docs (96 v1 + 8 v2)
- ✅ Status tracking (Good / Bad / Unchecked)
- ✅ Critical/Secondary prioritization with skull toggle
- ✅ Upload and manage documentation files (.txt)
- ✅ Download all files as ZIP
- ✅ Filter by status, version, category
- ✅ Search by name
- ✅ Auto-save to localStorage

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or extract the project
cd hyros-tracker-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
hyros-tracker-app/
├── docs/
│   ├── PRD.md              # Product requirements
│   └── ARCHITECTURE.md     # Technical architecture
├── public/
│   └── favicon.svg         # Skull icon
├── src/
│   ├── App.jsx             # Main application
│   ├── main.jsx            # Entry point
│   └── index.css           # Styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Usage

### Status Toggle
Click the status button to cycle through: **Unchecked → Good → Bad → Unchecked**

### Critical Flag
Click the skull icon (💀) next to any install to mark it as critical. Critical installs appear in the dedicated Critical tab.

### Date Tracking
- Click empty date cell → Sets today's date
- Click existing date → Opens date picker to change
- Click ✕ while editing → Clears date

### Documentation Files
- Click "Upload" to attach a .txt file
- Use ↓ to download, ↻ to replace, ✕ to delete
- "Download All" button exports all files as ZIP

### Default Checker
Set your name in the "Default Checker" field. It will auto-fill the "Checked By" column when you mark items as Good or Bad.

## Data Storage

All data is stored in your browser's localStorage under the key `hyros-install-tracker-data`. 

To export your data for backup:
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Copy the value of `hyros-install-tracker-data`

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

## Development with Claude Code

This project is designed for AI-assisted development with Claude Code:

```bash
# Open in Claude Code
claude

# Common tasks:
# "Add a notes column to the tracker"
# "Create a dark/light theme toggle"
# "Add export to CSV functionality"
# "Set up Supabase for backend storage"
```

## Documentation

- [Product Requirements (PRD)](./docs/PRD.md)
- [Architecture](./docs/ARCHITECTURE.md)

## Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool
- **Tailwind CSS 3** - Styling
- **JSZip** - ZIP file generation

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally with `npm run dev`
4. Build and verify with `npm run build && npm run preview`
5. Submit PR

## License

Internal HYROS tool - not for public distribution.
