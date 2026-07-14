# Portfolio Improvements Design
**Date:** 2026-07-14
**Author:** Divyansh Kanodia
**Status:** Approved

---

## Overview

Five targeted improvements to the DK-01 portfolio to maximize impact with quant/tech recruiters:

1. Scroll-World Hero — immersive AI video fly-through as the landing experience
2. Slim Top Nav Bar — always-visible navigation for fast recruiter access
3. Quant Spotlight Auto-Boot — surfaces finance/RL work immediately on load
4. Resume CTA in Hero — prominent download and social links
5. Mobile Card Layout — usable experience on small screens

The terminal CLI, hacker aesthetic, and easter eggs are preserved entirely. These changes
add discoverability layers on top of the existing experience.

---

## 1. Scroll-World Hero Section

### What it is
A full-viewport scroll-scrubbed video section placed at the very top of the page, above
the terminal. As the visitor scrolls, a camera flies continuously through five isometric
diorama scenes representing Divyansh's world. Below the hero, the existing terminal
experience begins as before.

### Scenes (ordered journey)
| # | Scene name | Subject | Eyebrow | Headline | Body | Tags |
|---|---|---|---|---|---|---|
| 1 | Mission Control | Futuristic terminal lab, neon monitors, dark room | Building systems | DK-01 Online. | Reinforcement learning. Quantitative finance. Labor economics. | RL, Quant, Research |
| 2 | The Markets | Quant trading floor, financial terminals, data streams | Valuation & modeling | Where numbers tell a story. | From KPMG valuation models to Monte Carlo simulations — finding signal in noise. | Finance, Optimization |
| 3 | The Research Lab | RL agents, robot arms, academic whiteboard | Multi-agent systems | Teaching machines to cooperate. | Fleet Attack, Frozen Lake, LLM-robotics integration at Tan Labs. | PyTorch, MATLAB, Gym |
| 4 | The Data Observatory | Globe with labor market data flows, charts, econometrics | Labor & economics | Measuring the unmeasurable. | Indian labor market analysis, food rating prediction, basketball gravity metrics. | Econometrics, Stata, Python |
| 5 | Connect | Minimal dark desk, single monitor, open notebook | Let's work together | Ready to contribute. | Open to quant research, data science, and software engineering roles. | [CTA: Download Resume] |

### Brand Kit
- Name: DK-01
- Background: `#050A0F`
- Cyan: `#00FFFF`
- Blue: `#00AAFF`
- Green: `#00FF88`
- Purple: `#B469FF`
- Tone: precise, curious, understated

### Art Direction
Dark isometric clay diorama, neon-lit miniature environments, tilt-shift miniature,
cyberpunk palette — cyan and purple neon glow against near-black. Shared style preamble
used verbatim in every scene prompt for cohesion.

### Camera Architecture
Architecture A — continuous forward take. The camera glides forward from scene 1 through
scene 5 with no pullbacks. Each leg's `--start-image` is the actual last frame of the
previous rendered leg. No connectors needed. Default model: `seedance_2_0`.

### Mobile
Desktop only. The terminal is already desktop-native; mobile gets the card layout (see
section 5). No mobile scrub encodes needed.

### Integration into Next.js page
- Assets live in `public/scroll-world/` (stills as `.webp`, clips as `.mp4`)
- `scrub-engine.js` copied to `public/scroll-world/scrub-engine.js`
- New component `src/components/scroll/ScrollWorld.tsx` mounts the engine in a
  `useEffect` into a container `div`
- Rendered at the very top of `page.tsx` before the terminal section, wrapped in a
  `display: none` block on mobile (< 768px)
- Total height of scroll-world section: ~500vh (100vh per scene)
- After the scroll-world, a subtle "scroll to explore the terminal" hint fades in

---

## 2. Slim Top Nav Bar

### Component
`src/components/navigation/TopNav.tsx`

### Layout
```
[DK-01]  .......  [Projects] [Experience] [Education] [Skills] [Contact]  [Resume ↓]
```

Fixed position, full-width, `z-50`. On scroll > 20px: adds `backdrop-blur-md` + semi-
transparent dark background (`bg-black/60`). Below scroll-world section, the nav sits
above the terminal.

### Behavior
- Each nav link fires the corresponding terminal command by dispatching a custom DOM
  event (`dk-command`) that `CommandInterface.tsx` listens for
- This keeps the terminal as the single source of truth — clicking "Projects" is
  equivalent to typing `projects`
- Active state: highlights the link whose corresponding content is currently displayed
- "Resume ↓" triggers a direct `<a href="/resume.pdf" download>` — no terminal needed

### Styling
Monospace font (`font-mono`), small text (`text-xs`), cyan accent on hover/active.
Matches existing aesthetic. Height: `h-10`.

### Implementation notes
- Add `topnav-active` CSS class mechanism: `CommandInterface` sets `data-active-section`
  on a root element; `TopNav` reads it to highlight the correct link
