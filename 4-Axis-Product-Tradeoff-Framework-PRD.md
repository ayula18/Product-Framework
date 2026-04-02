# PRD: The 4-axis product tradeoff framework — interactive 3D website

---

## 1. Concept overview

This is a single-page interactive website that visualizes a product development tradeoff framework. The core idea is an evolution of the classic "Iron Triangle" (money, time, quality — pick 2, sacrifice 1) with two key extensions:

1. **A 4th axis: EQ (emotional quotient)** — the team's intent, care, and emotional investment. This is NOT a 4th resource to trade off. It operates as a **multiplier** on a different plane (the z-axis) that determines how much value you extract from whatever resources you have.

2. **Shadow dimensions** — every visible constraint has a hidden, compounding capability on its opposite side. When you sacrifice a visible axis, you also lose its shadow capability. This is the hidden cost most leaders miss.

The website's centerpiece is a **3D interactive graph** showing all 4 axes with their shadow sides. Users can click on any of the 3 resource axes (money, time, quality) to "sacrifice" it, triggering an animation on the 3D graph and revealing the full tradeoff analysis.

---

## 2. The framework content (source of truth)

### 2.1 The four axes

Each axis has a **visible face** (the resource you manage) and a **shadow face** (the compounding capability it secretly builds). The shadow is drawn as a dashed/dotted line extending in the opposite direction of the solid axis.

#### Axis 1: Money (color: amber/gold)

- **Visible face:** Budget, capital, runway — the fuel that keeps the machine running.
- **Shadow face — Optionality:** Money buys you the freedom to pivot, run parallel bets, and survive being wrong. It's not just fuel — it's the right to change direction. When you sacrifice money, every bet becomes all-in. You can't afford to be wrong. You lose the ability to explore.

#### Axis 2: Time (color: blue)

- **Visible face:** Speed, deadlines, iteration cycles — founders protect this above all because if they don't move fast, someone else will.
- **Shadow face — Learning:** Time isn't just duration — it's iteration cycles. Each cycle is a loop of build → measure → learn. More time = more loops = better product-market fit. When you sacrifice time, you're shipping assumptions, not validated solutions. You may be moving fast but in the wrong direction.

#### Axis 3: Quality (color: teal/green)

- **Visible face:** Polish, reliability, craft — the standard your product holds itself to.
- **Shadow face — Craft:** The pursuit of quality transforms the team itself. Teams that aim high develop taste, standards, and pride that compound across every product they build. When you sacrifice quality, the hidden cost isn't just a worse product — it's that the team never develops craft. And you can't bolt that on later. Teams that ship garbage for two years don't magically become craftspeople when you finally have the budget. The rot is cultural.

#### Axis 4: EQ — Emotional quotient (color: purple)

- **Visible face:** The team's intent, care, and emotional investment in building the product. This axis is the vertical z-axis — it sits on a different plane from the resource triangle.
- **Shadow face — Resilience:** Emotionally invested teams don't just work harder — they survive harder. They push through the valley of despair where mercenary teams quit. The hidden value of EQ isn't just motivation — it's endurance under uncertainty.
- **Important:** EQ is NOT a resource you sacrifice. It is the multiplier that determines which sacrifice among the other three is survivable.

### 2.2 The decision rule

> Your team's EQ determines which sacrifice is survivable.

High-EQ teams can temporarily sacrifice quality without losing craft — they carry the standard internally and self-correct. They know they're shipping something imperfect, and it bothers them, and that discomfort is productive.

Low-EQ teams cut quality and don't even notice. That's where permanent damage happens.

### 2.3 Why EQ sits on a different axis

Money, time, and quality are **resource constraints** — you allocate them. EQ is a **multiplier** — it determines how much value you extract from whatever resources you have, and which sacrifices your team can absorb without permanent damage. This is why it's the z-axis piercing through the resource triangle plane.

### 2.4 Tradeoff consequences (content for each sacrifice scenario)

#### When you sacrifice money:

- **Visible cost:** Smaller budget, fewer resources, tighter constraints across the board.
- **Hidden cost — you lose optionality:** You can't pivot. You can't run two experiments simultaneously. You can't afford to be wrong. Every single bet becomes all-in. The margin for error disappears.
- **EQ factor:** High-EQ teams can operate lean because intrinsic motivation replaces what money would buy. They find creative workarounds, they hustle, they build with less. Low-EQ teams under resource pressure fragment and disengage — the best people leave first.
- **When this sacrifice works:** Early-stage startups with a clear thesis and a team that believes deeply in the mission. You're trading optionality for focus — and that can be powerful if you're pointed in the right direction.
- **When this sacrifice kills you:** When you're still searching for product-market fit. Without optionality, you can't course-correct. You'll run out of runway before you find the answer.

