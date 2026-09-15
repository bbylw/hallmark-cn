import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { themes } from '../data/themes'

/**
 * 全局 T 键换肤 Hook：
 * 1. 监听全局 keydown 't' / 'T'（忽略输入框等交互控件）；
 * 2. 主题页内按 T 直接无刷新流转至下一个主题路由；
 * 3. 首页或关于页按 T 动态切换 HTML data-theme 并展示轻量状态提示；
 * 4. 提供手动的 cycleTheme 回调供 UI 按钮触发。
 */
export function useThemeSwitch() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeToast, setActiveToast] = useState<string | null>(null)

  const cycleTheme = useCallback(() => {
    const root = document.documentElement
    const currentId = root.dataset.theme || 'grid'
    const currentIndex = themes.findIndex((t) => t.id === currentId)
    const nextTheme = themes[(currentIndex + 1) % themes.length]

    // 如果当前处于特定主题页 (/themes/:id)，直接路由导航到下一个主题
    if (location.pathname.startsWith('/themes/')) {
      navigate(`/themes/${nextTheme.id}`)
      setActiveToast(`${nextTheme.name} · ${nextTheme.zh}`)
      return
    }

    // 在其他页面（如首页、关于页、Custom 分支），直接原地切换主题令牌
    root.classList.add('theme-shift')
    root.dataset.theme = nextTheme.id

    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      const paper = getComputedStyle(root).getPropertyValue('--hm-paper').trim()
      if (paper) meta.setAttribute('content', paper)
    }

    window.setTimeout(() => root.classList.remove('theme-shift'), 480)

    setActiveToast(`${nextTheme.name} · ${nextTheme.zh}`)
  }, [location.pathname, navigate])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // 当在输入控件内输入时，不拦截按键
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return
      }

      // 按 T 或 t 键触发换肤
      if ((e.key === 't' || e.key === 'T') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        cycleTheme()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cycleTheme])

  // Toast 提示 1.8 秒后自动淡出
  useEffect(() => {
    if (!activeToast) return
    const timer = window.setTimeout(() => setActiveToast(null), 1800)
    return () => window.clearTimeout(timer)
  }, [activeToast])

  return { cycleTheme, activeToast }
}