- No new state management needed beyond existing command routing

---

## 3. Quant Spotlight Auto-Boot

### Behavior
On initial page load, before the user types anything, the terminal auto-runs:
```
> featured --filter=quant
```
This fires after a 1.2s delay (enough for the typewriter greeting to finish). It renders
a new content type `quant_spotlight` in `ContentDisplay`.

### Quant Spotlight content
A dedicated panel showing:
- KPMG Valuation Intern (experience card)
- Monte Carlo Optimization (project card)
- Fleet Attack RL research (project card)
- Rate My Recipe / Reddit Engagement (project cards — show breadth)
- "View all projects →" CTA that fires `projects` command

### Hero tagline update
The typewriter sequence in the hero changes from the current generic intro to lead with:
```
Reinforcement Learning · Quantitative Finance · Labor Economics
```
This appears as the first typewriter line before the existing personality lines.

### Implementation
- `CommandInterface.tsx` already has command routing logic
- Add a `useEffect` in `page.tsx` with a 1200ms timeout that dispatches the `dk-command`
  event for `featured --filter=quant`
- Add `case 'quant_spotlight'` to `ContentDisplay`'s `renderContent` switch
- Quant spotlight data is derived from existing `projects` and `experience` arrays — no
  new data source needed (filter by known titles)

---

## 4. Resume CTA in Hero

### Placement
Below the typewriter intro area, above the terminal input. A row of three ghost buttons:

```
[→ View Projects]   [↓ Download Resume]   [↗ LinkedIn]
```

### Styling
Ghost buttons: `border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 px-4 py-2
rounded text-sm font-mono`. Spaced with `gap-3`. Fade in with a 0.8s `motion.div` delay
after the typewriter completes.

### Implementation
- Resume file placed at `public/resume.pdf`
- LinkedIn URL pulled from existing social links in the page
- Buttons added directly in `page.tsx` hero section JSX, no new component needed

---

## 5. Mobile Card Layout

### Trigger
`useEffect` with `window.innerWidth < 768` check + `resize` listener. A `isMobile`
boolean state gates which layout renders.

### Mobile layout (MobileLayout.tsx)
Vertical scroll, dark theme, no terminal:
1. Hero: name, tagline, social icon row
2. Skills chips: top 8 tech tags from projects data
3. Experience: vertical cards (title, company, year, description, tech tags)
4. Projects: 2-column grid of project cards (same as existing ContentDisplay projects view)
5. Contact: email + LinkedIn links
6. Footer: "Full terminal experience on desktop ↗"

### Styling
Same dark background (`bg-black`), same cyan/green palette. Cards use `border
border-cyan-500/30 rounded-lg p-4`. No animations heavier than `opacity` transitions.

### Component
`src/components/layout/MobileLayout.tsx`

In `page.tsx`:
```tsx
if (isMobile) return <MobileLayout projects={projects} experience={experience} education={education} />;
```
Rendered before the main terminal page JSX.

---

## Architecture Summary

```
page.tsx                              (TopNav lives here, not layout.tsx)
├── <TopNav />                        (new — always visible on desktop)
├── <ScrollWorld />                   (new — desktop only, top of page)
│   └── scrub-engine.js mounted via useEffect
├── [existing hero + typewriter]
│   └── [new] Resume CTA buttons
├── [existing terminal + CommandInterface]
│   └── [new] auto-boot dk-command event on mount
└── <ContentDisplay />
    └── [new] case 'quant_spotlight'
```

On mobile (< 768px):
```
page.tsx → <MobileLayout />          (new — replaces everything above)
```

---

## File Changes

| File | Change |
|---|---|
| `src/components/scroll/ScrollWorld.tsx` | New — mounts scrub engine |
| `src/components/navigation/TopNav.tsx` | New — slim nav bar |
| `src/components/layout/MobileLayout.tsx` | New — mobile card layout |
| `src/app/page.tsx` | Add TopNav, ScrollWorld, auto-boot effect, Resume CTA, MobileLayout gate (TopNav lives here, not layout.tsx, so it is absent when MobileLayout renders) |
| `src/components/terminal/CommandInterface.tsx` | Add dk-command event listener |
| `public/scroll-world/` | New dir — stills (.webp) + clips (.mp4) + scrub-engine.js |
| `public/resume.pdf` | Resume file (user provides) |

---

## Out of Scope

- Redesigning the terminal or command routing
- Changing the dark theme or color palette
- Adding new content data (projects, experience, education stay as-is)
- Matrix rain, neural blob, text adventure, system status — untouched
- i18n changes

---

## Success Criteria

- Recruiter can find Projects, Experience, and Resume download within 5 seconds of landing
  without typing a command
- Quant/finance work is the first content visible in the terminal on load
- Scroll-world plays smoothly on desktop Chrome/Safari/Firefox at 60fps
- Mobile renders a usable card layout (no broken terminal UI on phones)
- All existing terminal commands and easter eggs continue to work unchanged
