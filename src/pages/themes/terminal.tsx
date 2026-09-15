import { useEffect, useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { CopyButton } from '../../components/ui/copy-button'
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
  ['-t, --type <glob>', '只搜这几类文件扩展名'],
  ['-i, --ignore-case', '忽略大小写敏感匹配'],
  ['-w, --word', '只匹配完整单词词界'],
  ['-r, --replace', '替换前先交互式预览 Unified Diff'],
  ['    --no-ignore', '连 .gitignore 排除的文件也一同检索'],
]

/** 命中换前景色加粗，不铺底色 */
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
 * 中间那个提示符是真能敲的：↑↓ 选行，回车或点击展开上下文，esc 清空。
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

  const toggleRow = (k: string) => {
    setOpen((o) => (o.includes(k) ? o.filter((x) => x !== k) : [...o, k]))
  }

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
      toggleRow(keyOf(cur))
    } else if (e.key === 'Escape') {
      setQ('')
    }
  }

  const install = (page.items ?? [])[0]
  const rest = (page.items ?? []).slice(1)

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-10 sm:pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        
        {/* $ rgr --about */}
        <div className="font-mono text-sm text-accent-line">
          <span className="text-muted">$ </span>rgr --about
        </div>
        <div className="mt-4">
          <span className="font-mono text-xs text-muted">
            {page.discipline} · {page.brand} · v2.4.0-release
          </span>
          <h1
            className="display mt-3 text-ink font-bold"
            style={{ fontSize: 'clamp(1.9rem, 4.6vw, 3.25rem)', lineHeight: 1.12 }}
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

        {/* 提示符：终端命令真机模拟器 */}
        <div className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
            <span className="font-mono text-xs text-muted">
              INTERACTIVE CLI SHELL · 实时正则全文检索
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-muted text-[11px]">快捷预设:</span>
              {['theme', 'tokens', 'pages', 'dataset'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setQ(preset)}
                  className={`rounded border px-2 py-0.5 text-[11px] ${
                    q === preset
                      ? 'border-ink bg-ink text-paper'
                      : 'border-rule text-muted hover:border-ink hover:text-ink'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="sr-only">搜索关键字</span>
            <span
              className="flex flex-wrap items-center gap-x-2 gap-y-1 px-3 py-2 font-mono text-sm"
              style={{
                border: '1px solid var(--hm-rule-2)',
                backgroundColor: 'var(--hm-paper-2)',
                minHeight: '2.75rem',
                borderRadius: 'var(--hm-radius-input)',
              }}
            >
              <span aria-hidden className="shrink-0 text-accent-line font-bold">
                {page.brand} &quot;
              </span>
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
                  placeholder="输入搜索词..."
                  aria-label="搜索关键字。上下键选行，回车或点击展开上下文，esc 清空"
                />
                <span aria-hidden className="shrink-0 text-accent-line font-bold">
                  &quot;
                </span>
              </span>
              <span
                aria-hidden
                className="ml-auto shrink-0 pl-3 text-xs text-muted font-mono"
              >
                ↑↓ 换行 · ⏎ 展开 · esc 清空
              </span>
            </span>
          </label>

          {/* 输出列表 */}
          <div
            className="mt-4 overflow-hidden rounded-lg"
            style={{ border: '1px solid var(--hm-rule)' }}
          >
            {hits.length === 0 ? (
              <div className="px-3 py-4 font-mono text-xs text-muted">
                没有命中结果。可尝试点击上方快捷预设标签。
              </div>
            ) : (
              hits.map((f, i) => {
                const on = i === pick
                const expanded = open.includes(keyOf(f))
                return (
                  <div
                    key={keyOf(f)}
                    onClick={() => toggleRow(keyOf(f))}
                    className="cursor-pointer px-3 py-2.5 font-mono text-xs transition-colors"
                    style={{
                      borderTop: i === 0 ? undefined : '1px solid var(--hm-rule)',
                      backgroundColor: on ? 'var(--hm-paper-3)' : undefined,
                    }}
                    role="button"
                    tabIndex={0}
                    aria-expanded={expanded}
                  >
                    <div className="grid grid-cols-[0.75rem_1fr] gap-x-1">
                      <span
                        aria-hidden
                        style={{ color: 'var(--hm-accent-line)' }}
                      >
                        {on ? '▸' : ''}
                      </span>
                      <span className="min-w-0 break-all">
                        <span className="text-ink font-semibold">
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
                        className="mt-2 ml-[1rem] pl-3 text-muted text-[11px] space-y-0.5"
                        style={{ borderLeft: '2px solid var(--hm-accent-line)' }}
                      >
                        <div className="opacity-70">
                          {f.path}-{f.line - 1}-{f.before}
                        </div>
                        <div className="text-ink font-bold bg-accent-line/10 px-1 rounded">
                          {f.path}:{f.line}:{f.text}
                        </div>
                        <div className="opacity-70">
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
                {hits.length} 处匹配 · 共 {FILES.length} 个代码文件
              </span>
              <span>点击单行或按回车切换三行上下文</span>
            </div>
          </div>
        </div>

        {/* $ rgr --help */}
        <div className="mt-16">
          <h2 className="font-mono text-sm text-accent-line font-bold">
            <span className="text-muted">$ </span>rgr --help
          </h2>

          <div className="mt-4">
            {FLAGS.map(([k, d]) => (
              <div
                key={k}
                className="grid gap-x-6 gap-y-1 py-2 font-mono text-xs sm:grid-cols-[13rem_1fr]"
                style={{ borderTop: '1px solid var(--hm-rule)' }}
              >
                <span className="text-ink font-semibold">{k}</span>
                <span className="text-muted">{d}</span>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <span className="font-mono text-xs font-bold text-muted">默认行为与设计原则</span>
            <p
              className="mt-3 text-sm text-ink-2"
              style={{ maxWidth: '48ch', lineHeight: 'var(--lh-relaxed)' }}
            >
              {page.code?.out}
            </p>
            <div className="mt-5">
              {rest.map((it) => (
                <div
                  key={it.v}
                  className="grid gap-x-6 gap-y-1 py-2 font-mono text-xs sm:grid-cols-[6rem_12rem_1fr]"
                  style={{ borderTop: '1px solid var(--hm-rule)' }}
                >
                  <span className="text-muted">{it.k}</span>
                  <span className="text-ink font-medium">{it.v}</span>
                  <span className="text-muted">{it.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* $ brew install rgr */}
        <div className="mt-16 rounded-lg border border-rule bg-paper/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="font-mono text-sm text-accent-line font-bold">
              <span className="text-muted">$ </span>
              {install?.v ?? 'brew install rgr'}
            </div>
            <CopyButton
              value={install?.v ?? 'brew install rgr'}
              ariaLabel="复制安装命令"
              className="btn-ghost px-3 py-1 text-xs font-mono"
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Cta label={page.cta} done="二进制已放入 /usr/local/bin" />
            <span className="font-mono text-xs text-muted">{install?.d}</span>
          </div>
        </div>
      </div>
    </main>
  )
}
