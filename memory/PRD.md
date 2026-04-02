# Flareonix - Product Requirements Document

## Original Problem Statement
Build a complete multi-page, high-performance website for Flareonix - a youth-powered, AI-driven startup ecosystem and incubator for ambitious Indians. The website should feel like a movement, launchpad, and future incubator.

## Brand Identity
- **Name:** Flareonix
- **Motto:** "Rise. Ignite. Conquer."
- **Instagram:** @flare.onix
- **Logo:** Phoenix bird in red/orange (transparent background)
- **Personality:** Bold, Visionary, Youth-driven, Rebellious

## User Personas
1. **Students** - Aspiring entrepreneurs with startup dreams
2. **Freelancers** - Ready to scale to business owners
3. **First-generation founders** - No prior startup background
4. **Content Creators** - Want to build products
5. **Hustlers** - Seeking financial independence

## Core Requirements (Static)
- Dark theme with fiery orange (#FF4500) accents
- Premium, futuristic, intense feel
- Mobile-first, responsive design
- SEO-optimized structure
- Smooth animations (Framer Motion)

## What's Been Implemented (April 2, 2026)

### Pages Built
- [x] Home - Hero with logo, tagline, CTAs, features, stats
- [x] About - Why Flareonix exists, vision, values
- [x] Community - Separate Founders & Freelancers sections
- [x] Agency - Digital marketing services with case studies
- [x] Freelancer Hub - Skills, journey, earning potential
- [x] Incubator - Coming Soon with program details
- [x] AI Tools - Coming Soon with tool previews
- [x] Contact - Contact form with social links
- [x] FAQ - Categorized questions
- [x] Login - Google OAuth integration
- [x] Dashboard - User profile and reviews
- [x] Admin Panel - Stats, data export
- [x] Testimonials - Approved reviews display

### Backend Features
- [x] User authentication via Emergent Google OAuth
- [x] User session management
- [x] Admin Basic Auth (connectflareonix@gmail.com)
- [x] Community signup API
- [x] Reviews API (CRUD + moderation)
- [x] Case studies API (admin CRUD)
- [x] Contact messages API
- [x] Analytics tracking (pageviews, clicks)
- [x] Data export (JSON)

### Admin Capabilities
- View dashboard stats
- Export users, signups, reviews, messages as JSON
- Approve/reject reviews
- Manage case studies

## Admin Credentials
- **Email:** connectflareonix@gmail.com
- **Password:** Flareonix@admin02

## External Integrations
- Google OAuth: Emergent-managed (auth.emergentagent.com)
- Google Form: Linked for applications
- WhatsApp Channel: Community redirect
- Instagram: @flare.onix

## Prioritized Backlog

### P0 (Completed)
- [x] All core pages
- [x] User authentication
- [x] Admin panel
- [x] Reviews system

### P1 (Future - Phase 2)
- [ ] Full community dashboard with discussions
- [ ] Gamification (levels, badges, streaks)
- [ ] AI tools implementation
- [ ] Freelancer gigs marketplace
- [ ] Incubator application system

### P2 (Nice to Have)
- [ ] Phone OTP login
- [ ] Email notifications
- [ ] Leaderboards
- [ ] Event calendar
- [ ] Advanced analytics dashboard

## Architecture
- **Frontend:** React + Tailwind CSS + Framer Motion
- **Backend:** FastAPI + MongoDB
- **Auth:** Emergent Google OAuth
- **Styling:** Dark theme with Unbounded + Manrope fonts
- **Components:** Shadcn/UI

## Next Tasks
1. Implement gamification features (levels, badges)
2. Build AI tools (caption generator, ad copy writer)
3. Create freelancer gigs marketplace
4. Add incubator application form
5. Implement email notifications for signups/reviews