#### When you sacrifice time:

- **Visible cost:** Rushed launches, compressed timelines, fewer iteration cycles, less room for reflection.
- **Hidden cost — you lose learning:** Fewer build-measure-learn cycles means you're shipping assumptions, not validated solutions. You're moving fast but possibly in the wrong direction. Speed without learning is just velocity — impressive but directionless.
- **EQ factor:** High-EQ teams maintain learning even at speed. They notice signals others miss, they run lightweight experiments in the margins, they stay curious under pressure. They debrief even when exhausted. Low-EQ teams just ship and forget — they move fast but learn nothing from each cycle.
- **When this sacrifice works:** Almost never in a startup context. The leader's insight was right: founders must move fast. Time is the one axis most founders instinctively protect because competitive pressure demands it. If you're not iterating fast, someone else is.
- **When this sacrifice kills you:** When you need to find product-market fit. Ironically, taking more time often gets you there faster because each iteration cycle teaches you something.

#### When you sacrifice quality:

- **Visible cost:** Rougher product, more bugs, lower polish, technical debt accumulation, user experience compromises.
- **Hidden cost — you lose craft:** Teams that ship garbage for two years don't magically become craftspeople when you finally have budget. The rot is cultural. Standards degrade. Taste atrophies. People who care about craft leave. What remains is a team that doesn't know the difference between good and bad work — and that's almost impossible to reverse.
- **EQ factor:** This is where EQ matters most. A high-EQ team can ship imperfect work and it bothers them — that discomfort is productive. They keep an internal standard even when the output doesn't reflect it yet. They come back and fix things. They write the "we'll clean this up" ticket and actually do it. A low-EQ team cuts quality and doesn't even notice. They normalize mediocrity. That's where permanent cultural damage happens.
- **When this sacrifice works:** When your team has high EQ and you're racing to validate a hypothesis. Ship the MVP, learn from it, come back and fix it — but only if the team genuinely carries the internal standard.
- **When this sacrifice kills you:** When your team has low EQ. The sacrifice becomes permanent. Quality never recovers because no one remembers what good looked like.

---

## 3. Visual design and UI/UX specification

### 3.1 Overall aesthetic

