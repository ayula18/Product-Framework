# Frontend update: Dynamic slider-controlled 3D graph

## Overview

Replace the current static sacrifice buttons with a dynamic slider control panel. Users can now slide each axis (Money, Time, Quality, EQ) between low and high, and watch the 3D graph respond in real time. The EQ slider acts as a master multiplier that expands or contracts the maximum reach of all other axes.

---

## 1. Slider panel layout

Place the slider panel directly below the 3D graph. Four horizontal sliders stacked vertically, each with its own row.

### Slider rows (top to bottom):

**Row 1: EQ slider (the master lever)**
- Label on left: "EQ" with a small tag next to it saying "multiplier"
- Color: purple (#8B5CF6)
- Range: 0 to 100
- Default starting value: 50
- This slider is visually distinct from the other three. Give it a slightly larger track, or a subtle purple glow, or a different visual weight to signal that it operates differently.
- Small helper text below this slider: "Higher EQ expands what's possible across all axes"

**Row 2: Money slider**
- Label on left: "Money"
- Color: amber/gold (#F59E0B)
- Range: 0 to 100
- Default starting value: 70
- On the right side of the slider, show the shadow label: "Optionality" in muted amber text. As the Money slider moves, show the optionality value next to it (calculated with diminishing returns formula, see math section below).

**Row 3: Time slider**
- Label on left: "Time"
- Color: blue (#3B82F6)
- Range: 0 to 100
- Default starting value: 70
- On the right side, show shadow label: "Learning" in muted blue text with its calculated value.

**Row 4: Quality slider**
- Label on left: "Quality"
- Color: teal (#14B8A6)
- Range: 0 to 100
- Default starting value: 70
- On the right side, show shadow label: "Craft" in muted teal text with its calculated value.

### Slider visual design:
- Track: thin line (3-4px) in dark gray (#2A2A2F or similar)
- Filled portion: colored in the axis color up to the thumb position
- Thumb: small circle (16-18px) in the axis color with a subtle glow matching the color
- The filled track should have a subtle gradient glow effect
- Smooth animation on all value changes (use CSS transitions or requestAnimationFrame)

### Additional controls:
- A "Reset" button (small, minimal, bottom-right of slider panel) that returns all sliders to default values with a smooth animation
- Optional: preset buttons like "Bootstrapped startup" (low money, high time, high quality, high EQ) or "VC-funded sprint" (high money, low time, low quality, medium EQ) that snap all sliders to predefined positions

---

## 2. Mathematical model: how sliders affect the graph

### 2.1 EQ as a multiplier on the frontier

EQ does not participate in the tradeoff. It scales the maximum possible reach of the other three axes.

```
eq_multiplier = 0.4 + (eq_slider_value / 100) * 1.2
```

This gives a range of 0.4x (at EQ=0) to 1.6x (at EQ=100). At EQ=50 (default), the multiplier is 1.0x (baseline).

The effective value of each resource axis on the graph:

```
effective_money = money_slider_value * eq_multiplier
effective_time = time_slider_value * eq_multiplier
effective_quality = quality_slider_value * eq_multiplier
```

Cap all effective values at 160 (so the axes don't fly off the graph). The axis length on the 3D graph is proportional to the effective value.

### 2.2 The iron triangle constraint (the tradeoff tension)

This is the core mechanic that makes it feel real. The three resource axes have a soft constraint. They resist all being high simultaneously unless EQ pushes the frontier outward.

```
budget = 200 * eq_multiplier
total = money_slider + time_slider + quality_slider

if total > budget:
    // The system is over-allocated
    // Show visual tension: the triangle plane turns reddish, or edges glow with warning
    // The axes on the graph should slightly vibrate or pulse to show strain
    // Display a small warning: "Over-allocated: your team is stretched beyond capacity"
    
    // Option A (softer): just show the warning but allow it
    // Option B (harder): auto-reduce the last-moved slider to fit within budget
    // Recommendation: use Option A. Let users over-allocate and see the tension.
    // The warning itself teaches the lesson.

if total <= budget:
    // Healthy state. No warning.
    // The triangle plane stays neutral.
```

At default EQ (50), the budget is 200. So three sliders at 70+70+70 = 210 is slightly over budget. This is intentional. At default, you feel the tension. Crank EQ up to 80, and the budget becomes 272. Now 70+70+70 = 210 fits comfortably. The tradeoff eases. That's the EQ effect made tangible.

### 2.3 Shadow axis calculations

Each shadow axis has a different mathematical relationship to its visible axis:

**Money to Optionality (diminishing returns):**
```
optionality = 100 * (1 - Math.exp(-0.03 * effective_money))
```
This means: early money gives massive optionality gains. After a point, more money barely moves optionality. Going from 0 to 30 on money gives you roughly 60 optionality. Going from 70 to 100 gives you maybe 10 more.

**Time to Learning (diminishing returns):**
```
learning = 100 * (1 - Math.exp(-0.03 * effective_time))
```
Same curve as money. First iteration cycles teach you enormously. Later cycles are incremental.

**Quality to Craft (compounding / superlinear):**
```
craft = 100 * Math.pow(effective_quality / 160, 1.8)
```
This means: early quality pursuit builds craft slowly. But sustained quality pursuit compounds. The shadow grows slowly at first then accelerates. At low quality, craft is almost zero. At high quality, craft rockets up.

**EQ to Resilience (compounding / superlinear):**
```
resilience = 100 * Math.pow(eq_slider_value / 100, 1.5)
```
Similar to craft. Resilience compounds with sustained EQ investment.

### 2.4 Shadow axis display on the graph

The shadow axis (dashed line) extends in the opposite direction of its visible axis. Its length is proportional to the calculated shadow value, NOT the raw slider value. So you will see:

- Money slider high: money axis extends far, optionality axis also extends far but slightly less (diminishing returns curve)
- Quality slider high: quality axis extends far, craft axis extends even further proportionally (compounding curve)

This visual difference between diminishing and compounding shadows is a key teaching moment.

---

## 3. How the 3D graph responds to slider changes

### 3.1 Axis lengths

Each solid axis line's length = proportional to the effective value (slider value * eq_multiplier). Each dashed shadow axis line's length = proportional to the calculated shadow value.

Animate axis length changes smoothly. When a slider moves, the corresponding axis should smoothly grow or shrink. Use lerp (linear interpolation) or spring physics for a natural feel. Don't snap.

### 3.2 Triangle plane

The semi-transparent triangle connecting Money, Time, and Quality tips should resize dynamically as the axis lengths change. When all three are high, the triangle is large. When one collapses, the triangle deforms (one vertex pulls toward center).

Color of the triangle plane:
- Normal state: white/gray at 8-10% opacity
- Over-allocated (total > budget): shifts to reddish tint at 12-15% opacity. Subtle, not alarming.
- Under-allocated: stays neutral

### 3.3 EQ axis behavior

When the EQ slider moves:
- The purple EQ axis itself grows/shrinks
- All other axes simultaneously scale (multiply by the new eq_multiplier)
- The triangle plane expands or contracts
- The entire "star" shape blooms outward (high EQ) or contracts inward (low EQ)
- The resilience shadow axis also grows/shrinks (compounding curve)

This is the most dramatic visual interaction. Dragging EQ from low to high should make the whole graph visibly open up like a flower blooming. Everything spreads out. The leader's exact observation made tangible.

### 3.4 Glow and visual intensity

Each axis line's glow intensity should scale with its value:
- Low value (0-30): dim, barely glowing, thin line
- Medium value (30-70): moderate glow, normal line weight
- High value (70-100): bright glow, slightly thicker line, more luminous

Shadow axes: always dimmer than their solid counterparts but follow the same intensity scaling at about 40-50% of the solid axis intensity.

### 3.5 Floating labels

The labels at each axis tip should:
- Move with the axis tip as it extends/contracts
- Fade out when the axis value drops below 10 (the axis is almost gone, label disappears)
- Show the current numerical value next to the name: "Money: 70" or just the number below the name

Shadow axis labels should show their calculated shadow value: "Optionality: 63" (reflecting the diminishing returns curve, not the raw input).

---

## 4. Dynamic analysis panel

Replace the current static sacrifice button system with a dynamic analysis panel that responds to the slider state.

### 4.1 State detection

The system should detect the current configuration and display the appropriate analysis:

```
// Determine which axis is lowest (the "sacrificed" one)
const axes = { money, time, quality }
const sacrificed = Object.keys(axes).reduce((a, b) => axes[a] < axes[b] ? a : b)

// Only show sacrifice analysis if one axis is significantly lower than the others
const minVal = Math.min(money, time, quality)
const maxVal = Math.max(money, time, quality)
const gap = maxVal - minVal

if (gap > 30) {
    // Clear sacrifice detected. Show the analysis panel for the lowest axis.
    showAnalysisPanel(sacrificed)
} else {
    // All roughly balanced. Show a balanced state message.
    showBalancedMessage()
}
```

### 4.2 Balanced state message

When all three resource axes are roughly equal (gap < 30):

**Heading:** Balanced configuration
**Body:** All three axes are roughly balanced. No clear sacrifice. This is stable but may mean you're not pushing hard enough on any single dimension. High-performing teams often deliberately lean into one or two axes and accept the tradeoff on the third.

### 4.3 Dynamic sacrifice analysis

When one axis is clearly lowest, show the same sacrifice analysis content we already have (visible cost, hidden cost, EQ factor, when this works, when this kills you) but add a dynamic EQ assessment at the top:

```
if (eq_slider_value >= 70) {
    eqAssessment = "Your team's EQ is high. This sacrifice is likely survivable. 
    The team will maintain internal standards and self-correct over time."
} else if (eq_slider_value >= 40) {
    eqAssessment = "Your team's EQ is moderate. This sacrifice carries risk. 
    Monitor closely for signs of cultural drift or standard erosion."  
} else {
    eqAssessment = "Your team's EQ is low. This sacrifice is dangerous. 
    The hidden capability loss may become permanent. Consider investing 
    in team EQ before making this tradeoff."
}
```

Show this EQ assessment as a colored badge or card at the top of the analysis panel:
- High EQ: green/teal tint
- Moderate EQ: amber/yellow tint
- Low EQ: red/coral tint

### 4.4 Over-allocation warning

When total > budget (all sliders pushed too high for the current EQ level):

**Heading:** Over-allocated
**Body:** Your configuration exceeds what's sustainable at your current EQ level. Something will break. Either increase EQ (invest in team care and intent) or reduce one of the three resource axes. The iron triangle is real. EQ can expand it but not eliminate it.

Show this as a warning card with a subtle red/coral border.

---

## 5. Preset configurations (optional but recommended)

Add a row of small preset buttons above or below the sliders. These snap all four sliders to predefined positions that tell a story:

**Preset 1: "Bootstrapped startup"**
- EQ: 85, Money: 25, Time: 80, Quality: 60
- Analysis: Low budget but high EQ and time. The team cares deeply and iterates patiently. Optionality is low but learning is high. This is the scrappy founder's path.

**Preset 2: "VC sprint"**
- EQ: 40, Money: 90, Time: 30, Quality: 40
- Analysis: Flush with cash but racing against the clock with a mercenary team. Money buys optionality but low time kills learning and low quality kills craft. And with low EQ, the damage may be permanent.

**Preset 3: "Craftsperson's studio"**
- EQ: 90, Money: 50, Time: 90, Quality: 95
- Analysis: High standards, patient timeline, deeply invested team. Moderate budget but EQ stretches it further. Craft and learning compound. This is how iconic products get built.

**Preset 4: "Death march"**
- EQ: 20, Money: 40, Time: 20, Quality: 30
- Analysis: Everything is low. No resources, no time, no standards, no one cares. This is what organizational decay looks like. The triangle has collapsed. Recovery requires rebuilding EQ first.

When a preset is clicked, all four sliders should animate smoothly to their target positions over about 800ms, and the 3D graph should animate in sync.

---

## 6. Visual design details for the slider panel

### Panel container:
- Background: semi-transparent dark surface (rgba(15, 15, 20, 0.7)) with backdrop-blur
- Border: subtle border (0.5px solid rgba(255,255,255,0.08))
- Border-radius: 16px
- Padding: 24px 32px
- Max-width: 600px, centered below the graph

### Individual slider row:
- Height: 48px
- Layout: [Label 80px] [Slider flex-grow] [Shadow label + value 120px]
- Label: 14px, font-weight 500, colored in axis color
- Value display: small number (13px) next to the slider thumb or at the right end
- Shadow label: 12px, muted/40% opacity version of the axis color

### EQ slider row:
- Give it a top border or separator line above it, or place it at the top with a small gap below it and a divider before the other three sliders
- Slightly wider track (5-6px vs 3-4px for others)
- The label should say "EQ" with a small "multiplier" tag in a pill badge next to it
- Consider a subtle purple gradient glow behind the entire EQ row to make it feel elevated

### Spacing between slider rows: 16px

### Preset buttons (if included):
- Small pill buttons in a horizontal row below the sliders
- Style: outlined, 12px text, rounded, subtle hover glow
- On click: all sliders animate to preset values

---

## 7. Responsive behavior

### Desktop (1200px+):
- Slider panel at 600px max-width, centered
- All four sliders visible with labels on left and shadow values on right

### Tablet (768-1199px):
- Slider panel at full width with horizontal padding
- Same layout, slightly more compact

### Mobile (below 768px):
- Slider panel full width
- Labels move above each slider instead of beside it
- Shadow labels move below each slider
- Preset buttons wrap to two rows if needed
- Consider hiding the numerical values and just showing the visual slider position to save space

---

## 8. Animation and performance notes

- All slider-to-graph updates should happen on requestAnimationFrame for smooth 60fps rendering
- Debounce or throttle slider input events if needed, but prefer direct binding for immediate responsiveness
- Use lerp (linear interpolation) for graph axis length changes:
  ```
  currentLength += (targetLength - currentLength) * 0.12
  ```
  This gives a smooth, springy feel. The axis "catches up" to the slider position rather than snapping instantly.
- Triangle plane vertices should update on the same animation frame as the axes
- Glow effects (if using shaders) should scale with a simple uniform that maps to slider value. Don't recalculate shaders per frame, just pass in the new value.
- The EQ slider should feel slightly "heavier" in its animation. When you move EQ, everything else responds but with a slight lag (100-200ms ease), making it feel like you're moving the master control and the system is responding. This reinforces the multiplier concept.

---

## 9. Summary of all interactive elements

| Element | Behavior | Affects |
|---|---|---|
| EQ slider | Moves the master multiplier | Scales all other axis lengths, expands/contracts triangle, grows/shrinks resilience shadow |
| Money slider | Sets money axis length | Money axis length, optionality shadow (diminishing curve), triangle vertex |
| Time slider | Sets time axis length | Time axis length, learning shadow (diminishing curve), triangle vertex |
| Quality slider | Sets quality axis length | Quality axis length, craft shadow (compounding curve), triangle vertex |
| Over-allocation | Auto-detected when total > budget | Warning card appears, triangle tints red |
| Sacrifice detection | Auto-detected when one axis is significantly lower | Analysis panel shows for the lowest axis with EQ assessment |
| Preset buttons | Snap all sliders to predefined values | All axes, shadows, triangle animate simultaneously |
| Reset button | Returns all sliders to defaults | Everything returns to baseline state |

---
