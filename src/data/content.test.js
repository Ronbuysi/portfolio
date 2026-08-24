import { describe, expect, test } from 'vitest'
import { profile } from './profile'
import { projects } from './projects'

describe('public content', () => {
  test('never publishes a Chinese mobile number or portrait field', () => {
    const content = JSON.stringify({ profile, projects })
    expect(content).not.toMatch(/\b1[3-9]\d{9}\b/)
    expect(content).not.toMatch(/"(?:avatar|portrait|证件照)"\s*:/i)
  })

  test('uses the verified public email and all real projects', () => {
    expect(profile.email).toBe('241022998@qq.com')
    expect(projects).toHaveLength(7)
    expect(projects[0].gallery).toHaveLength(3)
    expect(projects[1].id).toBe('sanfu-lifestyle')
  })

  test('models Sanfu as a visual campaign and Horsh as an independent poster project', () => {
    expect(projects).toHaveLength(7)
    const sanfu = projects.find((project) => project.id === 'sanfu-lifestyle')
    const horsh = projects.find((project) => project.id === 'horsh-growth')
    expect(sanfu).toMatchObject({ index: '002', category: 'Visual Campaign', story: 'campaign', theme: 'sanfu' })
    expect(horsh).toMatchObject({ index: '003', category: 'Poster Design', story: 'poster', theme: 'horsh' })
    expect(sanfu.strategy).toHaveLength(3)
    expect(sanfu.originalEvidence).toHaveLength(3)
    expect(sanfu.processPresentations).toHaveLength(2)
    expect(sanfu.extensions).toHaveLength(8)
    expect(sanfu.originalEvidence.slice(0, 3).map((item) => item.src)).toEqual([
      '/images/poster-projects/sanfu-travel.jpg',
      '/images/poster-projects/sanfu-dorm.jpg',
      '/images/poster-projects/sanfu-office.jpg',
    ])
    expect(sanfu.extensions.map((item) => item.src)).toEqual([
      '/images/sanfu-campaign/campaign-hero.png',
      '/images/sanfu-campaign/workplace-activation.png',
      '/images/sanfu-campaign/campus-activation.png',
      '/images/sanfu-campaign/city-activation.png',
      '/images/sanfu-campaign/packaging-system.png',
      '/images/sanfu-campaign/social-system.png',
      '/images/sanfu-campaign/node-window.png',
      '/images/sanfu-campaign/node-member-kit.png',
    ])
    expect(JSON.stringify(sanfu)).not.toContain('/images/sanfu-campaign/original-packaging.jpg')
    expect(JSON.stringify(sanfu)).not.toContain('/images/sanfu-campaign/original-elements.jpg')
    expect(JSON.stringify(sanfu)).not.toContain('/images/sanfu-campaign/original-numerals.jpg')
    expect(sanfu.processPresentations.map((item) => item.src)).toEqual([
      '/images/sanfu-campaign/element-lab-scene.png',
      '/images/sanfu-campaign/number-lab-scene.png',
    ])
    expect(sanfu).not.toHaveProperty('presentation')
    expect(sanfu).not.toHaveProperty('results')
    expect(sanfu).not.toHaveProperty('metrics')
    expect(horsh.posters).toHaveLength(2)
    expect(sanfu.visualLanguage.colors).toHaveLength(4)
    expect(horsh.timeline).toHaveLength(2)
  })

  test('places Daodao Bar after Horsh as a complete brand design project', () => {
    const bar = projects.find((project) => project.id === 'daodao-bar')
    const horshIndex = projects.findIndex((project) => project.id === 'horsh-growth')
    const barIndex = projects.findIndex((project) => project.id === 'daodao-bar')
    const brandIndex = projects.findIndex((project) => project.id === 'my-may-pizza')

    expect(bar).toMatchObject({ index: '004', category: 'Brand Design', story: 'bar-brand', theme: 'daodao' })
    expect(bar.brandConcepts).toHaveLength(4)
    expect(bar.identityRules).toHaveLength(4)
    expect(bar.originals).toHaveLength(9)
    expect(bar.extensions).toHaveLength(6)
    expect(bar.extensions.map((item) => item.src)).toEqual([
      '/images/daodao-bar/extensions/bar-exterior-hero.png',
      '/images/daodao-bar/extensions/bar-counter-system.png',
      '/images/daodao-bar/extensions/eleven-pm-member-kit.png',
      '/images/daodao-bar/extensions/night-campaign-system.png',
      '/images/daodao-bar/extensions/interior-wayfinding.png',
      '/images/daodao-bar/extensions/takeaway-family.png',
    ])
    expect(barIndex).toBe(horshIndex + 1)
    expect(brandIndex).toBe(barIndex + 1)
    expect(bar).not.toHaveProperty('results')
    expect(bar).not.toHaveProperty('metrics')
    expect(projects.some((project) => project.id === 'suan-ye-information')).toBe(false)
  })

  test('does not invent poster dates or campaign results', () => {
    const posterProjects = projects.filter((project) => project.story === 'poster')
    for (const project of posterProjects) {
      expect(project).not.toHaveProperty('year')
      expect(project).not.toHaveProperty('results')
      expect(project).not.toHaveProperty('metrics')
    }
  })

  test('models MY MAY as a complete brand case study', () => {
    const brand = projects.find((project) => project.id === 'my-may-pizza')
    expect(brand).toMatchObject({ index: '005', category: 'Brand Design', story: 'brand', theme: 'my-may' })
    expect(brand.originals).toHaveLength(4)
    expect(brand.extensions).toHaveLength(3)
    expect(brand.brandDna.colors).toHaveLength(3)
    expect(brand.brandDna.keywords).toHaveLength(3)
    expect(brand).not.toHaveProperty('year')
    expect(brand).not.toHaveProperty('results')
    expect(brand).not.toHaveProperty('metrics')
  })

  test('extends MY MAY with deterministic VI rules and two application systems', () => {
    const brand = projects.find((project) => project.id === 'my-may-pizza')
    expect(brand.viStandards.rules).toHaveLength(4)
    expect(brand.viStandards.logoSource).toBe('/images/my-may-brand/original-identity.jpg')
    expect(brand.viExtensions).toHaveLength(2)
    expect(brand.viExtensions.map((item) => item.src)).toEqual([
      '/images/my-may-brand/my-may-staff-kit.png',
      '/images/my-may-brand/my-may-digital-system.png',
    ])
  })

  test('models operation design as original posters, system evidence and field extensions', () => {
    const operation = projects.find((project) => project.id === 'farmers-market')
    expect(operation.story).toBe('operation')
    expect(operation.gallery).toHaveLength(3)
    expect(operation.originalSystem).toHaveLength(8)
    expect(operation.originalSystem.map((item) => item.src)).toEqual([
      '/images/operation/originals-2026/project-background.jpg',
      '/images/operation/originals-2026/visual-language.jpg',
      '/images/operation/originals-2026/material-study.jpg',
      '/images/operation/originals-2026/bag-blueprint.jpg',
      '/images/operation/originals-2026/fabric-bag-family.jpg',
      '/images/operation/originals-2026/vendor-carry-scene.jpg',
      '/images/operation/originals-2026/social-cards.jpg',
      '/images/operation/originals-2026/photo-poster-display.jpg',
    ])
    expect(operation.extensions).toHaveLength(5)
    expect(operation.extensions.map((item) => item.src)).toEqual([
      '/images/operation-market-activation.png',
      '/images/operation-digital-system.png',
      '/images/operation/extensions/market-route-wayfinding.png',
      '/images/operation/extensions/vendor-service-kit.png',
      '/images/operation/extensions/market-stamp-passport.png',
    ])
  })

  test('models TOSS DIARY as original IP evidence plus truthful AI extensions', () => {
    const ip = projects.find((project) => project.id === 'toss-diary')
    expect(ip).toMatchObject({ index: '006', category: 'IP Design', story: 'ip', theme: 'toss' })
    expect(ip.originals).toHaveLength(8)
    expect(ip.originals.map((item) => item.src)).toEqual([
      '/images/toss-diary/originals-2026/character-dna.jpg',
      '/images/toss-diary/originals-2026/expression-wordmark.jpg',
      '/images/toss-diary/originals-2026/origin-motion.jpg',
      '/images/toss-diary/originals-2026/color-sticker-language.jpg',
      '/images/toss-diary/originals-2026/packaging-blueprint.jpg',
      '/images/toss-diary/originals-2026/packaging-family.jpg',
      '/images/toss-diary/originals-2026/poster-system.jpg',
      '/images/toss-diary/originals-2026/storefront-application.jpg',
    ])
    for (const legacyPath of [
      '/images/toss-diary/original-character-system.jpg',
      '/images/toss-diary/original-expressions.jpg',
      '/images/toss-diary/original-motion.jpg',
      '/images/toss-diary/original-stickers.jpg',
      '/images/toss-diary/original-applications.jpg',
      '/images/toss-diary/original-posters.jpg',
    ]) {
      expect(ip.originals.map((item) => item.src)).not.toContain(legacyPath)
    }
    expect(ip.summerCampaign.sourceReference).toBe('/images/toss-diary/user-ai-summer-festival.png')
    expect(ip.summerCampaign.posters.map((item) => item.src)).toEqual([
      '/images/toss-diary/summer-poster-picnic.png',
      '/images/toss-diary/summer-poster-market.png',
      '/images/toss-diary/summer-poster-beach.png',
    ])
    expect(ip.summerCampaign.applications.map((item) => item.src)).toEqual([
      '/images/toss-diary/summer-pop-up-market.png',
      '/images/toss-diary/summer-picnic-kit.png',
      '/images/toss-diary/summer-beach-activation.png',
    ])
    expect(ip).not.toHaveProperty('userAiExploration')
    expect(ip.extensions).toHaveLength(4)
    expect(ip.extensions.map((item) => item.src)).toEqual([
      '/images/toss-diary/toss-hero-dark.png',
      '/images/toss-diary/toss-character-lineup.png',
      '/images/toss-diary/toss-pop-up-space.png',
      '/images/toss-diary/toss-merch-digital.png',
    ])
    expect(ip.expressionExtensions.map((item) => item.src)).toEqual([
      '/images/toss-diary/toss-expression-system.png',
      '/images/toss-diary/toss-sticker-chat.png',
    ])
    expect(ip.campaignExtensions.map((item) => item.src)).toEqual([
      '/images/toss-diary/toss-seasonal-world.png',
      '/images/toss-diary/toss-motion-storyboard.png',
    ])
    expect(ip).not.toHaveProperty('results')
    expect(ip).not.toHaveProperty('metrics')
  })

  test('models the TOSS DIARY service story in its intended sequence', () => {
    const ip = projects.find((project) => project.id === 'toss-diary')
    const serviceExtensions = ip.serviceExtensions ?? []

    expect(serviceExtensions.map((item) => item.src)).toEqual([
      '/images/toss-diary/service/toss-dusk-first-batch.png',
      '/images/toss-diary/service/toss-member-diary-kit.png',
      '/images/toss-diary/service/toss-service-handoff.png',
      '/images/toss-diary/service/toss-baker-toolkit.png',
      '/images/toss-diary/service/toss-order-progress.png',
    ])
    for (const item of serviceExtensions) {
      expect(item).toMatchObject({
        label: expect.stringMatching(/\S/),
        title: expect.stringMatching(/\S/),
        description: expect.stringMatching(/\S/),
        alt: expect.stringMatching(/\S/),
      })
    }
    expect(serviceExtensions[0].featured).toBe(true)
    expect(serviceExtensions.filter((item) => item.featured)).toEqual([serviceExtensions[0]])
  })

  test('every project defines a theme accent color for transitions', () => {
    projects.forEach((project) => expect(project.accent).toMatch(/^#[0-9a-fA-F]{6}$/))
  })

  test('models NESTA as a six-act editorial case study with 48 unique source assets', () => {
    const nesta = projects.find((project) => project.id === 'nesta-furniture')
    const groups = nesta.caseStudy
    const media = [
      groups.coldOpen.media,
      ...groups.brief.media,
      ...groups.research.evidence,
      ...groups.research.competitors.flatMap((item) => item.media),
      ...groups.strategy.media,
      ...groups.identity.flatMap((item) => item.media),
      ...groups.applications.flatMap((item) => item.media),
    ]

    expect(projects).toHaveLength(7)
    expect(nesta).toMatchObject({
      index: '007',
      title: 'NESTA 家具品牌设计',
      englishTitle: 'NESTA Furniture Brand Identity',
      year: '2026',
      category: 'Brand Design',
      story: 'nesta',
      theme: 'nesta',
    })
    expect(Object.keys(groups)).toEqual([
      'coldOpen', 'brief', 'research', 'strategy', 'identity', 'applications', 'takeaway',
    ])
    expect(groups.research.insights).toHaveLength(3)
    expect(groups.research.evidence).toHaveLength(5)
    expect(groups.research.competitors).toHaveLength(5)
    expect(groups.identity).toHaveLength(4)
    expect(groups.applications).toHaveLength(4)
    expect(media).toHaveLength(48)
    expect(new Set(media.map(({ src }) => src)).size).toBe(48)
    media.forEach(({ src, alt }) => {
      expect(src).toMatch(/^\/images\/nesta\/[a-z0-9-]+\.jpg$/)
      expect(alt.length).toBeGreaterThan(5)
    })
  })
})
