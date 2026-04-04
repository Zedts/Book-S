# Task: Authentication & Role-based Routing

## Phase 1 — Database Fixes & Columns Update
- [x] Add `full_name` and `phone` columns to `public.users` table
- [x] Update `handle_new_user` Postgres trigger to capture `full_name` and `phone`
- [x] Grant `USAGE` and `ALL` permissions to `anon` and `authenticated` roles on `public.users` schema
- [x] Update existing test accounts (`admin` and `user`) with dummy `full_name` and `phone` data
- [x] Create `tasks/lessons.md` explaining Supabase schema privilege fixes

## Phase 2 — Form Registration Update (`auth.tsx`)
- [x] Add `fullName` and `phone` states
- [x] Add Name and Phone input fields conditionally when rendering Register mode
- [x] Add `showPassword` state and `Eye` / `EyeOff` icons to the password input 
- [x] Update `signUp` function to pass `options: { data: { full_name, phone } }`

## Phase 3 — Navbar Component Update (`Navbar.tsx`)
- [x] Add "Masuk" button to the Desktop variant
- [x] Add Mobile Menu overlay toggle (`isMobileMenuOpen`)
- [x] Render all `NAV_LINKS` and "Masuk" button inside Mobile Menu
- [x] Close the Mobile Menu on link click or scroll

## Phase 4 — Navbar Fixes (Follow Up)
- [x] Remove Search & ShoppingBag from burger menu and place them inline on mobile wrapper.
- [x] Expand `isAboutPage` logic into `isNotLandingPage` so `#categories` works seamlessly across all pages like `/auth` etc.

## Phase 5 — Session Check
- [x] Integrate session fetching in `Navbar.tsx` on mount.
- [x] Add dynamic UI states: loading spinner and "Dashboard" vs "Masuk" text based on session state.
- [x] Change destination href intelligently across desktop and mobile menus.

## Phase 6 — Verification
- [x] Run `npm run lint`
- [x] Run `npm run build`
