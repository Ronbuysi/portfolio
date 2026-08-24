# Hero Light Pillar Design

## Goal

Integrate the supplied React Bits LightPillar as a restrained technological light source in the portfolio hero.

## Placement and appearance

- Render LightPillar ambience only in the hero, About, and Strengths sections, never inside project stories.
- Keep the Hero pillar above the video/poster and below the dark scrim and all interface content.
- Use acid green at the top and cool blue at the bottom.
- Keep intensity, glow, and opacity low so the existing market artwork remains readable.
- About and Strengths use lower opacity and alternate pillar rotation; the contact ending stays solid acid green.
- Disable pointer interaction; the light is ambient, not a game-like control.

## Performance and fallback

- Add `three` as the only new runtime dependency.
- Use medium quality on desktop, automatic low quality on mobile/low-end devices, and a capped pixel ratio.
- Pause rendering when the document is hidden.
- Pause each instance when it leaves the viewport so only the current non-work section animates.
- Stop animation and dispose renderer, context, material, geometry, listeners, timers, and observers on unmount.
- Under reduced-motion or unavailable WebGL, show a decorative static gradient without error text.

## Verification

- Component tests cover the static fallback and container contract without requiring WebGL in JSDOM.
- Hero tests confirm exactly one decorative LightPillar layer and preserve the video fallback.
- CSS tests confirm the hero z-index order and mobile/reduced-motion behavior.
- Browser QA checks that the canvas renders behind content without horizontal overflow.
