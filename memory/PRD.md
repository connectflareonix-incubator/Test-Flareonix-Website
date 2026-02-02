# Flareonix - Product Requirements Document

## Original Problem Statement
Build the official website for "FLAREONIX" - a youth-powered, AI-driven startup ecosystem & incubator for ambitious Indian founders. Website must feel like a movement, a launchpad, and a future incubator.

## Brand Identity
- **Name:** Flareonix
- **Motto:** "Rise. Ignite. Conquer."
- **Instagram:** @flare.onix
- **Personality:** Bold, Visionary, Youth-driven, Rebellious, Confident

## User Personas
1. **Students** - College students with startup dreams
2. **Freelancers** - Ready to scale to business owners
3. **First-generation founders** - No prior startup background
4. **Content Creators** - Want to build products

## Core Requirements (Static)
- Dark mode with fiery orange (#FF4500) accents
- Phoenix logo branding
- Community-first approach
- AI-powered execution mindset
- Mobile-first, responsive design
- SEO-optimized structure

## What's Been Implemented (Feb 2, 2026)
### Frontend
- [x] Hero section with logo, motto, CTAs
- [x] About section - Why Flareonix
- [x] Ecosystem Bento Grid - Community, AI, Mentorship, Resources
- [x] Community signup form with MongoDB storage
- [x] AI & Vision section
- [x] Contact section with Google Form redirect
- [x] Footer with social links
- [x] Smooth scroll animations (Framer Motion)
- [x] Mobile responsive design
- [x] Mobile navigation menu

### Backend
- [x] FastAPI server
- [x] Community signup API (POST /api/community/signup)
- [x] Community count API (GET /api/community/count)
- [x] Get signups API (GET /api/community/signups)
- [x] Duplicate email validation
- [x] MongoDB integration

### External Integrations
- Google Form: https://docs.google.com/forms/d/e/1FAIpQLSf5EK_CDUtKwZFo1s9z6MeM-XIoeNfegqdODcNbCGSlRa4Lcw/viewform
- WhatsApp Channel: https://whatsapp.com/channel/0029VbBvp58F6sn3qA6mK501
- Instagram: @flare.onix

## Prioritized Backlog

### P0 (Completed)
- [x] All core pages and sections
- [x] Community signup functionality
- [x] External redirects working

### P1 (Future)
- [ ] Admin dashboard for community members
- [ ] Email notification on signup
- [ ] Blog/Content section
- [ ] Success stories section

### P2 (Nice to Have)
- [ ] Analytics dashboard
- [ ] Newsletter integration
- [ ] Testimonials carousel
- [ ] Event calendar

## Architecture
- **Frontend:** React + Tailwind CSS + Framer Motion
- **Backend:** FastAPI + MongoDB
- **Styling:** Dark theme with Unbounded + Manrope fonts
- **Components:** Shadcn/UI

## Next Tasks
1. Add user testimonials when available
2. Create blog/content section for startup insights
3. Implement admin panel for viewing signups
4. Add email notifications for new signups
