import { useState } from 'react'
import { Img } from '../../components/archetypes'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

interface ProjectDetail {
  stack: string
  deliverables: string
  duration: string
}

const PROJECT_EXTRAS: Record<string, ProjectDetail> = {
  default: {
    stack: 'Fraunces 144 Display · Newsreader Text · Geist Mono',
    deliverables: '视觉识别系统 · 响应式网站架构 · 印刷出样规程',
    duration: '6 周完整周期',
  },
}

/**
 * 设计工作室。作品网格：九个项目各有一张图，按年份分两层——
 * 最近一年三件用大图，更早的六件用小一号的图。
 * 修复 Gate 50：网格轨道采用 minmax(0, 1fr) 防御。
 */
export function StudioPage({ page }: { page: ThemePage }) {
  const [cat, setCat] = useState('全部')
  const [activeProject, setActiveProject] = useState<string | null>(null)

  const work = (page.items ?? []).map((it, slot) => {
    const [type, kind] = it.v.split(' · ')
    return { client: it.k, type, kind, year: it.d ?? '', slot }
  })
  const shots = page.images ?? []
  const shotOf = (slot: number) => shots[slot] ?? null

  const cats = ['全部', ...[...new Set(work.map((w) => w.kind))]]
  const countOf = (c: string) =>
    c === '全部' ? work.length : work.filter((w) => w.kind === c).length

  const shown = work.filter((w) => cat === '全部' || w.kind === cat)
  const split = shown.length >= 6 && shown.length % 3 === 0 ? 3 : 0
  const featured = shown.slice(0, split)
  const rest = shown.slice(split)

  const Caption = ({
    w,
    size,
  }: {
    w: (typeof work)[number]
    size: 'lg' | 'sm'
  }) => (
    <figcaption className={size === 'lg' ? 'mt-3' : 'mt-2.5'}>
      <div
        className={`display font-bold text-ink ${size === 'lg' ? 'text-lg' : 'text-base'}`}
      >
        {w.client}
      </div>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm text-muted">
        <span>{w.type}</span>
        <span aria-hidden>·</span>
        <span>{w.kind}</span>
        <span className="meta ml-auto font-mono">{w.year}</span>
      </div>
    </figcaption>
  )

  const Tile = ({ w, size }: { w: (typeof work)[number]; size: 'lg' | 'sm' }) => {
    const isInspected = activeProject === w.client
    return (
      <figure
        className="group min-w-0 cursor-pointer"
        onClick={() => setActiveProject(isInspected ? null : w.client)}
        tabIndex={0}
        role="button"
        aria-pressed={isInspected}
        aria-label={`查看 ${w.client} 项目详情`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setActiveProject(isInspected ? null : w.client)
          }
        }}
      >
        <div
          className={`overflow-hidden transition-all duration-200 ${
            isInspected ? 'ring-2 ring-accent-line shadow-md' : 'hover:border-ink'
          }`}
          style={{
            border: '1px solid var(--hm-rule)',
            borderRadius: 'var(--hm-radius-card)',
          }}
        >
          <div
            className={`overflow-hidden ${
              size === 'lg' ? 'aspect-[4/3]' : 'aspect-[16/9]'
            }`}
          >
            <Img slug={shotOf(w.slot) ?? ''} alt={w.client} variant="fill" />
          </div>
        </div>
        <Caption w={w} size={size} />
      </figure>
    )
  }

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-12 sm:pt-16">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <span className="meta font-mono font-bold text-accent-line">
              STUDIO ARCHIVE · FRAUNCES TYPOGRAPHY
            </span>
            <h1
              className="display mt-2 text-ink"
              style={{ fontSize: 'clamp(2rem, 4.6vw, 3.25rem)', lineHeight: 1.08 }}
            >
              {page.title}
            </h1>
            <p
              className="mt-4 text-md text-ink-2"
              style={{ maxWidth: '42ch', lineHeight: 'var(--lh-relaxed)' }}
            >
              {page.standfirst}
            </p>
            <p className="meta mt-3 text-muted">十四件归档案例，本页选录精选九件。</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {cats.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
                className="btn min-h-[38px] px-3.5 py-1.5 text-sm font-medium transition-all"
                style={{
                  backgroundColor: cat === c ? 'var(--hm-cta-bg)' : 'transparent',
                  color: cat === c ? 'var(--hm-cta-fg)' : 'var(--hm-ink-2)',
                  borderColor: cat === c ? 'var(--hm-cta-bg)' : 'var(--hm-rule)',
                }}
              >
                {c}
                <span
                  className="meta ml-2 font-mono font-bold"
                  style={{
                    color: cat === c ? 'var(--hm-cta-fg)' : 'var(--hm-muted)',
                  }}
                >
                  {countOf(c)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 专属互动装置：项目档案抽检面板 */}
        {activeProject && (
          <div className="mt-10 rounded-lg border border-rule bg-paper/80 p-5 sm:p-6 transition-all duration-200">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3">
              <div className="flex items-center gap-3">
                <span className="meta font-mono font-bold text-accent-line">PROJECT SCOPE</span>
                <span className="display font-bold text-ink text-lg">{activeProject}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="btn btn-ghost px-2.5 py-1 text-xs"
                aria-label="关闭项目详情"
              >
                关闭 ✕
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3 text-xs">
              <div>
                <span className="meta text-muted">排印字体体系</span>
                <div className="mt-1 font-mono text-ink-2 font-medium">
                  {PROJECT_EXTRAS.default.stack}
                </div>
              </div>
              <div>
                <span className="meta text-muted">核心交付成果</span>
                <div className="mt-1 text-ink-2">
                  {PROJECT_EXTRAS.default.deliverables}
                </div>
              </div>
              <div>
                <span className="meta text-muted">驻场协作周期</span>
                <div className="mt-1 font-mono text-ink-2">
                  {PROJECT_EXTRAS.default.duration} · 深度双人领衔
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 最近一年：大图。采用 minmax(0, 1fr) 防御 Gate 50 */}
        {featured.length > 0 && (
          <div className="mt-14">
            <div
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-3"
              style={{ borderBottom: '1.5px solid var(--hm-ink)' }}
            >
              <span className="meta font-mono font-bold text-ink">近期重点作品 · RECENT WORK</span>
              <span className="meta font-mono text-muted">{featured.length} 件</span>
            </div>
            <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-[repeat(3,minmax(0,1fr))]">
              {featured.map((w) => (
                <Tile key={w.client} w={w} size="lg" />
              ))}
            </div>
          </div>
        )}

        {/* 更早：小一号的图，六件两行。采用 minmax(0, 1fr) 防御 Gate 50 */}
        {rest.length > 0 && (
          <div className="mt-16">
            <div
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-3"
              style={{ borderBottom: '1.5px solid var(--hm-ink)' }}
            >
              <span className="meta font-mono font-bold text-ink">
                {featured.length ? '历年精选作品 · ARCHIVE' : '全部作品清单'}
              </span>
              <span className="meta font-mono text-muted">{rest.length} 件</span>
            </div>
            <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-[repeat(3,minmax(0,1fr))]">
              {rest.map((w) => (
                <Tile key={w.client} w={w} size="sm" />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-rule pt-8">
          <div className="flex flex-wrap items-center gap-6">
            <Cta label={page.cta} done="收到简讯，24小时内回你" />
            <span className="text-sm text-muted">
              我们一次只接两个项目，通常提前一个月锁定排期。
            </span>
          </div>
          <div className="font-mono text-xs text-muted">
            AVAILABILITY: 2026 Q4 [1 SLOT REMAINING]
          </div>
        </div>
      </div>
    </main>
  )
}
