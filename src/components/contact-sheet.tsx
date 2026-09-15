import { useState } from 'react'
import { Link } from 'react-router'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { themePages } from '../data/pages'
import { genres, themes, type GenreId } from '../data/themes'

const STATIC = [
  { to: '/custom', k: 'Custom', v: 'Custom 分支', d: '现做一套，不在目录里' },
  { to: '/about', k: 'About', v: '关于这个站', d: '来源、做法与验收' },
]

/** 预览区高度分三档，让打样台高低错落，而不是齐平的一排 */
const BAND = ['12rem', '8.5rem', '6rem', '8.5rem', '6rem', '12rem']

const SEPS = [
  'var(--hm-paper-3)',
  'var(--hm-rule-2)',
  'var(--hm-ink-2)',
  'var(--hm-accent)',
]

type Filter = GenreId | 'all'

/** 各主题物理微质感与专属物态饰纹 */
function ThemeOrnament({ themeId }: { themeId: string }) {
  switch (themeId) {
    case 'carnival':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-5 -top-5 size-16 rounded-full border border-rule/30 opacity-70 group-hover:rotate-45 transition-transform duration-700"
          style={{
            background:
              'repeating-radial-gradient(circle at 50% 50%, var(--hm-ink) 0 1.2px, transparent 1.2px 3px)',
          }}
        />
      )
    case 'terminal':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[10px] font-bold text-accent-line opacity-80 flex items-center gap-1"
        >
          <span className="size-1.5 rounded-full bg-accent-line animate-pulse" />
          <span>&gt;_ 80x24</span>
        </span>
      )
    case 'newsprint':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] text-muted tracking-widest uppercase border-b border-rule/50 pb-0.5"
        >
          VOL. XXIV · 1928
        </span>
      )
    case 'atelier':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] text-muted tracking-tighter opacity-80"
        >
          |···|···| 350g
        </span>
      )
    case 'almanac':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[10px] text-accent-line font-bold opacity-85"
        >
          ☉ 360° · 24 气
        </span>
      )
    case 'aurora':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 size-20 rounded-full blur-xl opacity-35"
          style={{ backgroundColor: 'var(--hm-accent)' }}
        />
      )
    case 'riso':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] font-bold text-accent-line bg-paper px-1.5 py-0.5 rounded border border-rule/60 shadow-xs"
        >
          2-COLOR
        </span>
      )
    case 'lumen':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-4 -top-4 size-14 rounded-full blur-md opacity-30"
          style={{ backgroundColor: 'var(--hm-accent)' }}
        />
      )
    case 'manifesto':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] font-bold text-paper bg-accent-line px-1 rounded-xs uppercase tracking-wider"
        >
          STENCIL
        </span>
      )
    case 'sport':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] font-bold italic text-accent-line"
        >
          45.8&quot; FAST //
        </span>
      )
    case 'grid':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[10px] text-accent-line font-bold"
        >
          [ 0, 0 ]
        </span>
      )
    case 'cobalt':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] text-accent-line font-bold"
        >
          SYS::2026
        </span>
      )
    case 'specimen':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] text-muted tracking-wide"
        >
          Aa Bb 72pt
        </span>
      )
    default:
      return null
  }
}

