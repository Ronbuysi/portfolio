import { gsap } from './gsapSetup'

export const INPUT_PRIORITY = { auto: 0, scroll: 1, settle: 2, drag: 3 }
export const canWriteAngle = (next, current) => INPUT_PRIORITY[next] >= INPUT_PRIORITY[current]
export const scrollAngle = (progress, count) => -360 * gsap.utils.clamp(0, 1, progress) * Math.max(1, (count - 1) / count)
export const snapAngle = (angle, count) => gsap.utils.snap(360 / count, angle)
export const ringMode = ({ desktop, tablet }) => desktop ? '3d' : tablet ? 'track' : 'snap'

export function createRingController(initial = 0) {
  let source = 'auto'
  let angle = initial
  return {
    acquire(next) { if (canWriteAngle(next, source)) { source = next; return true } return false },
    release(current) { if (source === current) source = 'auto' },
    canWrite(next) { return canWriteAngle(next, source) },
    setAngle(next, value) { if (!canWriteAngle(next, source)) return false; source = next; angle = value; return true },
    snapshot() { return { source, angle } },
  }
}
