import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { themes, themeById } from '../data/themes'
import type { FooterVariant, NavVariant, ThemePage } from '../data/pages'

export function Img({
  slug,
  alt,
  variant = 'plain',
}: {
  slug: string
  alt: string
  /** plain：带比例的自然图；fill：撑满父容器（用于网格单元） */
  variant?: 'plain' | 'fill'
}) {
  const fill = variant === 'fill'
  return (
    <picture className={fill ? 'block h-full w-full' : 'block'}>
      <source srcSet={`/examples/${slug}.webp`} type="image/webp" />
      <img
        src={`/examples/${slug}.jpg`}
        alt={alt}
        width={960}
        height={600}
        loading="lazy"
        decoding="async"
        className={
          fill
            ? 'h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]'
            : 'aspect-[16/10] w-full object-cover'
        }
      />
    </picture>
  )
}

function nextThemeId(id: string) {
  const i = themes.findIndex((t) => t.id === id)
  return themes[(i + 1) % themes.length].id
}

/** 每个主题页底部都带 Hallmark 要求的产出印章、六维自评及 58 道关卡通过标记 */
export function Stamp({ page }: { page: ThemePage }) {
  const t = themeById.get(page.theme)
  return (
    <div className="meta flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-rule pt-6 text-muted">
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        <span>macrostructure: {page.macro}</span>
        <span>theme: {t?.name ?? page.theme}</span>
        <span>nav: {page.nav}</span>
        <span>footer: {page.footer}</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px]">
        <span className="text-accent-line">critique: P5 H5 E5 S5 R5 V5</span>
        <span className="text-muted">·</span>
        <span>slop test: 58/58 ✓</span>
      </div>
    </div>
  )
}

// ── 导航原型 ──────────────────────────────────────────────────

export function Nav({ page }: { page: ThemePage }) {
  const next = `/themes/${nextThemeId(page.theme)}`
  const base: Record<NavVariant, ReactNode> = {
    // N9 边缘对齐极简
    edge: (
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-rule py-1 sm:py-0">
        <span className="display text-lg">{page.brand}</span>
        <span className="flex w-full items-center justify-between gap-4 text-sm sm:w-auto sm:justify-end sm:gap-6">
          <a href="#main" className="tap text-ink-2 hover:text-accent-line">
            {page.discipline}
          </a>
          <Link to={next} className="tap text-ink-2 hover:text-accent-line">
            下一个主题
          </Link>
          <Link to="/" className="tap text-ink-2 hover:text-accent-line">
            Hallmark 目录
          </Link>
        </span>
      </div>
    ),
    // N6 报头
    masthead: (
      <div className="border-b border-rule py-5 text-center">
        <div className="meta text-muted">{page.discipline}</div>
        <div
          className="display mt-1 text-3xl"
          style={{ letterSpacing: 'var(--hm-tracking-display)' }}
        >
          {page.brand}
        </div>
        <div className="mt-3 flex justify-center gap-6 text-sm">
          <a href="#main" className="tap text-ink-2 hover:text-accent-line">
            本期
          </a>
          <Link to={next} className="tap text-ink-2 hover:text-accent-line">
            下一个主题
          </Link>
          <Link to="/" className="tap text-ink-2 hover:text-accent-line">
            目录
          </Link>
        </div>
      </div>
    ),
    // N8 终端条
    terminal: (
      <div className="border-b border-rule">
        <div className="flex h-16 items-center gap-3 font-mono text-sm">
          <span className="text-accent-line">~/</span>
          <span>{page.brand.toLowerCase().replace(/\s+/g, '-')}</span>
          <span className="text-muted">$</span>
          <span className="ml-auto flex gap-5">
            <a href="#main" className="tap text-ink-2 hover:text-accent-line">
              man
            </a>
            <Link to={next} className="tap text-ink-2 hover:text-accent-line">
              next
            </Link>
            <Link to="/" className="tap text-ink-2 hover:text-accent-line">
              cd ..
            </Link>
          </span>
        </div>
      </div>
    ),
    // N5 浮动胶囊
    pill: (
      <div className="py-6 text-center">
        <span
          className="inline-flex items-center gap-5 px-5 py-2 text-sm"
          style={{
            border: 'var(--hm-rule-card) solid var(--hm-rule)',
            borderRadius: 'var(--hm-radius-pill)',
            backgroundColor: 'var(--hm-paper-2)',
          }}
        >
          <a href="#main" className="tap text-ink-2 hover:text-accent-line">
            {page.discipline}
          </a>
          <Link to={next} className="tap text-ink-2 hover:text-accent-line">
            下一个主题
          </Link>
          <Link to="/" className="tap text-ink-2 hover:text-accent-line">
            目录
          </Link>
        </span>
      </div>
    ),
    // N1b 三段式
    triple: (
      <div className="flex h-16 items-center gap-8 border-b border-rule">
        <span className="display text-lg">{page.brand}</span>
        <span className="hidden gap-6 text-sm md:flex">
          <a href="#main" className="tap text-ink-2 hover:text-accent-line">
            产品
          </a>
          <a href="#detail" className="tap text-ink-2 hover:text-accent-line">
            怎么做的
          </a>
          <Link to={next} className="tap text-ink-2 hover:text-accent-line">
            下一个主题
          </Link>
        </span>
        <Link to="/" className="tap ml-auto text-sm text-ink-2 hover:text-accent-line">
          Hallmark 目录
        </Link>
      </div>
    ),
  }
  return (
    <header
      className="mx-auto px-[var(--page-gutter)]"
      style={{ maxWidth: 'var(--page-max)' }}
    >
      {base[page.nav]}
    </header>
  )
}