export function ContactSheet() {
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const query = search.trim().toLowerCase()
  const list = themes.filter((t) => {
    const matchesGenre = filter === 'all' || t.genre === filter
    if (!matchesGenre) return false
    if (!query) return true
    const page = themePages.find((p) => p.theme === t.id)
    return (
      t.name.toLowerCase().includes(query) ||
      t.zh.toLowerCase().includes(query) ||
      t.id.toLowerCase().includes(query) ||
      t.accentName.toLowerCase().includes(query) ||
      (page?.brand?.toLowerCase().includes(query) ?? false) ||
      (page?.macroZh?.toLowerCase().includes(query) ?? false) ||
      (page?.discipline?.toLowerCase().includes(query) ?? false) ||
      (page?.title?.toLowerCase().includes(query) ?? false) ||
      (page?.items?.some(
        (it) =>
          it.k.toLowerCase().includes(query) ||
          it.v.toLowerCase().includes(query) ||
          (it.d?.toLowerCase().includes(query) ?? false),
      ) ?? false) ||
      t.displayFace.toLowerCase().includes(query) ||
      t.displayStyle.toLowerCase().includes(query) ||
      t.note.toLowerCase().includes(query)
    )
  })

  return (
    <div id="main">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="meta text-muted">打样台 · 21 主题 + 2 独立分支</div>
          <h2
            className="display mt-1 text-ink"
            style={{ fontSize: 'var(--text-xl)' }}
          >
            真实小样流
          </h2>
        </div>

        {/* 快速搜索栏 */}
        <div className="relative w-full sm:w-60">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索小样（如黑胶、报纸、终端）..."
            className="w-full rounded-lg px-3 py-1.5 pl-8 pr-7 text-xs font-mono bg-paper-2 border border-rule text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent-line transition-all"
          />
          <MagnifyingGlass
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-ink p-0.5"
              aria-label="清空搜索"
            >
              <X size={12} weight="bold" />
            </button>
          ) : null}
        </div>
      </div>

      {/* 体裁筛选标签行 */}
      <div
        className="mt-4 flex flex-wrap gap-1.5"
        role="tablist"
        aria-label="主题体裁筛选"
      >
        <Chip
          active={filter === 'all'}
          onClick={() => setFilter('all')}
          count={themes.length}
        >
          全部
        </Chip>
        {genres.map((g) => (
          <Chip
            key={g.id}
            active={filter === g.id}
            onClick={() => setFilter(g.id)}
            title={g.blurb}
            count={themes.filter((t) => t.genre === g.id).length}
          >
            {g.zh}
          </Chip>
        ))}
      </div>

      <p
        className="mt-3 max-w-[54ch] text-sm text-ink-2"
        style={{ lineHeight: 'var(--lh-relaxed)' }}
      >
        每张小样都是一整页独立实现。卡片的底色、字体、圆角与色相严格渲染该主题自身的设计令牌，点击即刻进入全尺寸交互装置。
      </p>

      {list.length === 0 ? (
        <div className="mt-12 rounded-lg border border-dashed border-rule p-8 text-center bg-paper-2">
          <div className="meta text-muted font-mono">NO RESULTS</div>
          <div className="display mt-1 text-lg text-ink font-bold">
            未找到与 &quot;{search}&quot; 匹配的主题
          </div>
          <p className="mt-2 text-xs text-muted">
            可以尝试搜索流派（如“编辑体”）、展示字体（如“Playfair”）或物态关键词（如“黑胶”、“报纸”）。
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setFilter('all')
            }}
            className="btn mt-4 px-3 py-1.5 text-xs font-mono"
          >
            清空搜索条件
          </button>
        </div>
      ) : (
        <div
          className="mt-8 gap-4 sm:columns-2 xl:columns-3"
          style={{ columnGap: '1rem' }}
        >
          {list.map((t, i) => {
            const page = themePages.find((p) => p.theme === t.id)
            const tall = BAND[i % BAND.length] === '12rem'
            const genreObj = genres.find((g) => g.id === t.genre)
            return (
              <Link
                key={t.id}
                to={`/themes/${t.id}`}
                data-theme={t.id}
                className="group mb-4 block break-inside-avoid overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--hm-focus)]"
                style={{
                  border: 'var(--hm-rule-card) solid var(--hm-rule)',
                  borderRadius: 'var(--hm-radius-card)',
                  backgroundColor: 'var(--hm-paper)',
                }}
              >
                <span
                  className="relative block overflow-hidden"
                  style={{
                    height: BAND[i % BAND.length],
                    backgroundColor: 'var(--hm-paper-2)',
                  }}
                >
                  {/* 顶部元数据标签：体裁 + 纸色 */}
                  <span className="absolute left-3 top-3 flex items-center gap-1.5 z-10">
                    <span
                      className="meta rounded px-1.5 py-0.5 text-[9px] font-mono"
                      style={{
                        backgroundColor: 'var(--hm-paper)',
                        color: 'var(--hm-ink-2)',
                        border: '1px solid var(--hm-rule)',
                      }}
                    >
                      {genreObj?.zh}
                    </span>
                    <span
                      className="meta rounded px-1 py-0.5 text-[9px] font-mono text-muted"
                      style={{ backgroundColor: 'var(--hm-paper-3)' }}
                    >
                      {t.band}纸
                    </span>
                  </span>

                  {/* 各主题专属物态饰纹 */}
                  <ThemeOrnament themeId={t.id} />

                  <span
                    className="display absolute inset-x-4 bottom-4 text-ink transition-colors group-hover:text-accent-line"
                    style={{
                      fontSize: tall
                        ? 'clamp(1.5rem, 2.6vw, 2.25rem)'
                        : 'clamp(1.1rem, 2vw, 1.6rem)',
                      lineHeight: 1.06,
                      letterSpacing: 'var(--hm-tracking-display)',
                    }}
                  >
                    {t.name}
                  </span>

                  {tall ? (
                    <span
                      aria-hidden
                      className="absolute right-4 top-4"
                      style={{
                        width: '0.75rem',
                        height: '0.75rem',
                        backgroundColor: 'var(--hm-accent)',
                        borderRadius: 'var(--hm-radius-input)',
                        boxShadow: '0 0 0 2px var(--hm-paper)',
                      }}
                    />
                  ) : null}

                  {/* 底部四色分割发丝条 */}
                  <span aria-hidden className="absolute inset-x-0 bottom-0 flex">
                    {SEPS.map((c, k) => (
                      <span
                        key={k}
                        className="h-1 flex-1"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </span>
                </span>

                <span
                  className="block p-4"
                  style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span
                      className="display min-w-0 text-ink group-hover:text-accent-line transition-colors"
                      style={{
                        fontSize: '1.15rem',
                        letterSpacing: 'var(--hm-tracking-display)',
                      }}
                    >
                      {page?.brand ?? t.zh}
                    </span>
                    <span className="meta shrink-0 text-accent-line flex items-center gap-1 font-mono text-xs">
                      <span>{page?.macroZh ?? ''}</span>
                      <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                        →
                      </span>
                    </span>
                  </span>
                  <span className="meta mt-1.5 block text-muted">
                    {t.zh} · {t.displayFace} ({t.displayStyle})
                  </span>
                </span>
              </Link>
            )
          })}

          {filter === 'all' && !search
            ? STATIC.map((p) => (
                <Link
                  key={p.to}
                  to={p.to}
                  className="group mb-4 block break-inside-avoid overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--hm-focus)]"
                  style={{
                    border: 'var(--hm-rule-card) solid var(--hm-rule)',
                    borderRadius: 'var(--hm-radius-card)',
                    backgroundColor: 'var(--hm-paper)',
                  }}
                >
                  <span
                    className="relative block overflow-hidden"
                    style={{
                      height: '6rem',
                      backgroundColor: 'var(--hm-paper-2)',
                    }}
                  >
                    <span
                      className="display absolute inset-x-4 bottom-4 text-ink group-hover:text-accent-line transition-colors"
                      style={{
                        fontSize: 'clamp(1.5rem, 2.6vw, 2.35rem)',
                        lineHeight: 1.02,
                        letterSpacing: 'var(--hm-tracking-display)',
                      }}
                    >
                      {p.k}
                    </span>
                    <span aria-hidden className="absolute inset-x-0 bottom-0 flex">
                      {['var(--hm-rule-2)', 'var(--hm-ink-2)'].map((c, k) => (
                        <span
                          key={k}
                          className="h-1 flex-1"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </span>
                  </span>
                  <span
                    className="block p-4"
                    style={{
                      borderTop: 'var(--hm-rule-card) solid var(--hm-rule)',
                    }}
                  >
                    <span
                      className="display block text-ink group-hover:text-accent-line transition-colors"
                      style={{
                        fontSize: '1.15rem',
                        letterSpacing: 'var(--hm-tracking-display)',
                      }}
                    >
                      {p.v}
                    </span>
                    <span className="meta mt-1.5 block text-muted">{p.d}</span>
                  </span>
                </Link>
              ))
            : null}
        </div>
      )}
    </div>
  )
}

function Chip({
  children,
  active,
  onClick,
  title,
  count,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
  title?: string
  count?: number
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      title={title}
      className={`btn tap px-2.5 py-1 text-xs rounded-lg transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--hm-focus)] flex items-center gap-1.5 ${
        active ? 'shadow-xs font-semibold' : 'hover:bg-paper-2'
      }`}
      style={{
        backgroundColor: active ? 'var(--hm-ink)' : 'transparent',
        color: active ? 'var(--hm-paper)' : 'var(--hm-ink-2)',
        borderColor: active ? 'var(--hm-ink)' : 'var(--hm-rule)',
      }}
    >
      <span>{children}</span>
      {count !== undefined ? (
        <span
          className={`font-mono text-[10px] rounded px-1 py-0.5 leading-none ${
            active ? 'bg-paper/25 text-paper' : 'bg-paper-3 text-muted'
          }`}
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}
