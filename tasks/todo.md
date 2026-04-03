# Landing Page Book'S — Task Tracker

## Phase 1 — CSS Foundation + Font Setup
- [x] Update `globals.css`: keyframes blob/float, glass-panel/card, text-gradient, on-load-reveal, reveal/active, stagger, no-scrollbar, delay classes
- [x] Update `layout.tsx`: Plus Jakarta Sans Google Font import, update metadata

## Phase 2 — Reusable Hooks
- [x] `src/hooks/useScrollReveal.ts` — IntersectionObserver for .reveal elements
- [x] `src/hooks/useNavbarScroll.ts` — navbar scroll shrink state

## Phase 3 — Types
- [x] `src/types/landing.ts` — Book, Category, FooterLink interfaces

## Phase 4 — Components
- [x] `src/components/landing/Navbar.tsx`
- [x] `src/components/landing/HeroSection.tsx`
- [x] `src/components/landing/CategoriesSection.tsx`
- [x] `src/components/landing/BestSellersSection.tsx`
- [x] `src/components/landing/NewsletterSection.tsx`
- [x] `src/components/landing/Footer.tsx`

## Phase 5 — Assemble + Verify
- [x] Update `src/main/landing.tsx` to compose all sections
- [x] `yarn lint` → 0 errors, 5 acceptable warnings (no-img-element, no-page-custom-font — false positives for App Router)
- [x] `yarn build` → Successful ✅

## Review

All sections render correctly matching ref.html exactly. Visual verification passed via browser subagent screenshot.
