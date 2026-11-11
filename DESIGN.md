---
name: SaaS-UI
description: A precise, local-first visual editor for design systems.
colors:
  primary: "#6366F1"
  primary-hover: "#4F46E5"
  background: "#FAFAF9"
  background-secondary: "#F4F4F5"
  surface: "#FFFFFF"
  text-primary: "#18181B"
  text-secondary: "#71717A"
  text-muted: "#A1A1AA"
  border: "#E4E4E7"
  border-strong: "#D4D4D8"
  success: "#16A34A"
  warning: "#EA580C"
  error: "#DC2626"
  tier-pro: "#7C3AED"
typography:
  display:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
  "16": "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "32px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "32px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    height: "36px"
---

# Design System: SaaS-UI

## Overview

**Creative North Star: "The Instrument Panel"**

SaaS-UI looks like a precision instrument, not a dashboard. Large fields of quiet zinc let
the canvas lead; one indigo accent marks the action that matters. Type is editorial in the
marketing surface and strictly functional inside the editor. Nothing moves without a reason,
and every value that a developer might copy is set in monospace.

**Key Characteristics:**
- Neutral-dominant surfaces with a single restrained indigo accent.
- Borders and tonal separation before shadows.
- Manrope display, Inter UI, JetBrains Mono for tokens and values.
- 100–200ms motion; transform and opacity only.
- Empty states that inform rather than decorate.

## Colors

A quiet neutral system with one indigo voice and strict semantic colors.

### Primary
- **Signal Indigo** (#6366F1): primary actions, active module markers, focus rings, and
  selected states. Used on a small fraction of any screen; its rarity is the point.

### Neutral
- **Warm Paper** (#FAFAF9): application background, slightly warm to avoid clinical white.
- **Panel Zinc** (#F4F4F5): sidebars and secondary regions.
- **Pure Surface** (#FFFFFF): cards, dialogs, and inputs.
- **Ink** (#18181B): primary text.
- **Quiet Zinc** (#71717A): secondary text and metadata.
- **Muted Zinc** (#A1A1AA): placeholders and disabled text.
- **Hairline** (#E4E4E7): default borders and dividers.
- **Strong Hairline** (#D4D4D8): hover borders and structural emphasis.

### Named Rules
**The One Voice Rule.** Indigo is an action signal, never decoration. If an element is not
interactive or selected, it does not get indigo.

## Typography

**Display Font:** Manrope (with system-ui, sans-serif)
**Body Font:** Inter (with system-ui, sans-serif)
**Label/Mono Font:** JetBrains Mono (with Courier New, monospace)

**Character:** Manrope gives headings a compact, engineered geometry; Inter keeps the UI
neutral and legible; JetBrains Mono makes token values feel exact and copyable.

### Hierarchy
- **Display** (700, 40px/1.1, -0.02em): landing hero only.
- **Headline** (600, 32px/1.2, -0.01em): one per module page; never larger inside the editor.
- **Title** (600, 20px/1.3): card and section titles.
- **Body** (400, 14px/1.6): interface copy and forms.
- **Label** (500, 12px/1.4, 0.01em): form labels and metadata.
- **Mono** (400, 12px/1.5): hex values, px/rem/ms tokens, code.

### Named Rules
**The Monospace-for-Values Rule.** Any value a developer could copy is set in JetBrains Mono.

## Layout

A desktop-first editor shell: 56px header, 220px collapsible sidebar, flexible canvas, 300px
collapsible properties panel, 32px footer. Marketing uses a 1440px max container with 24px
side padding and a 4/8/12/16/24/32/48/64 spacing scale. Responsive breakpoints: 640, 768,
1024, 1280, 1536.

## Elevation & Depth

Depth is structural, not decorative. Surfaces are flat at rest and separated by 1px borders.
Shadows appear only for floating layers: dropdowns, dialogs, popovers, and the command palette.

### Shadow Vocabulary
- **Ambient low** (`0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)`): dialogs and elevated cards.
- **Ambient high** (`0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.04)`): command palette.

### Named Rules
**The Border-First Rule.** A border is the default separator. A shadow must earn its place by
lifting a floating layer.

## Shapes

Moderate, engineered corners: 4px for badges, 8px for buttons and inputs, 12px for cards and
dropdowns, 16px for dialogs, full pills only for badges and avatars. No oversized rounding.

## Components

### Buttons
- **Shape:** 8px radius, 32px default height (28px small, 36px large).
- **Primary:** Signal Indigo fill, white label, 8px × 16px padding.
- **Hover / Focus:** hover deepens to #4F46E5; focus uses a 2px indigo ring with 2px offset.
- **Secondary / Ghost:** zinc-100 fill or transparent with a zinc-100 hover; outline uses a
  #D4D4D8 border.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** Pure Surface.
- **Shadow Strategy:** flat at rest; borders only.
- **Border:** 1px Hairline.
- **Internal Padding:** 16–24px.

### Inputs / Fields
- **Style:** 1px Hairline border, Pure Surface, 8px radius, 36–40px height.
- **Focus:** indigo border plus ring.
- **Error:** #DC2626 border and message.

### Navigation
- **Style:** 220px sidebar, 56px header, 14px Inter labels, Lucide 20px icons.
- **Active:** zinc-100 background with a 1px indigo inset indicator.
- **Hover:** zinc-100 background at 120ms.

## Do's and Don'ts

### Do:
- **Do** keep indigo to actions and selection.
- **Do** use borders and tonal steps before shadows.
- **Do** set every hex, px, rem, and ms value in JetBrains Mono.
- **Do** keep motion between 100 and 200ms and respect `prefers-reduced-motion`.

### Don't:
- **Don't** use emoji as UI icons.
- **Don't** add decorative gradients or colored shadows.
- **Don't** nest cards.
- **Don't** put fake statistics, fake logos, or fake testimonials in the UI.
