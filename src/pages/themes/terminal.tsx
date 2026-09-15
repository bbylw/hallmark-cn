import { useEffect, useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/**
 * 站内真实的文件列表。每条都带一行上下文，
 * 因为下面那个「展开上下文」是真要展开东西出来的。
 */
const FILES = [
  {
    path: 'src/theme.tsx',
    line: 84,
    text: 'export function onThemeChange(id: string) {',
    before: "import { themes } from './data/themes'",
    after: '  document.documentElement.dataset.theme = t.id',
  },
  {
    path: 'src/pages/theme-page.tsx',
    line: 12,
    text: 'useThemeAttr(id)',
    before: 'const page = pages.find((p) => p.slug === slug)',
    after: 'return <main>{render(page)}</main>',
  },
  {
    path: 'src/data/pages.ts',
    line: 203,
    text: 'theme: string',
    before: 'export interface ThemePage {',
    after: '  macroNo: number',
  },
  {
    path: 'src/styles/tokens.css',
    line: 4,
    text: '[data-theme="grid"] {',
    before: '  21 套主题，换 data-theme 就整站换掉',
    after: '  --hm-paper: oklch(98% 0.004 90);',
  },
  {
    path: 'src/components/contact-sheet.tsx',
    line: 96,
    text: 'data-theme={t.id}',
    before: '<div className="grid grid-cols-3 gap-3">',
    after: '  <span>{t.name}</span>',
  },
  {
    path: 'src/theme-attr.ts',
    line: 7,
    text: 'document.documentElement.dataset.theme = id',
    before: 'export function useThemeAttr(id: string) {',
    after: '}',
  },
]

const FLAGS = [
  ['-t, --type <glob>', '只搜这几类文件'],
  ['-i, --ignore-case', '忽略大小写'],
  ['-w, --word', '只匹配完整词'],
  ['-r, --replace', '替换前先给你看 diff'],
  ['    --no-ignore', '连 gitignore 也一起搜'],
]

/** 命中换前景色加粗，不铺底色：一屏里命中多时反白块会连成斑马线 */
function Mark({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <span style={{ color: 'var(--hm-accent)', fontWeight: 700 }}>
        {text.slice(i, i + q.length)}
      </span>
      {text.slice(i + q.length)}
    </>
  )
}

/**
 * 命令行工具。整页是一个终端会话：
 * 每一段都由一行命令开头，后面跟着这条命令的输出。
 * 中间那个提示符是真能敲的：↑↓ 选行，回车展开上下文，esc 清空。
 */
export function TerminalPage({ page }: { page: ThemePage }) {
  const [q, setQ] = useState('theme')
  const [sel, setSel] = useState(0)
  const [open, setOpen] = useState<string[]>([])

  const keyOf = (f: (typeof FILES)[number]) => `${f.path}:${f.line}`
  const hits = q
    ? FILES.filter(
        (f) =>
          f.path.toLowerCase().includes(q.toLowerCase()) ||
          f.text.toLowerCase().includes(q.toLowerCase()),
      )
    : FILES

  useEffect(() => setSel(0), [q])

  const pick = Math.min(sel, Math.max(hits.length - 1, 0))
  const cur = hits[pick]

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSel(Math.min(pick + 1, hits.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSel(Math.max(pick - 1, 0))
    } else if (e.key === 'Enter') {
      if (!cur) return
      e.preventDefault()
      const k = keyOf(cur)
      setOpen((o) => (o.includes(k) ? o.filter((x) => x !== k) : [...o, k]))
    } else if (e.key === 'Escape') {
      setQ('')
    }
  }

  const install = (page.items ?? [])[0]
  const rest = (page.items ?? []).slice(1)

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-10">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        {/* $ rgr --about */}
        <div className="font-mono text-sm text-accent-line">
          <span className="text-muted">$ </span>rgr --about
        </div>
        <div className="mt-4">
          <span className="font-mono text-xs text-muted">
            {page.discipline} · {page.brand}
          </span>
          <h1
            className="display mt-3 text-ink"
            style={{ fontSize: 'clamp(1.9rem, 4.6vw, 3.25rem)', lineHeight: 1.1 }}
          >
            {page.title}
          </h1>
          <p
            className="mt-4 text-sm text-ink-2"
            style={{ maxWidth: '52ch', lineHeight: 'var(--lh-relaxed)' }}
          >
            {page.standfirst}
          </p>
        </div>

        {/* 提示符：这一行就是命令本身，真能敲 */}
        <div className="mt-12">
          <label className="block">
            <span className="sr-only">搜索关键字</span>
            <span
              className="flex flex-wrap items-center gap-x-2 gap-y-1 px-3 py-2 font-mono text-sm"
              style={{
                border: '1px solid var(--hm-rule-2)',
                backgroundColor: 'var(--hm-paper-2)',
                minHeight: '2.75rem',
              }}
            >
              <span aria-hidden className="shrink-0 text-accent-line">
                {page.brand} &quot;
              </span>
              {/* 输入框跟着内容伸缩，和收尾的引号同一个单元，
                  引号才会紧贴关键字，而不是被推到容器最右边 */}
              <span className="flex min-w-0 items-baseline">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={onKey}
                  className="bg-transparent font-mono text-sm text-ink outline-none"
                  style={{
                    caretColor: 'var(--hm-accent)',
                    width: `${q ? Math.max(q.length, 3) : 20}ch`,
                    maxWidth: '100%',
                    padding: 0,
                  }}
                  placeholder="试试 theme / pages / tokens"
                  aria-label="搜索关键字。上下键选行，回车展开上下文，esc 清空"
                />
                <span aria-hidden className="shrink-0 text-accent-line">
                  &quot;
                </span>
              </span>
              <span
                aria-hidden
                className="ml-auto shrink-0 pl-3 text-xs text-muted"
              >
                ↑↓ ⏎ esc
              </span>
            </span>
          </label>

          {/* 输出。标记单独占一列，换行的续行才不会顶到最左边 */}
          <div className="mt-4" style={{ border: '1px solid var(--hm-rule)' }}>
            {hits.length === 0 ? (
              <div className="px-3 py-3 font-mono text-xs text-muted">
                没有命中。试试 theme、pages、tokens。
              </div>
            ) : (
              hits.map((f, i) => {
                const on = i === pick
                const expanded = open.includes(keyOf(f))
                return (
                  <div
                    key={keyOf(f)}
                    className="px-3 py-2 font-mono text-xs"
                    style={{
                      borderTop: i === 0 ? undefined : '1px solid var(--hm-rule)',
                      backgroundColor: on ? 'var(--hm-paper-3)' : undefined,
                    }}
                  >
                    <div className="grid grid-cols-[0.75rem_1fr] gap-x-1">
                      <span
                        aria-hidden
                        style={{ color: 'var(--hm-accent-line)' }}
                      >
                        {on ? '▸' : ''}
                      </span>
                      <span className="min-w-0">
                        <span className="text-ink">
                          <Mark text={f.path} q={q} />
                        </span>
                        <span className="text-muted">:{f.line}:</span>{' '}
                        <span className="text-ink-2">
                          <Mark text={f.text} q={q} />
                        </span>
                      </span>
                    </div>

                    {expanded && (
                      <div
                        className="mt-1 ml-[1rem] pl-3 text-muted"
                        style={{ borderLeft: '1px solid var(--hm-rule-2)' }}
                      >
                        <div>
                          {f.path}-{f.line - 1}-{f.before}
                        </div>
                        <div className="text-ink-2">
                          {f.path}:{f.line}:{f.text}
                        </div>
                        <div>
                          {f.path}-{f.line + 1}-{f.after}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}

            <div
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-3 py-2 font-mono text-xs text-muted"
              style={{
                borderTop: '1px solid var(--hm-rule)',
                backgroundColor: 'var(--hm-paper-2)',
              }}
            >
              <span aria-live="polite">
                {hits.length} 处命中 · 共 {FILES.length} 个文件
              </span>
              <span>↑↓ 换一条 · ⏎ 展开上下文 · esc 清空</span>
            </div>
          </div>
        </div>

        {/* $ rgr --help */}
        <div className="mt-16">
          <h2 className="font-mono text-sm text-accent-line">
            <span className="sr-only">常用参数</span>
            <span aria-hidden>
              <span className="text-muted">$ </span>rgr --help
            </span>
          </h2>

          <div className="mt-4">
            {FLAGS.map(([k, d]) => (
              <div
                key={k}
                className="grid gap-x-6 gap-y-1 py-2 font-mono text-xs sm:grid-cols-[13rem_1fr]"
                style={{ borderTop: '1px solid var(--hm-rule)' }}
              >
                <span className="text-ink">{k}</span>
                <span className="text-muted">{d}</span>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <span className="font-mono text-xs text-muted">默认行为</span>
            <p
              className="mt-3 text-sm text-ink-2"
              style={{ maxWidth: '44ch', lineHeight: 'var(--lh-relaxed)' }}
            >
              {page.code?.out}
            </p>
            <div className="mt-5">
              {rest.map((it) => (
                <div
                  key={it.v}
                  className="grid gap-x-6 gap-y-1 py-2 font-mono text-xs sm:grid-cols-[5rem_11rem_1fr]"
                  style={{ borderTop: '1px solid var(--hm-rule)' }}
                >
                  <span className="text-muted">{it.k}</span>
                  <span className="text-ink">{it.v}</span>
                  <span className="text-muted">{it.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* $ brew install rgr */}
        <div className="mt-16">
          <div className="font-mono text-sm text-accent-line">
            <span className="text-muted">$ </span>
            {install?.v ?? 'brew install rgr'}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Cta label={page.cta} done="装好了" />
            <span className="font-mono text-xs text-muted">{install?.d}</span>
          </div>
        </div>
      </div>
    </main>
  )
}
