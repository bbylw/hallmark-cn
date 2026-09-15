import { Link, useLocation } from 'react-router'
import { useThemeSwitch } from '../hooks/use-theme-switch'

const links = [
  { href: '/', label: '索引' },
  { href: '/about', label: '关于' },
  { href: '/custom', label: 'Custom 分支' },
]

/**
 * 站内导航：吸顶毛玻璃，SPA 客户端瞬时流转。
 * 当前路由以前置 accent 圆点指示，底部挂纯 CSS 滚动进度轨（零 JS 开销）。
 */
export function SiteNav() {
  const { cycleTheme } = useThemeSwitch()
  const { pathname } = useLocation()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-md">
      <div
        className="mx-auto flex h-16 items-center gap-6 px-(--page-gutter)"
        style={{ maxWidth: 'var(--page-max)' }}
      >
        <Link to="/" className="tap group flex shrink-0 items-baseline gap-2">
          <span className="display text-lg transition-colors duration-200 group-hover:text-accent-line">
            Hallmark
          </span>
          <span className="meta text-muted">24 页</span>
        </Link>
        <nav
          aria-label="站内导航"
          className="ml-auto flex items-center gap-6 sm:gap-7"
        >
          {links.map((l) => {
            const active = isActive(l.href)
            return (
              <Link
                key={l.href}
                to={l.href}
                aria-current={active ? 'page' : undefined}
                className={`tap relative text-sm transition-colors duration-200 ${
                  active
                    ? 'font-semibold text-ink'
                    : 'text-ink-2 hover:text-accent-line'
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute top-1/2 -left-2.5 size-1 -translate-y-1/2 rounded-full bg-accent-line transition-opacity duration-200 ${
                    active ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                {l.label}
              </Link>
            )
          })}
          <button
            type="button"
            onClick={cycleTheme}
            className="tap flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink"
            title="点击或按 T 键循环切换 21 套主题"
            aria-label="按 T 键快速换肤"
          >
            <span className="kbd">T</span>
            <span className="hidden sm:inline">换肤</span>
          </button>
        </nav>
      </div>
      {/* 滚动进度轨：CSS scroll-driven animation，不挂任何 scroll 监听 */}
      <div className="scroll-rail" aria-hidden />
    </header>
  )
}
