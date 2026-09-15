import { Link } from 'react-router'
import { useThemeSwitch } from '../hooks/use-theme-switch'

const links = [
  { href: '/', label: '索引' },
  { href: '/about', label: '关于' },
  { href: '/custom', label: 'Custom 分支' },
]

/** 站内导航：吸顶，SPA 客户端瞬时流转，集成快捷换肤触发按钮。 */
export function SiteNav() {
  const { cycleTheme } = useThemeSwitch()

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper">
      <div
        className="mx-auto flex h-16 items-center gap-6 px-(--page-gutter)"
        style={{ maxWidth: 'var(--page-max)' }}
      >
        <Link to="/" className="tap flex shrink-0 items-baseline gap-2">
          <span className="display text-lg">Hallmark</span>
          <span className="meta text-muted">24 页</span>
        </Link>
        <nav aria-label="站内导航" className="ml-auto flex items-center gap-6 sm:gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="tap text-sm text-ink-2 transition-colors duration-200 hover:text-accent-line"
            >
              {l.label}
            </Link>
          ))}
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
    </header>
  )
}
