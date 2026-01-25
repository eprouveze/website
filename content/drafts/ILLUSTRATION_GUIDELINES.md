# Illustration Branding Guidelines

## Brand Visual Identity

These guidelines ensure consistent, professional illustrations across all website articles.

### Core Brand Elements

**Color Palette:**
- **Primary Blue**: #2563eb (accent, positive states, evidence)
- **Slate Neutrals**: slate-100 to slate-900 (backgrounds, text)
- **Success Green**: #22c55e (positive outcomes, verification, "yes" paths)
- **Warning Amber**: #f59e0b (structure, caution, intermediate states)
- **Danger Red**: #ef4444 (threats, errors, negative states)

**Typography in Images:**
- Clean sans-serif fonts (consistent with Inter)
- Minimal text—let visuals communicate
- Labels only when necessary for explanation

**Dimensions:**
- Standard: 16:9 aspect ratio (1920×1080, 2752×1536)
- Wide: 2:1 aspect ratio for diptychs and comparisons
- Minimum width: 1376px for article hero images

---

## Three Illustration Categories

### 1. Technical Diagrams

**Use for:** Process flows, system architecture, loops, decision trees

**Visual Style:**
- Light/neutral gray background (#f8fafc or similar)
- Pill-shaped or rounded rectangular nodes
- Dark headers with light content areas (blue/slate palette)
- Simple, recognizable icons (brain, wrench, eye, checkmark)
- Smooth curved arrows showing flow direction
- Green nodes/arrows for exits and positive outcomes
- Clean, vector-style artwork

**Reference:** ReAct Loop diagram

**Structure Example:**
```
- Main loop nodes: Blue pill shapes
- Decision points: Question mark icons
- Exit paths: Green arrows and nodes
- Labels: Short action phrases ("Run the tool", "Review results")
- Title: Simple text at bottom
```

---

### 2. Conceptual Illustrations

**Use for:** Metaphors, abstract concepts, defensive systems, comparisons

**Visual Subtypes:**

**A. Shield/Ring Diagrams (Dark Background)**
- Dark background (#0f172a or darker)
- Concentric rings or layers with subtle glow effects
- Color-coded layers (blue outer → amber middle → green inner)
- Central protected element with checkmark
- Threats as small, deflected elements at edges
- Semi-flat with subtle gradients and soft glow

**B. Character-Based Comparisons (Light Background)**
- Warm, soft color palette
- Friendly robot or abstract characters as stand-ins
- Side-by-side panel layout
- Visual contrast between constrained vs. free states
- Whimsical but professional

**Reference:** Defense-in-depth shields, Form vs Canvas

---

### 3. Editorial Photography

**Use for:** Personal narratives, transformation stories, before/after scenarios

**Visual Style:**
- Photorealistic, magazine/editorial quality
- Split-screen diptych with clean vertical divide
- Same subject in both panels for continuity
- Contrasting lighting: cool corporate (left) vs warm personal (right)
- Contrasting contexts: formal vs casual, observing vs creating

**Key Elements:**
- LEFT: Corporate/formal environment, harsh lighting, passive mood
- RIGHT: Personal/home environment, warm lamp light, active/creating mood
- High detail, sharp focus on subject
- No text overlays or logos

**Reference:** Fifties coding AI split

---

## Prompt Structure Template

Every illustration prompt should include these sections:

```
CONTEXT:
[What article is this for? What concept is being illustrated?]

VISUAL CONCEPT:
[High-level description of the illustration]

STRUCTURE:
[Detailed breakdown of visual elements, layout, components]

VISUAL STYLE:
[Specific style directives matching one of the three categories]

TECHNICAL NOTES:
[Dimensions, format, constraints]

DO NOT INCLUDE:
[Explicit exclusions to prevent unwanted elements]
```

---

## Quality Checklist

Before finalizing any illustration prompt:

- [ ] Does it serve the article's narrative?
- [ ] Is the visual category appropriate for the content?
- [ ] Are colors consistent with the brand palette?
- [ ] Is the aspect ratio correct (16:9 or 2:1)?
- [ ] Have you specified what NOT to include?
- [ ] Is the level of detail appropriate (not cluttered)?
- [ ] Would it work at mobile scale?

---

## Common Anti-Patterns to Avoid

- Generic stock photo aesthetics
- Excessive icons or visual clutter
- Cartoon-like or overly playful styles (unless appropriate)
- Text-heavy images
- Gradients that don't serve a purpose
- Human figures unless the article is personal/narrative
- Corporate logos or brand marks
- Inconsistent icon styles within one image
