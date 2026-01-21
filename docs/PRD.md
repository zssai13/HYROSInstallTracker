# HYROS Install Tracker - Product Requirements Document

## Overview

The HYROS Install Tracker is an internal tool for the HYROS team to manage and track the status of all integration installation documentation across the platform. It provides visibility into which install docs are up-to-date, which need work, and allows team members to collaborate on documentation maintenance.

**Primary Integration**: This app serves as the central documentation storage for the HYROS Chrome Extension, which uses Claude AI to guide customers through platform installations.

---

## Problem Statement

HYROS integrates with 100+ platforms across ads, payments, scheduling, e-commerce, and more. Each integration requires installation documentation that must be:
- Regularly reviewed for accuracy
- Updated when platforms change their APIs/UI
- Prioritized based on customer usage (critical vs. secondary)
- Tracked for accountability (who checked what, when)
- **Accessible to the HYROS Chrome Extension** for AI-guided installations

Without a centralized tracker, documentation falls out of date, critical integrations get missed, and there's no visibility into documentation health.

---

## Goals

1. **Visibility**: At-a-glance view of all install documentation status
2. **Prioritization**: Separate critical integrations from secondary ones
3. **Accountability**: Track who reviewed what and when
4. **Documentation Storage**: Centralize the actual .txt documentation files
5. **Export Capability**: Download all documentation for backup/sharing
6. **Extension Integration**: Serve files to the HYROS Chrome Extension via public URLs

---

## User Personas

### Primary: Documentation Team
- Reviews and updates install docs
- Needs to track their progress
- Needs to prioritize critical integrations

### Secondary: Support Team
- References install docs to help customers
- Needs to know if docs are current
- May flag docs needing updates

### Tertiary: Leadership
- Needs overview of documentation health
- Wants to see critical integration coverage

### Quaternary: HYROS Chrome Extension
- Fetches `index.txt` to discover available documentation
- Retrieves specific platform docs by filename
- Uses docs to guide customers through installations

---

## Features

### MVP (Current Build)

#### 1. Install Inventory
- **104 integrations** pre-loaded (96 v1 + 8 v2)
- Each install tracks:
  - Name
  - Version (v1/v2)
  - Category (Ads, Payment, Ecommerce, etc.)
  - Status (Good/Bad/Unchecked)
  - Last Checked date
  - Checked By (person name)
  - Critical flag
  - Documentation file (.txt)

#### 2. Status Tracking
- **Three-state toggle**: Unchecked → Good → Bad → Unchecked
- Visual indicators: Green (good), Red (bad), Gray (unchecked)
- Stats dashboard showing totals

#### 3. Critical/Secondary Tabs
- Skull icon toggle to mark integrations as critical
- Critical tab shows first by default
- Real-time movement between tabs
- Filters apply across both tabs

#### 4. Date Management
- Click empty cell → Sets today's date
- Click existing date → Opens date picker
- Clear button to remove date

#### 5. Documentation Upload (Supabase Storage)
- Upload .txt files per integration to Supabase Storage
- Files stored in public `hyros-docs` bucket
- Shows filename + upload date
- Download individual files (opens Supabase URL)
- Replace/delete functionality
- **Download All** → Fetches all files and exports as ZIP

#### 6. Auto-Generated Index (`index.txt`)
- Automatically generated when files are uploaded/deleted
- Lists all available documentation files
- Format: `Platform Name | filename.txt | Category | Version`
- Used by Chrome Extension to discover available docs

#### 7. Filtering & Search
- Search by name
- Filter by status (Good/Bad/Unchecked)
- Filter by version (v1/v2)
- Filter by category

#### 8. Persistence
- **App state** (status, dates, checkedBy) saves to localStorage
- **Files** stored in Supabase Storage (cloud)
- Auto-saves on every change

---

## Extension Integration

### How the Chrome Extension Uses This App

```
┌─────────────────────────┐
│   HYROS Chrome Extension │
└───────────┬─────────────┘
            │
            │ 1. Fetch index.txt
            ▼
┌─────────────────────────────────────────────────────────┐
│  https://[project].supabase.co/.../hyros-docs/index.txt │
└───────────┬─────────────────────────────────────────────┘
            │
            │ 2. Parse index, find platform
            │
            │ 3. Fetch platform doc
            ▼
┌─────────────────────────────────────────────────────────┐
│  https://[project].supabase.co/.../hyros-docs/shopify.txt│
└───────────┬─────────────────────────────────────────────┘
            │
            │ 4. Claude reads doc, guides user
            ▼
┌─────────────────────────┐
│   Customer Installation  │
└─────────────────────────┘
```

