import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8')

describe('static hosting deployment', () => {
  it('builds with relative entry assets for repository subdirectories', () => {
    const config = read('vite.config.js')
    expect(config).toMatch(/base:\s*['"]\.\/['"]/)
  })

  it('prefixes public image and video paths with the Vite base URL', () => {
    const projects = read('src/data/projects.js')
    const about = read('src/components/About.jsx')
    const hero = read('src/components/Hero.jsx')
    const heroScene = read('src/data/heroScene.js')

    expect(projects).toContain("import { assetUrl } from '../utils/assetUrl'")
    expect(projects).not.toMatch(/:\s*['"]\/images\//)
    expect(about).toContain('assetUrl(')
    expect(hero).toContain("from '../data/heroScene'")
    expect(heroScene).toContain('assetUrl(')
    expect(heroScene).not.toMatch(/:\s*['"]\/images\//)
  })
})
