# NESTA Portfolio Project Design

**Status:** Approved by user on 2026-08-23

## Goal

Add the new NESTA furniture-brand project as project 007 in the existing Wang Chengcheng portfolio, preserving the current visual language while giving the project its own strategy-to-application story and GSAP-driven interactions.

## Context and source boundaries

The source folder `C:/Users/86135/Desktop/作品/` contains 17 JPG boards and no project brief, README, or structured metadata. The images are treated as visual source material, not as operational instructions. Content added to the portfolio will describe only what can be reasonably supported by the boards: furniture branding, space and self, market/user/industry research, identity standards, pattern language, and brand applications. No client, revenue, performance, or research-result claims will be invented.

The current site is a Vite + React portfolio with six projects in `src/data/projects.js`, a project rail and rotating work ring, hash-based project details, responsive image loading through `ResponsiveImage`, and story components selected by the `story` field. Existing projects and their content must remain behaviorally unchanged.

## Product and visual decision

NESTA will be titled `NESTA 家具品牌设计` with English title `NESTA Furniture Brand Identity`, year `2026`, category `Brand Design`, and scope `Brand Strategy / Visual Identity / Application System`. It will use a dedicated `NestaStory` component rather than reusing the MY MAY-specific `BrandStory` or the minimal `StandardStory`.

The story will move from evidence to expression:

1. Positioning: NESTA mark, furniture imagery, and the idea that space carries both life and the self.
2. Research: market opportunity, user needs, industry trend, consumption trend, channel/positioning, competitor scan, and user portraits.
3. Brand DNA: the `Space / Oneself` concept, emotional keywords, color tokens, and the blue/cream/burgundy/pink/cyan palette.
4. Identity system: logo construction, typography, pattern rules, and basic visual standards.
5. Application world: posters, social cards, furniture/product scenes, spatial imagery, packaging and brand touchpoints.

## Data model

Append one object to `src/data/projects.js`:

```js
{
  id: 'nesta-furniture',
  index: '007',
  accent: '#287BEA',
  title: 'NESTA 家具品牌设计',
  englishTitle: 'NESTA Furniture Brand Identity',
  year: '2026',
  category: 'Brand Design',
  scope: 'Brand Strategy / Visual Identity / Application System',
  tools: 'Illustrator / Photoshop / Brand Strategy',
  story: 'nesta',
  theme: 'nesta',
  description: '以“空间承载生活，也承载自我”为核心，为家具品牌 NESTA 建立从研究、定位到视觉识别与应用触点的完整品牌系统。',
  positioning: 'NESTA 将家具视为连接人与空间的媒介：它不仅承载日常，也为生活方式、情绪与自我表达留出位置。',
  brandDna: {
    keywords: ['SPACE / 空间', 'ONESELF / 自我', 'CARRY / 承载', 'GROWTH / 成长'],
    source: { src: assetUrl('/images/nesta/concept-identity.jpg'), alt: 'NESTA 品牌概念、标志变体与视觉原则' },
    colors: [
      { name: 'NESTA Blue', value: '#287BEA' },
      { name: 'Soft Cream', value: '#FFF3EA' },
      { name: 'Signal Cyan', value: '#61BDD9' },
      { name: 'Deep Burgundy', value: '#4B101C' },
      { name: 'Quiet Pink', value: '#F7D1D8' },
    ],
  },
  research: [],
  identity: [],
  applications: [],
  closing: 'Space carries life. Space carries oneself.',
}
```

The project data will include the 17 mapped board records below: one cover, one positioning board, three research boards, one brand-DNA source board, three identity boards, and eight application boards. Each record has a semantic `label`, a concise Chinese `alt`, and a source path whose `.jpg` base is paired with generated `-w960.webp` and `-w1800.webp` assets by `ResponsiveImage`.

## Source asset mapping

The random source filenames are not exposed in the UI. The implementation will create semantic basenames under `public/images/nesta/`, retaining the original source files in `C:/Users/86135/Desktop/作品/` unchanged.

