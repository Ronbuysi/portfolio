# Selective Border Glow Design

## Goal

Integrate the supplied React Bits `BorderGlow` interaction as a restrained portfolio accent rather than a site-wide decoration.

## Placement

- Apply one cool blue/acid glow to the About portrait frame.
- Apply an acid/cool-white glow to each of the four Strengths cards.
- Apply a lower-intensity signal-color glow to the four operation-design visual grammar cards.
- Extend the same low-intensity treatment to narrative section frames and comparable text cards in Sanfu, information design, brand standards, IP systems, and packaging seasons.
- Do not apply glow to artwork, project imagery, metadata bars, labels, navigation, contact controls, or color swatches.

## Visual behavior

- Glow activates only when a fine pointer approaches a card edge.
- No automatic sweep animation is used.
- Rectangular portfolio geometry is retained with a subtle 0–2px radius.
- Glow intensity and background fill remain low so existing typography and imagery dominate.
- Coarse pointers and reduced-motion/reduced-transparency preferences receive a static border fallback.

## Component behavior

- `BorderGlow` accepts the supplied React Bits props and renders one outer card, one decorative edge light, and one inner content wrapper.
- Pointer movement updates edge proximity and cursor angle CSS custom properties.
- Decorative nodes are hidden from assistive technology.
- No additional package dependency is required.

## Verification

- Unit tests cover children, class names, style variables, and pointer-driven variables.
- Integration tests verify exactly one portrait glow, four strength-card glows, and four visual-grammar glows.
- CSS tests verify edge masking and touch/reduced-motion fallbacks.
- Browser QA checks visual restraint and overflow at desktop and mobile widths.
