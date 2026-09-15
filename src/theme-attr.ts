import { useEffect } from 'react'
import { themeById } from './data/themes'
import { themePageByTheme } from './data/pages'

/**
 * 路由主题属性与 SEO 同步 Hook：
 * 1. 进入时把 data-theme 写入 <html>，触发 480ms 色彩过渡平滑呼吸；
 * 2. 动态同步移动端地址栏 meta[name="theme-color"]；
 * 3. 动态维护符合 Hallmark 规范的精细 document.title（提升 A11y 与书签可读性）。
 */
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

    // 动态设置各路由专属标题
    const theme = themeById.get(id)
    const page = themePageByTheme.get(id)
    const pathname = window.location.pathname

    if (pathname === '/' || id === 'grid' && pathname === '/') {
      document.title = 'Hallmark 中文站 · 让 AI 写的界面看起来像是人做的'
    } else if (pathname === '/about' || id === 'almanac' && pathname === '/about') {
      document.title = 'Hallmark · 关于这个站 · 来源与验收'
    } else if (pathname === '/custom' || id === 'custom') {
      document.title = 'Hallmark · Custom 分支 · 深度定制协议'
    } else if (theme) {
      const discipline = page?.discipline ? ` · ${page.discipline}` : ''
      document.title = `Hallmark · ${theme.name} (${theme.zh})${discipline}`
    }

    const timer = window.setTimeout(
      () => root.classList.remove('theme-shift'),
      480,
    )
    return () => window.clearTimeout(timer)
  }, [id])
}