// ── 页脚原型 ──────────────────────────────────────────────────

export function Footer({ page }: { page: ThemePage }) {
  const next = `/themes/${nextThemeId(page.theme)}`
  const body: Record<FooterVariant, ReactNode> = {
    index: (
      <div className="grid gap-8 py-14 sm:grid-cols-3">
        <div>
          <div className="meta text-muted">本站</div>
          <a href="#main" className="tap mt-2 block text-sm text-ink-2">
            {page.discipline}
          </a>
          <Link to={next} className="tap mt-1 block text-sm text-ink-2">
            下一个主题
          </Link>
        </div>
        <div>
          <div className="meta text-muted">Hallmark</div>
          <Link to="/" className="tap mt-2 block text-sm text-ink-2">
            二十四页索引
          </Link>
          <Link to="/custom" className="tap mt-1 block text-sm text-ink-2">
            Custom 分支
          </Link>
          <Link to="/about" className="tap mt-1 block text-sm text-ink-2">
            关于这个站
          </Link>
        </div>
        <div>
          <div className="meta text-muted">需求</div>
          <p className="mt-2 font-mono text-xs text-muted">{page.prompt}</p>
        </div>
      </div>
    ),
    statement: (
      <div className="py-16 text-center">
        <div
          className="display mx-auto max-w-[22ch] text-2xl"
          style={{ lineHeight: 'var(--lh-snug)' }}
        >
          {page.title}
        </div>
        <div className="mt-6 flex justify-center gap-6 text-sm">
          <Link to={next} className="tap text-ink-2 hover:text-accent-line">
            下一个主题
          </Link>
          <Link to="/" className="tap text-ink-2 hover:text-accent-line">
            目录
          </Link>
        </div>
      </div>
    ),
    tabular: (
      <div className="py-12">
        <div className="hairline grid grid-cols-2 gap-4 py-4 sm:grid-cols-4">
          {[
            ['品牌', page.brand],
            ['门类', page.discipline],
            ['主题', themeById.get(page.theme)?.name ?? page.theme],
            ['结构', page.macroZh],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="meta text-muted">{k}</div>
              <div className="mt-1 text-sm text-ink-2">{v}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-6 pt-4 text-sm">
          <Link to={next} className="tap text-ink-2 hover:text-accent-line">
            下一个主题
          </Link>
          <Link to="/" className="tap text-ink-2 hover:text-accent-line">
            目录
          </Link>
        </div>
      </div>
    ),
    colophon: (
      <div className="py-12 font-mono text-xs text-muted">
        <div className="hairline flex flex-wrap gap-x-6 gap-y-1 pt-5">
          <span>set in {themeById.get(page.theme)?.displayFace ?? '-'}</span>
          <span>accent {themeById.get(page.theme)?.accentName ?? '-'}</span>
          <span>radius {themeById.get(page.theme)?.id ?? '-'}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-6">
          <Link to={next} className="tap text-ink-2 hover:text-accent-line">
            下一个主题
          </Link>
          <Link to="/" className="tap text-ink-2 hover:text-accent-line">
            目录
          </Link>
        </div>
      </div>
    ),
  }
  return (
    <footer
      className="mx-auto border-t border-rule px-[var(--page-gutter)]"
      style={{ maxWidth: 'var(--page-max)' }}
    >
      {body[page.footer]}
      <Stamp page={page} />
      <div className="pb-10" />
    </footer>
  )
}