### Index.txt Format

```
HYROS Installation Documentation Index
=======================================
Last Updated: 1/21/2026
Total Files: 45

Instructions for Claude:
- Find the platform the user needs from the list below
- Fetch the file at the URL shown
- Use the documentation to guide the installation
- Base URL: https://[project].supabase.co/storage/v1/object/public/hyros-docs/

Available Documentation:
------------------------
Active Campaign | active-campaign-v1.txt | Email/CRM | v1
Shopify | shopify-install.txt | Ecommerce | v1
ClickFunnels | clickfunnels-guide.txt | Funnel | v1
Facebook Ads | facebook-ads-v2.txt | Ads | v2
...
```

---

## Future Enhancements (Post-MVP)

### Phase 2: Collaboration
- [ ] User authentication
- [ ] Multi-user support with role-based access
- [ ] Activity log (who changed what, when)
- [ ] Comments/notes per integration

### Phase 3: Advanced Backend
- [ ] Database storage for app state (migrate from localStorage)
- [ ] Webhook notifications for status changes
- [ ] Integration with Slack for alerts

### Phase 4: Analytics
- [ ] Dashboard with charts
- [ ] Documentation health score
- [ ] Overdue review alerts
- [ ] Historical tracking

### Phase 5: Documentation Features
- [ ] Rich text editor for docs (instead of .txt)
- [ ] Version history for documentation
- [ ] Diff view for changes
- [ ] Auto-sync with external doc sources

---

## Technical Requirements

### Frontend
- React 18+
- Tailwind CSS for styling
- Vite for build tooling
- JSZip for file compression

### Backend (Current)
- Supabase Storage for file hosting
- Public bucket for unauthenticated reads
- localStorage for app state

### Hosting
- Vercel (planned)
- Static deployment with Supabase integration

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance
- Initial load < 2 seconds
- Instant UI feedback on interactions
- File uploads with loading indicators

---

## Success Metrics

1. **Adoption**: 100% of documentation team using the tool
2. **Coverage**: All critical integrations reviewed within 30 days
3. **Freshness**: No documentation older than 90 days without review
4. **Accuracy**: Reduction in support tickets due to outdated docs
5. **Extension Integration**: 100% of extension doc fetches succeed

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Supabase downtime | Extension falls back gracefully; files cached |
| File naming conflicts | Upsert mode overwrites; consider versioning later |
| Large file uploads | Supabase handles; add size validation if needed |
| CORS issues | Supabase public buckets allow cross-origin |

---

## Timeline

| Phase | Features | Status |
|-------|----------|--------|
| MVP | Core tracker | ✅ Complete |
| Supabase | File storage + index.txt | ✅ Complete |
| Deploy | Vercel hosting | Pending |
| Phase 2 | Auth + multi-user | TBD |

---

## Appendix

### Integration Categories
- **Ads**: Facebook, Google, TikTok, LinkedIn, Pinterest, Reddit, Snapchat, Bing, Twitter/X, Taboola, MGID, AdRoll
- **Payment**: Stripe, PayPal, Braintree, Square, Authorize.net, ThriveCart, SamCart, etc.
- **Ecommerce**: Shopify, WooCommerce, BigCommerce, Magento, TikTok Shops
- **Funnel**: ClickFunnels, GoHighLevel, Kartra, Kajabi, Funnelish
- **Scheduling**: Calendly, Acuity, OnceHub, SavvyCal, YouCanBook.me
- **Email/CRM**: HubSpot, Salesforce, Klaviyo, ActiveCampaign, Drip, Close CRM
- **Webinar**: Demio, WebinarJam, EverWebinar, eWebinar, WebinarFuel
- **Website**: WordPress, Webflow, Wix, Squarespace
- **Forms**: Typeform, JotForm
- **Tracking**: GTM, CallRail, Ringba
- **Automation**: Zapier, Pabbly
- **Course**: Teachable, Kajabi, Skool, Uscreen
- **Core**: Standard Script, API, Requirements
