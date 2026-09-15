import { useState } from 'react'
import { Link } from 'react-router'
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

export function ContactSheet() {
  const [filter, setFilter] = useState<Filter>('all')
  const list = filter === 'all' ? themes : themes.filter((t) => t.genre === filter)

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
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="主题体裁筛选">
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
            全部 {themes.length}
          </Chip>
          {genres.map((g) => (
            <Chip
              key={g.id}
              active={filter === g.id}
              onClick={() => setFilter(g.id)}
              title={g.blurb}
            >
              {g.zh} {themes.filter((t) => t.genre === g.id).length}
            </Chip>
          ))}
        </div>
      </div>
      <p
        className="mt-3 max-w-[54ch] text-sm text-ink-2"
        style={{ lineHeight: 'var(--lh-relaxed)' }}
      >
        每张小样都是一整页独立实现。卡片的底色、字体、圆角与色相严格渲染该主题自身的设计令牌，点击即刻进入全尺寸交互装置。
      </p>

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
              className="group mb-4 block break-inside-avoid overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--hm-focus)]"
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

                <span
                  className="display absolute inset-x-4 bottom-4 text-ink"
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
                    className="display min-w-0 text-ink"
                    style={{
                      fontSize: '1.15rem',
                      letterSpacing: 'var(--hm-tracking-display)',
                    }}
                  >
                    {page?.brand ?? t.zh}
                  </span>
                  <span className="meta shrink-0 text-accent-line">
                    {page?.macroZh ?? ''}
                  </span>
                </span>
                <span className="meta mt-1.5 block text-muted">
                  {t.zh} · {t.displayFace} ({t.displayStyle})
                </span>
              </span>
            </Link>
          )
        })}

        {filter === 'all'
          ? STATIC.map((p) => (
              <Link
                key={p.to}
                to={p.to}
                className="group mb-4 block break-inside-avoid overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--hm-focus)]"
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
                    className="display absolute inset-x-4 bottom-4 text-ink"
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
                  style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
                >
                  <span
                    className="display block text-ink"
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
    </div>
  )
}

function Chip({
  children,
  active,
  onClick,
  title,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
  title?: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      title={title}
      className="btn tap px-3 py-1.5 text-xs transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--hm-focus)]"
      style={{
        backgroundColor: active ? 'var(--hm-cta-bg)' : 'transparent',
        color: active ? 'var(--hm-cta-fg)' : 'var(--hm-ink-2)',
        borderColor: active ? 'var(--hm-cta-bg)' : 'var(--hm-rule)',
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </button>
  )
}
