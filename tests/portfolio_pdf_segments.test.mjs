import { describe, expect, it } from 'vitest'

import { SEGMENTS } from '../scripts/portfolio_pdf_segments.mjs'

describe('desktop website PDF segments', () => {
  it('covers every major website story module', () => {
    const labels = SEGMENTS.map((segment) => segment.label).join('\n')
    const required = [
      'Hero', 'Profile', 'Operation header', 'Operation grammar', 'Operation system evidence', 'Operation extension',
      'Packaging header', 'Packaging element lab', 'Packaging structure',
      'Sanfu header', 'Sanfu strategy', 'Sanfu grammar', 'Sanfu activation',
      'Horsh header', 'Horsh originals', 'Horsh timeline',
      'Daodao header', 'Daodao concept', 'Daodao identity', 'Daodao originals', 'Daodao extensions',
      'Brand header', 'Brand positioning', 'Brand standards', 'Brand extension',
      'IP header', 'IP foundation', 'IP evidence', 'IP service', 'IP summer campaign',
      'IP expression system', 'IP seasonal motion', 'Strengths', 'Contact',
    ]

    for (const label of required) expect(labels).toMatch(new RegExp(label))
    expect(SEGMENTS.length).toBeGreaterThanOrEqual(35)
    expect(SEGMENTS.every((segment) => segment.selector || (segment.from && segment.to))).toBe(true)
  })

  it('captures the IP service section between evidence and summer campaign', () => {
    const labels = SEGMENTS.map((segment) => segment.label)
    const evidenceIndex = labels.indexOf('IP evidence')
    const serviceIndex = labels.indexOf('IP service')
    const summerIndex = labels.indexOf('IP summer campaign')

    expect(serviceIndex).toBe(evidenceIndex + 1)
    expect(summerIndex).toBe(serviceIndex + 1)
  })

  it('captures operation system evidence between grammar and extensions', () => {
    const labels = SEGMENTS.map((segment) => segment.label)
    const grammarIndex = labels.indexOf('Operation grammar')
    const systemIndex = labels.indexOf('Operation system evidence')
    const extensionIndex = labels.indexOf('Operation extension')

    expect(systemIndex).toBe(grammarIndex + 1)
    expect(extensionIndex).toBe(systemIndex + 1)
  })

  it('uses PDF matte instead of overlapping browser-source padding', () => {
    expect(SEGMENTS.every((segment) => !Object.hasOwn(segment, 'pad'))).toBe(true)
    expect(SEGMENTS.every((segment) => Object.hasOwn(segment, 'matte'))).toBe(true)
  })

  it('groups repeated grid items by desktop row before capture', () => {
    const repeatedSegments = SEGMENTS.filter((segment) => segment.all)
    expect(repeatedSegments.length).toBeGreaterThan(0)
    expect(repeatedSegments.every((segment) => segment.rowGroup === true)).toBe(true)
  })

  it('keeps the selected-work label with the first project header', () => {
    expect(SEGMENTS.some((segment) => segment.label === 'Selected work index')).toBe(false)
    const operationHeader = SEGMENTS.find((segment) => segment.label === 'Operation header')
    expect(operationHeader).toMatchObject({
      from: '#work > .section-head',
      to: '#farmers-market > .operation-story',
    })
  })
})
