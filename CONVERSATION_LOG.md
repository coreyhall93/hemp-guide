# Hemp Guide Project - Development Log

## Project Overview

**Repo:** `coreyhall93/hemp-guide`
**Stack:** React 19 + Vite 7.3 + GitHub Pages
**Live URL:** `https://coreyhall93.github.io/hemp-guide/`
**Branch:** `claude/review-hemp-guide-g6bMR`

---

## Session 1: Initial Deployment

The project was already built as a single-file React app (`App.jsx`, ~440 lines) containing:

- **10 sections:** Home, Basics, Compounds, Builder, Products, Safety, Comparison, Legal, FAQ, Glossary
- **6 cannabinoid compounds** with full data: THC, CBD, CBG, CBC, CBN, THCv
- **Interactive Effect Builder** that calculates combined profiles in real-time
- **6 product listings** with dosage info (Five brand, Society's Plant brand)
- **12 FAQs** and **16 glossary terms** with search filtering
- **Geist font family** (sans + mono) from Google Fonts
- **All inline CSS** - no external stylesheets

The user pulled from main and deployed successfully with `npm run deploy` (gh-pages).

---

## Session 2: Navigation Redesign

**What changed:** Replaced bottom tab navigation with a persistent sidebar.

### Changes Made:
1. **Persistent sidebar** (220px) that toggles open/closed with smooth cubic-bezier animation
2. **Sticky top bar** (48px) with:
   - Hamburger/close toggle button
   - Clickable title ("Hemp Gummies, Explained") that navigates home
   - Current section label on the right
   - Frosted glass effect (backdrop-filter blur)
3. **Removed bottom navigation** entirely
4. **Sidebar navigation items** with active state indicator (white background + right border)
5. Smooth transitions throughout (`.15s` to `.35s`)

### Design Details:
- Sidebar background: `#FAFAFA`
- Active item: white background with `2px solid #09090B` right border
- Top bar: `rgba(255,255,255,.88)` with `blur(24px)`
- Section label: monospace, uppercase, muted gray

---

## Session 3: Bear-Style Mobile Gesture Sidebar

**Inspiration:** Bear Notes app (iOS) - known for its fluid, Apple-like three-panel navigation with gesture-driven sidebar.

### Bear Research Summary:
- Bear uses a three-panel model: Sidebar > Note List > Editor
- Edge swipe from left reveals sidebar with interactive, cancelable transitions
- Spring-based animations, no spinners or skeleton screens
- Won 2017 Apple Design Award, 7x Editor's Choice
- Described as "more Apple than Apple" by reviewers
- Design philosophy: "enables you and gets out of the way"

### What Was Built:

#### Touch Gesture System
- **Edge swipe detection** from left 24px zone to reveal sidebar
- **Real-time finger tracking** - sidebar follows your finger with zero lag
- **Velocity-aware flick gestures** - fast swipe (>0.4 px/ms) snaps regardless of position
- **Position threshold** - release past 35% opens, under 35% closes
- **Horizontal lock** - only tracks if horizontal movement exceeds vertical by 1.2x
- **Swipe-to-close** - swipe left when sidebar is open to dismiss

#### Visual Effects
- **Spring animation curve:** `cubic-bezier(.32,.72,0,1)` - Apple-style deceleration
- **Backdrop dimming:** `rgba(0,0,0,0.4)` at full open, scales linearly with gesture
- **Content scale:** Shrinks to 97% when sidebar fully open
- **Content translate:** Shifts right by 15% of sidebar width
- **Corner rounding:** Content gets `borderRadius: 12px` when sidebar opens (card-behind-card effect)
- **Edge shadow:** `4px 0 24px` shadow on sidebar scales with progress
- **GPU-accelerated:** All transforms use `translate3d` and `willChange`

#### Responsive Behavior
- **Breakpoint:** 768px
- **Mobile (< 768px):** Overlay sidebar with gesture system, 280px wide
- **Desktop (>= 768px):** Push sidebar (original behavior), 220px wide
- **Auto-close:** Sidebar closes on section select (mobile only)
- **Media query listener:** Responsive state via `matchMedia` API

#### Technical Implementation
- Touch refs (`useRef`) for gesture state to avoid re-renders during drag
- `swipeX` state (0-1 progress) for render, `null` when not gesturing
- `isAnimating` flag: spring transitions only when not actively dragging
- `passive: false` on touchmove to allow `preventDefault()` (prevents scroll during swipe)
- Separate `swipeXRef` to bridge state into event handler closure

### Constants:
```js
MOBILE_BP = 768       // Responsive breakpoint
SIDE_W_MOBILE = 280   // Mobile sidebar width
EDGE_ZONE = 24        // Left edge swipe zone
SWIPE_THRESHOLD = 0.35 // Open/close threshold
SPRING = "cubic-bezier(.32,.72,0,1)" // Animation curve
```

### HTML Changes:
- Added `overscroll-behavior: none` to body (prevents pull-to-refresh interference)
- Added `html, body, #root { height: 100% }` for proper mobile viewport

---

## File Structure

```
hemp-guide/
├── index.html              # Entry point with viewport + CSS reset
├── package.json            # React 19, Vite 7.3, gh-pages
├── vite.config.js          # base: /hemp-guide/
├── src/
│   ├── main.jsx           # React root render
│   └── App.jsx            # All UI, data, and logic (~480 lines)
├── dist/                   # Built output
└── public/
    └── vite.svg
```

## Git History

```
Main commits:
- Initial commit: Hemp Gummies Explained interactive guide
- Add Vite build config and deploy setup
- Add documentation for Hemp Guide Project

Feature branch (claude/review-hemp-guide-g6bMR):
- Redesign navigation: persistent sidebar, remove bottom nav, clickable title
- Add Bear-style gesture-driven mobile sidebar
```

## Data Model

### Compounds (CMP)
Each compound has: `id`, `ab` (abbreviation), `full` (name), `tag`, `icon`, `col` (color), `bg` (background), `psy` (psychoactive), `dt` (drug test), `add` (addiction), `one` (description), `feel` (low/med/hi dosage), `body`, `risk`, `cmp` (comparison), `fx` (8 effect ratings 0-5), `stack` (combination notes)

### Effects (EFX)
8 categories: euphoria, relaxation, focus, energy, sleep, pain, social, clarity

### Products (PRODS)
6 products with: brand, name, icon, full/half dose, profile, best-for, not-for, compound list

### Presets
6 compound combinations: Social+Warm, Social+Clear, Social+Energized, Deep Sleep, Body Calm, Full Relaxation

---

## Deployment

```bash
npm run deploy  # runs: vite build && gh-pages -d dist
```

Deploys to GitHub Pages at the `/hemp-guide/` base path.
