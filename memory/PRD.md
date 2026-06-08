# Flareonix — Product Requirements Document

## Original Problem Statement
Build a complete multi-page, high-performance website for Flareonix — India's youth-powered startup incubator and growth ecosystem. The website should feel like a movement, launchpad, and incubator, with cinematic visuals, a fire/phoenix theme, and a full operations admin panel.

## Brand Identity
- **Name:** Flareonix
- **Tagline:** "Rise. Ignite. Conquer."
- **Mission:** Discover raw talent, ignite bold ideas, and scale the next generation of founders from Tier 2/3 India.
- **Audience:** Founders & creators aged 16–28 across Tier 2/3 India.
- **Logo:** Phoenix bird (red/orange, transparent BG)

## Personas
1. Students (aspiring entrepreneurs)
2. Freelancers scaling to business owners
3. First-generation founders
4. Content Creators
5. Hustlers seeking financial independence

## Core Visual System
- Dark theme (#0D0D0D base) with fire palette: `#FF6B00`, `#FF8C00`, `#FFB300`, `#CC2200`, `#FF4500`
- Custom Spark engine (canvas-based) — ambient sparks, cursor trail, hover bursts, page-transition radial explosion, repulsion field, FPS-adaptive
- Decorative SVGs: FlameIcon, PhoenixDivider, RisingArrow, EmberBadge, PhoenixSilhouette
- Social-proof counter, Trust badge row
- SEO-optimised (OG tags, meta description from MISSION)

## Authentication
- **User auth:** Emergent Google OAuth (`/api/auth/session`)
- **Admin auth:** HTTP Basic Auth (kept as-is per user choice)
  - Email: `connectflareonix@gmail.com`
  - Password: `Flareonix@admin02`

## Backend Stack
- FastAPI + MongoDB (motor async)
- `EMERGENT_LLM_KEY` in `.env` for Claude Sonnet 4.5 via `emergentintegrations`
- DB auto-init on startup (`db_init.py`) — indexes + default settings + seed team/projects/webhook

### Collections & Indexes
- `users`, `user_sessions`, `blog_posts`, `blog_comments`, `team_members`, `projects`, `collaborations`,
  `contact_submissions`, `testimonials`, `case_studies`, `announcements`, `site_settings`,
  `webhook_endpoints`, `ai_generations`, `analytics_pageviews`, `analytics_clicks`, `community_signups`, `reviews`

## Implemented Features (Feb 2026)

### Pages
- Home (Phoenix silhouette hero, TrustBadgeRow, SocialProofCounter, EmberBadge urgency)
- About, Community, Agency, Freelancer Hub, Incubator, AI Tools, Contact, FAQ
- Login, Dashboard, Testimonials

### AI Tools (powered by Claude Sonnet 4.5)
- Caption Generator, Ad Copy Writer, Business Idea Generator, Content Calendar, Email Writer, Pitch Deck Assistant
- Login-gated; history stored per user with copy/delete

### Admin Panel (`/admin/*`)
- Modular sub-pages (small Babel-safe files in `/components/admin/sections/`)
- **Dashboard** — real-time stat cards, signups/pageviews line charts (Chart.js), inquiry-type bar+doughnut, webhook config
- **Blog** — list, RTE editor (TipTap), drafts/publish, featured image upload (base64), tags, comments inbox with admin replies
- **Team Gallery** — CRUD with photo uploads (base64), display order
- **Projects** — CRUD with status, client, outcomes, testimonial, tags
- **Collaborations** — CRUD by type (Event/Knowledge/Startup/Sponsor)
- **Inbox** — Contact Forms tab (CSV export), Freelancer/Founder external-form tabs with Calendly hint
- **Feedback & Reviews** — testimonial approval + user-review moderation, CSV exports
- **Users** — search, role filter, ban/promote, CSV export
- **Announcements** — site-wide banner, dismissible, single-active enforcement
- **Settings** — editable site_settings (contact, social, stats, tagline, mission)

### Public API (highlights)
- `GET /api/settings`, `GET /api/team`, `GET /api/projects`, `GET /api/collaborations`
- `GET /api/blog/posts`, `GET /api/blog/posts/{slug}` (+ view increment), `POST /api/blog/posts/{id}/comments`
- `GET /api/testimonials`, `GET /api/announcements/active`
- `POST /api/contact/submit` (fires Zapier webhook if configured)
- `GET /api/ai/tools`, `POST /api/ai/generate`, `GET /api/ai/history`

### Admin API (HTTP Basic)
- `/api/admin/blog/*`, `/api/admin/blog/comments/*`
- `/api/admin/team/*`, `/api/admin/projects/*`, `/api/admin/collaborations/*`
- `/api/admin/contact-submissions/*`, `/api/admin/testimonials/*`, `/api/admin/announcements/*`
- `/api/admin/users/*`, `/api/admin/settings/{key}`, `/api/admin/webhooks/*`
- `/api/admin/metrics/overview`, `/api/admin/metrics/timeseries?days=N`

## Architecture
```
/app/backend/
  server.py            # Auth, users, community signups, reviews, case studies, analytics
  ai_tools.py          # Claude Sonnet 4.5 endpoints
  content_routes.py    # Blog, team, projects, collabs, contacts, testimonials, announcements, settings, webhooks, metrics
  models_extra.py      # Pydantic models for the above
  db_init.py           # Indexes + default seed

/app/frontend/src/
  pages/               # HomePage, AboutPage, AIToolsPage, AdminPanel, ...
  components/
    admin/
      sections/        # Dashboard, Blog, Team, Projects, ... (one per page)
      uikit/           # Small modular UI primitives (Babel-safe)
      AdminLayout, adminApi, adminAuth, RichTextEditor
    ai/                # Tool grid, workspace, history
    decor/             # FlameIcon, PhoenixDivider, RisingArrow, EmberBadge, PhoenixSilhouette, TrustBadgeRow, SocialProofCounter
    AnnouncementBanner.jsx
  lib/sparkEngine.js   # Canvas particle system
  config/constants.js  # Brand constants
```

## Babel Plugin Workaround
The visual-edits Babel plugin can crash with stack-overflow / cross-file traversal errors on large multi-component files. Mitigation: keep `.jsx` files small (<150 lines, ideally <80) and put one logical component per file. All admin sections follow this rule.

## Prioritized Backlog

### P0 (Done)
- All core public pages
- User & admin auth
- AI Tools (Claude 4.5)
- Full admin panel with analytics
- Spark engine & theme overhaul

### P1 (Future)
- Public Blog page rendering posts with comments UI
- Public Team Gallery + Projects pages bound to admin CMS
- Community discussion feed (signed-in users)
- Gamification (levels, badges, daily streaks)
- Phone OTP login
- Email notifications (signups, review approval)

### P2 (Nice to have)
- Leaderboards
- Event calendar
- Advanced cohort analytics

## Credentials
See `/app/memory/test_credentials.md`.