- **Dark theme** — deep black or very dark charcoal background (#0A0A0F or similar). The darkness makes the glowing axes pop.
- **Minimal, editorial typography** — clean sans-serif font (Inter, DM Sans, or similar). Lightweight font weights for body, medium for headings. No heavy/bold anywhere except emphasis moments.
- **Neon-glow aesthetic on the 3D graph** — the axes should have a subtle luminous glow in their respective colors. Not overdone cyberpunk neon — more like refined, subtle light emission.
- **Generous whitespace** — let every section breathe. Don't crowd content.
- **Glass-morphism for cards/panels** — when tradeoff analysis panels appear, use frosted glass effect (background blur, slight transparency, subtle border).
- **Smooth, fluid animations everywhere** — every state change should feel buttery. Easing curves: ease-out for entrances, ease-in-out for transitions. Nothing should snap or jump.

### 3.2 Color system

| Element | Color | Hex suggestion |
|---------|-------|----------------|
| Money axis + accents | Amber/Gold | #F59E0B / #FBBF24 |
| Time axis + accents | Blue | #3B82F6 / #60A5FA |
| Quality axis + accents | Teal/Green | #14B8A6 / #2DD4BF |
| EQ axis + accents | Purple | #8B5CF6 / #A78BFA |
| Shadow axes | Same colors but 40% opacity, dashed lines | |
| Background | Near-black | #0A0A0F |
| Primary text | Off-white | #E5E5E5 |
| Secondary text | Muted gray | #9CA3AF |
| Cards/panels | Semi-transparent dark | rgba(255,255,255,0.05) with backdrop-blur |

### 3.3 Page layout (top to bottom)

#### Section 1: Hero / title area

- Large title: "The 4-axis product tradeoff framework"
- Subtitle: "Every visible constraint hides a compounding capability. Your team's EQ determines which sacrifice is survivable."
- Subtle scroll indicator or "explore" prompt below

#### Section 2: The 3D interactive graph (main centerpiece)

- This is the hero of the page. A 3D coordinate system rendered with Three.js or similar (WebGL).
- **The graph structure:**
  - Center origin point — a glowing nexus where all axes meet.
  - 4 solid glowing lines radiating outward (the visible axes) in their respective colors.
  - 4 dashed/dotted lines extending in the opposite direction of each solid axis (the shadow axes) in the same color but muted/lower opacity.
  - A semi-transparent triangular plane connecting Money, Time, and Quality tips — representing the classic iron triangle. This plane should have a very subtle glass/frosted look.
  - The EQ (purple) axis pierces vertically through this triangular plane, showing it operates on a different dimension.
  - At the tip of each axis, a floating label with the axis name.
  - At the tip of each shadow axis, a floating label with the shadow name.
  - The entire 3D scene should slowly auto-rotate (very subtle, maybe 0.5-1 degree per second) so users can perceive the 3D depth. Users should also be able to drag/orbit the graph manually.

- **3 clickable sacrifice buttons** positioned near the graph or below it:
  - "Sacrifice money" (amber styled)
  - "Sacrifice time" (blue styled)
  - "Sacrifice quality" (teal styled)
  - These are pill-shaped buttons with a subtle glow matching their axis color.
  - Note: There is NO sacrifice button for EQ — it's the multiplier, not a tradeoff option.

#### Section 3: Tradeoff analysis panel (appears on sacrifice click)

- This panel slides in or fades in below the graph when a sacrifice button is clicked.
- Frosted glass card with the analysis content (from section 2.4 above).
- Structured as:
  - Panel header with the sacrifice label (e.g., "Sacrificing quality")
  - "Visible cost" section
  - "Hidden cost" section (with shadow capability name highlighted)
  - "EQ factor" section
  - "When this works" section
  - "When this kills you" section

#### Section 4: The decision rule (always visible at bottom)

- A highlighted statement card:
- "The decision rule: Before you sacrifice an axis, assess your team's EQ. High-EQ teams can temporarily sacrifice quality without losing craft — they carry the standard internally and self-correct. Low-EQ teams cannot recover from the same sacrifice. Your team's emotional quotient determines which tradeoff is survivable and which causes permanent damage."

#### Section 5: Footer

- Credits: "Framework developed through collaborative thinking."
- Subtle, minimal footer.

---

## 4. 3D graph animations (the key interactions)

### 4.1 Default / idle state

- All 4 solid axes fully visible, glowing gently in their colors.
- All 4 shadow axes visible as dashed lines at 40% opacity.
- The triangular plane (money-time-quality) is visible at ~10% opacity.
- EQ axis pierces through the plane vertically.
- Slow auto-rotation.
- Floating labels at each axis tip gently bob/float.

### 4.2 On sacrifice click (e.g., "Sacrifice quality")

This is the hero animation. It should feel dramatic but elegant.

**Phase 1 — Focus (0-500ms):**
- Camera smoothly orbits to an angle that best showcases the sacrificed axis.
- Auto-rotation pauses.

**Phase 2 — Sacrifice (500ms-1500ms):**
- The sacrificed axis (e.g., quality/teal) starts flickering/glitching — the glow destabilizes.
- The solid line visually "breaks" or dims significantly (drops to 20% opacity, loses glow).
- Particles or energy fragments scatter from the breaking axis.
- The label at the tip fades out or gets a strikethrough effect.

**Phase 3 — Shadow reveal (1500ms-2500ms):**
- The shadow axis (opposite side) of the sacrificed axis also dims/breaks — because when you lose the visible, you lose the hidden too.
- The shadow label (e.g., "Craft") briefly flares bright (drawing attention to what's being lost) then fades.
- A subtle shockwave ripple emanates from the center outward.

**Phase 4 — Remaining axes react (2500ms-3500ms):**
- The two surviving resource axes glow brighter — they're now carrying the load.
- The EQ axis pulses — a visual reminder that EQ is what determines if this sacrifice is survivable.
- The triangular plane morphs — the sacrificed vertex collapses, and the triangle becomes a line between the two remaining axes. Or alternatively, the triangle cracks/shatters at the sacrificed corner.

**Phase 5 — Analysis panel (3000ms+):**
- The tradeoff analysis panel smoothly slides in or fades up below the graph.
- Content appears with staggered text animation (each section fades in sequentially).

### 4.3 On reset / switching sacrifice

- If clicking a different sacrifice button while one is active:
  - The previously sacrificed axis rebuilds (reverse of break animation, faster — 800ms).
  - Seamlessly transitions into the new sacrifice animation.
- A "Reset" button restores all axes to full state.
- Reset animation: all axes rebuild simultaneously with a satisfying "recharge" glow effect from center outward.

### 4.4 Hover interactions on the 3D graph

- Hovering over any axis line or label should:
  - Brighten that axis slightly.
  - Show a small tooltip with the axis description.
  - The corresponding shadow axis should also brighten slightly, visually linking them.

---

## 5. Responsive design notes

- **Desktop (1200px+):** Full 3D graph with orbit controls. Graph takes up ~60% of viewport height. Sacrifice buttons positioned horizontally below the graph.
- **Tablet (768-1199px):** Slightly smaller 3D graph. Sacrifice buttons may stack.
- **Mobile (below 768px):** 3D graph still present but smaller. Touch-drag for orbit. Sacrifice buttons stack vertically. Analysis panel becomes full-width card. Consider reducing particle effects for performance.

---

## 6. Technical recommendations

- **3D rendering:** Three.js with WebGL. Use `OrbitControls` for camera interaction. Custom shaders for the glow effects on axes.
- **Animations:** GSAP (GreenSock) for the sacrifice/rebuild animations and panel transitions. Three.js built-in animation loop for continuous effects (rotation, floating labels, particle systems).
- **Particles:** Three.js particle system or `three-particle-fire` for the scatter effect when an axis breaks.
- **Typography:** CSS with `@font-face` for the chosen font. Use `mix-blend-mode` for glow text effects.
- **Scroll:** Smooth scroll between sections. Consider scroll-triggered animations for the initial page load (axes drawing themselves in as user scrolls to the graph).
- **Performance:** Keep polygon count low on the 3D scene. Use `InstancedMesh` for particles. Lazy-load the analysis panel content.

---

## 7. Content for labels and annotations on the 3D graph

### Solid axis tip labels (always visible)

| Axis | Label | Small annotation below |
|------|-------|----------------------|
| Money | Money | Budget, capital, runway |
| Time | Time | Speed, deadlines, iteration |
| Quality | Quality | Polish, reliability, craft |
| EQ | EQ | Team intent and care |

### Shadow axis tip labels (visible at lower opacity)

| Shadow axis | Label | Small annotation below |
|-------------|-------|----------------------|
| Optionality (opposite money) | Optionality | Freedom to pivot and survive being wrong |
| Learning (opposite time) | Learning | Build → measure → learn loops |
| Craft (opposite quality) | Craft | Pursuit of quality transforms the team |
| Resilience (opposite EQ) | Resilience | Teams that care survive harder |

### Center nexus label

Small text near the origin: "Your product" or "The product" — the intersection of all forces.

---

## 8. Micro-copy and writing tone

- **Voice:** Direct, confident, slightly provocative. Like a sharp product leader giving a talk, not a textbook.
- **No jargon for jargon's sake.** Every term should earn its place.
- **Use "you" and "your team" — make it personal.**
- **Short sentences. Punchy. Then a longer one for the insight.**
- **Examples from the content above:**
  - "Teams that ship garbage for two years don't magically become craftspeople."
  - "Speed without learning is just velocity — impressive but directionless."
  - "That discomfort is productive."

---

## 9. Loading / intro sequence (optional but impactful)

When the page first loads:

1. Black screen. A single glowing dot appears at center (the origin).
2. The first axis (money/amber) draws itself outward from center — a line of light extending. Its shadow axis draws in the opposite direction, dashed.
3. Second axis (time/blue) draws out. Shadow follows.
4. Third axis (quality/teal) draws out. Shadow follows.
5. The triangular plane fades in, connecting the three tips.
6. Fourth axis (EQ/purple) draws vertically through the plane — a dramatic vertical line piercing the triangle.
7. Labels fade in at each tip.
8. Title text fades in above: "The 4-axis product tradeoff framework"
9. The graph settles into its slow auto-rotation.

Total duration: 3-4 seconds. Should feel cinematic but not slow.

---

## 10. Summary of all interactive states

| User action | What happens visually | What happens in content |
|---|---|---|
| Page load | Intro animation draws all axes | Title and subtitle appear |
| Idle | Slow auto-rotation, gentle glow | All content visible |
| Hover on axis | That axis + its shadow brighten | Tooltip with axis description |
| Click "Sacrifice money" | Money axis breaks, optionality fades, remaining axes glow brighter, EQ pulses | Money tradeoff analysis panel slides in |
| Click "Sacrifice time" | Time axis breaks, learning fades, remaining axes glow brighter, EQ pulses | Time tradeoff analysis panel slides in |
| Click "Sacrifice quality" | Quality axis breaks, craft fades, remaining axes glow brighter, EQ pulses | Quality tradeoff analysis panel slides in |
| Click "Reset" | All axes rebuild with recharge glow | Analysis panel closes |
| Switch sacrifice | Previous axis rebuilds, new axis breaks | Panel content transitions |
| Drag/orbit graph | Camera follows mouse/touch input | No content change |
| Scroll to decision rule | Section comes into view | Decision rule card highlighted |

---