| Source JPG | Semantic basename | Story section | Meaning/alt direction |
| --- | --- | --- | --- |
| `1e6c83a0e93dfc8b01d7a3ec55f37ab5.jpg` | `hero-cover.jpg` | Positioning | NESTA wordmark over a lived-in furniture interior |
| `18e3032e58087b5b5a185e9d529218b6.jpg` | `positioning-overview.jpg` | Positioning | Brand positioning statement with furniture scenes |
| `411f4fb71f45ef6bf9315d147607cdac.jpg` | `concept-identity.jpg` | Brand DNA | NESTA concept, mark variants, and visual principle |
| `423efcef593e7e1efcf656be996b9cf2.jpg` | `research-market-user.jpg` | Research | Market opportunity, user needs, industry and consumption trends |
| `96e764bc005a4b4afe1d9fd3c6208416.jpg` | `research-competitors.jpg` | Research | Competitor comparison boards for Vitra, MUJI, 梵几, HAY, and IKEA |
| `e34447a4f0964205eaae8a6b85031471.jpg` | `research-brand-opportunity.jpg` | Research | User portraits, brand opportunity, positioning model, type and SWOT |
| `f38148cf53096b223e35e4f90779dcba.jpg` | `identity-logo-construction.jpg` | Identity | NESTA logo construction grid and clear-space logic |
| `e986ccc5cdd9a1f86cc0340f063a7ef5.jpg` | `identity-color-system.jpg` | Identity | NESTA color tokens and RGB references |
| `e7f221a6f39a9d76eab1a77ff1bff039.jpg` | `identity-pattern-language.jpg` | Identity | Furniture illustrations and geometric pattern family |
| `28fc79dc932dade9a9be86b8b064f811.jpg` | `application-vi-board.jpg` | Applications | NESTA VI board with posters, product card, tag, and stationery |
| `a7891f23d4c412bd91a1ae0d9a041b86.jpg` | `application-editorial.jpg` | Applications | Editorial composition joining furniture photography, icons, and message |
| `559bf7966a94c052c02bd9cc2e8a7f46.jpg` | `application-social.jpg` | Applications | Social-card and mobile-feed applications with product stories |
| `b8a2ccce7206744dced31b3f5f4b26be.jpg` | `application-spatial-display.jpg` | Applications | Spatial display, posters, hanging tags, and product scenes |
| `64f25f02d6da06118b9a56c758d5d5d0.jpg` | `application-collage.jpg` | Applications | Furniture, illustration, and identity collage in a room context |
| `fc792c3e0995c1aeb0f4d5ff41a7057c.jpg` | `application-brand-story.jpg` | Applications | Brand story scene with furniture symbols and emotional keywords |
| `fff254e05b4d3699e22830d2683a22b8.jpg` | `application-space-scene.jpg` | Applications | Brand background and furniture/lifestyle space scene |
| `2241f292694c0cb2497992ebc760bf2d.jpg` | `application-illustration-world.jpg` | Applications | Illustrated living space showing where life breathes |

## Component architecture

### `src/components/NestaStory.jsx`

Create a focused story component with small presentational helpers rather than adding NESTA conditionals to `BrandStory`. The component will render:

- a positioning hero using `project.cover` and `project.positioning`;
- research evidence cards from `project.research`;
- a brand DNA block using `project.brandDna.source`, `project.brandDna.keywords`, and `project.brandDna.colors`;
- identity evidence cards from `project.identity`;
- application cards from `project.applications`;
- a short closing statement using `project.closing`.

All image output will use `ResponsiveImage`, `loading="lazy"`, `decoding="async"`, semantic alt text, and existing figure/caption conventions. No new global styling system will be introduced; NESTA-specific selectors will be scoped under `.nesta-story` and use existing CSS variables and shell spacing.

