const links = [
  { href: '/', label: '索引' },
  { href: '/about', label: '关于' },
  { href: '/custom', label: 'Custom 分支' },
]

/** 站内导航：吸顶，只做站内导航，没有主题切换。 */
export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper">
      <div
        className="mx-auto flex h-16 items-center gap-6 px-[var(--page-gutter)]"
        style={{ maxWidth: 'var(--page-max)' }}
      >
        <a href="/" className="tap flex shrink-0 items-baseline gap-2">
          <span className="display text-lg">Hallmark</span>
          <span className="meta text-muted">24 页</span>
        </a>
        <nav aria-label="站内导航" className="ml-auto flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="tap text-sm text-ink-2 transition-colors duration-200 hover:text-accent-line"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
