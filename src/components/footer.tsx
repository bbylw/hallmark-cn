const links = [
  { label: '在线演示', href: 'https://www.usehallmark.com' },
  { label: 'GitHub', href: 'https://github.com/Nutlope/hallmark' },
  {
    label: '实战示例',
    href: 'https://github.com/Nutlope/hallmark/blob/main/docs/recipes.md',
  },
]

export function Footer() {
  return (
    <footer className="hairline">
      <div
        className="mx-auto flex flex-wrap items-end justify-between gap-8 py-14 px-(--page-gutter)"
        style={{ maxWidth: 'var(--page-max)' }}
      >
        <div>
          <div className="display text-xl text-ink">Hallmark</div>
          <p
            className="mt-2 max-w-[46ch] text-sm text-muted"
            style={{ lineHeight: 'var(--lh-relaxed)' }}
          >
            一个专为 Claude Code、Cursor 和 Codex 打造的设计 skill。由 Together
            AI 打造，MIT 协议，随意使用、fork、发布。
          </p>
        </div>

        <nav aria-label="站外链接" className="flex flex-wrap gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="tap text-sm text-ink-2 transition-colors duration-200 hover:text-accent-line"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
