// 检测低性能集成显卡（老 Intel 核显）：这类 GPU 上全屏 mix-blend-mode +
// 常驻微动画会让整页合成掉到 ~25fps。检测不到 renderer 时按"不降级"处理。
export function detectLowPowerGpu() {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return false
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = String(
      ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER) || '',
    )
    // Apple Silicon / 独显 / 新 Xe 与 Arc 都够快；老 Intel 核显（Iris Plus、HD/UHD）降级
    if (!/intel/i.test(renderer)) return false
    return !/iris xe|arc/i.test(renderer)
  } catch {
    return false
  }
}
