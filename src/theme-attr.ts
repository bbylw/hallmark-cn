import { useEffect } from 'react'

/** 每条路由自己带一套主题：进入时把 data-theme 写到 <html> 上。 */
export function useThemeAttr(id: string) {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('theme-shift')
    root.dataset.theme = id

    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      const paper = getComputedStyle(root).getPropertyValue('--hm-paper').trim()
      if (paper) meta.setAttribute('content', paper)
    }

    const timer = window.setTimeout(
      () => root.classList.remove('theme-shift'),
      480,
    )
    return () => window.clearTimeout(timer)
  }, [id])
}
