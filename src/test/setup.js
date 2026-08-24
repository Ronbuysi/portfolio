import '@testing-library/jest-dom/vitest'

// JSDOM has no WebGL implementation; decorative shader components should use
// their static fallback unless an individual test explicitly provides a context.
HTMLCanvasElement.prototype.getContext = () => null

// JSDOM lacks matchMedia; GSAP plugins call it during registration.
// Reduced-motion reports as matching so animation hooks stay inert in tests.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: String(query).includes('prefers-reduced-motion'),
    media: String(query),
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })
}