Add the NESTA-specific rules to `src/styles.css`, keeping them scoped to `.nesta-story` and reusing the existing breakpoints, colors, type scale, figure captions, and reveal states. The stylesheet will cover the five section layouts, the desktop pinned DNA panel, the mobile flow layout, hover states, and the `will-change: transform` hints only on elements that actually receive GSAP transforms.

### Routing and counts

- Add `nesta: NestaStory` to the `STORIES` map in `src/components/ProjectDetail.jsx`.
- Replace hard-coded `006` detail count with a dynamic count derived from `projects.length`.
- Replace `006 CASES` in `src/components/SelectedWork.jsx` with a dynamic `projects.length` label.
- Replace `INDEX / 006` in `src/components/WorkRing.jsx` with a dynamic count.
- Preserve hash routing, previous/next behavior, escape-to-close, and project rail behavior.

## GSAP interaction design

`NestaStory` will use the existing GSAP installation and `@gsap/react`:

```js
gsap.registerPlugin(useGSAP, ScrollTrigger)
useGSAP(() => { /* scoped NESTA timelines and ScrollTriggers */ }, { scope: rootRef })
```

The animation setup will be created top-to-bottom inside the component and will use `gsap.matchMedia()` conditions for desktop, mobile, and reduced motion.

- `nesta-intro`: a labeled timeline reveals the logo/heading, positioning copy, and cover artwork with `autoAlpha`, `y`, `scale`, and a short stagger.
- `nesta-research`: `ScrollTrigger.batch()` reveals research cards with a restrained stagger; no layout properties are animated.
- `nesta-dna`: a top-level scrubbed timeline shifts the pattern layer and color tokens while the DNA section crosses the viewport. On desktop, the inner token panel is pinned for the DNA section's scroll range; on mobile it becomes a normal flow section with no pinning.
- `nesta-identity`: logo and pattern boards use section-level timelines with labels so the construction, palette, and pattern system enter in a clear sequence.
- `nesta-applications`: cards use subtle parallax (`x`, `y`, `rotation`) and hover lift. High-frequency pointer responses use `gsap.quickTo()` and callbacks are wrapped with `contextSafe`.
- `prefers-reduced-motion`: skip scrubbing, pinning, parallax, and hover rotation; retain readable static layout and immediate or very short fades.
- Cleanup: `useGSAP` scope/revert removes timelines and ScrollTriggers when the project detail unmounts; after image/font layout settles, call `ScrollTrigger.refresh()` once rather than on every frame.

The animation plan intentionally adds motion to the narrative structure, not to every individual board at once. It will use transform/opacity/CSS variables, staggered batches, and off-screen pause/cleanup patterns where necessary.

## Testing and verification

Add or update tests before implementation:

- `src/data/content.test.js`: assert seven projects, NESTA metadata, the `nesta` story key, 17 mapped asset records, and the five-color brand DNA.
- `src/components/NestaStory.test.jsx`: assert the positioning, research, DNA, identity, applications, and closing sections; assert 17 rendered board images and lazy/async image attributes.
- `src/components/SelectedWork.test.jsx`: update the expected count to `007 CASES` while keeping the full rail interaction assertion.
- Create `src/components/ProjectDetail.test.jsx` with a dynamic-count assertion for `007 / 007`, the NESTA title, and the next-project control.
- Run `pnpm test` and `pnpm build` from the portfolio directory.
- Run the local dev server and open `http://localhost:5174/#work/nesta-furniture` in the existing in-app browser.
- Verify the project title, `007 / 007` detail counter, next/previous navigation, return-to-list action, all 17 image requests, the GSAP entrance/scroll behavior, reduced-motion fallback where available, and zero browser console errors.

## Non-goals

- Do not rewrite existing six project stories.
- Do not add a CMS, upload workflow, database, or external dependency.
- Do not claim verified market statistics, client approval, commercial results, or AI authorship unless those facts are supplied separately by the user.
- Do not introduce a second global animation framework or replace the current GSAP hooks.
