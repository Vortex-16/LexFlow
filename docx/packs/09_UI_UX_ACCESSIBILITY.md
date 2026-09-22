# UI/UX + Accessibility Specification

## Visual direction

The UI should feel closer to a serious productivity tool or editorial research product than a flashy AI demo.

### Do

- white/near-white surfaces
- near-black primary text
- muted gray borders
- one restrained accent
- 8-point-ish spacing rhythm
- compact controls
- wide readable text column
- source references beside claims
- clear active states

### Avoid

- neon
- excessive blur
- excessive gradients
- huge glowing AI orbs
- noisy dashboards
- unnecessary motion
- decorative background effects that compete with content

## Interaction model

### Ask screen

A single prominent input area with context controls beneath it:

`Question`
`Jurisdiction`
`Document (optional)`
`Date/context (optional)`

### Answer screen

Use a predictable reading order:

1. answer summary,
2. explanation,
3. important assumptions,
4. citations/evidence,
5. next steps,
6. escalation note.

### Evidence panel

Make evidence easy to inspect without forcing the user through another page.

## Responsive behavior

Desktop:

- two-column answer/evidence layout where helpful.

Tablet:

- stacked or proportionally compressed layout.

Mobile:

- single-column,
- sticky primary action only when it helps,
- evidence opens in a bottom sheet/dialog,
- comparison views become vertically stacked.

## Accessibility

Target WCAG 2.2 AA practices where feasible.

Required:

- semantic headings,
- keyboard navigation,
- visible focus indicator,
- accessible labels,
- sufficient text contrast,
- no color-only meaning,
- reduced-motion support,
- accessible error messages,
- upload control usable by keyboard and screen readers,
- dialogs with focus management,
- loading states that are announced appropriately.

## Content accessibility

Legal explanations should avoid dense walls of jargon.

Prefer:

- short paragraphs,
- explicit definitions,
- clear clause labels,
- “What this means” language,
- links to the evidence.

Do not remove precision merely to make the copy simpler; explain complex terms instead.
