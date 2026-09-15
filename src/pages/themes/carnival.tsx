import { useState } from 'react'
import { Img } from '../../components/archetypes'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/** 唱片颜色按风格走，不是随便给的色相。 */
const HUE: Record<string, number> = {
  后摇: 25,
  民谣: 95,
  电子: 200,
  工业: 330,
}

const AXES = [
  { id: 'time', label: '按发行时间' },
  { id: 'genre', label: '按风格' },
  { id: 'artist', label: '按人' },
] as const

/**
 * 独立厂牌。宏观结构是「生态索引」。
 *
 * 导语承诺了三个入口（按发行时间 / 按风格 / 按人），
 * 所以这三个必须是**同一批发行的三种浏览方式**，可切换，
 * 而不是三个各列各的静态列表。之前那三栏就是这么干的：
 * 「按风格」栏里放的是厂牌事实，不是发行。
 */
export function CarnivalPage({ page }: { page: ThemePage }) {
  const [spin, setSpin] = useState<number | null>(null)
  const [axis, setAxis] = useState<(typeof AXES)[number]['id']>('time')

  const all = page.items ?? []
  const rel = all
    .filter((i) => i.kind === 'release')
    .map((i, n) => {
      const [genre, artist] = (i.d ?? '').split(' · ')
      return { n, month: i.k, title: i.v, genre, artist }
    })
  const facts = all.filter((i) => i.kind !== 'release')

  const genres = [...new Set(rel.map((r) => r.genre))].map((g) => ({
    key: g,
    list: rel.filter((r) => r.genre === g),
  }))
  const artists = [...new Set(rel.map((r) => r.artist))].map((a) => ({
    key: a,
    list: rel.filter((r) => r.artist === a),
  }))

  function onTabKey(e: React.KeyboardEvent<HTMLButtonElement>) {
    const i = AXES.findIndex((a) => a.id === axis)
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      setAxis(AXES[(i + 1) % AXES.length].id)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setAxis(AXES[(i - 1 + AXES.length) % AXES.length].id)
    }
  }

  const Row = ({ r }: { r: (typeof rel)[number] }) => (
    <li
      className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3"
      style={{ borderBottom: '1px solid var(--hm-rule)' }}
    >
      <span className="w-8 shrink-0 font-mono text-xs text-muted">
        {r.month}
      </span>
      <span className="display text-lg text-ink">{r.title}</span>
      <span className="ml-auto shrink-0 text-xs text-muted">
        {r.genre} · {r.artist}
      </span>
    </li>
  )

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-12">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1
            className="display text-ink"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              lineHeight: 'var(--lh-tight)',
              letterSpacing: 'var(--hm-tracking-display)',
            }}
          >
            {page.title}
          </h1>
          <p
            className="max-w-[28ch] text-sm text-ink-2"
            style={{ lineHeight: 'var(--lh-relaxed)' }}
          >
            {page.standfirst}
          </p>
        </div>

        {/* 唱片墙：九个发行，颜色即风格 */}
        <div
          className="mt-12 grid grid-cols-3 gap-x-6 gap-y-8 lg:grid-cols-9"
          style={{ borderTop: '2px solid var(--hm-rule)', paddingTop: '2.5rem' }}
        >
          {rel.map((r, i) => (
            <button
              key={r.title}
              type="button"
              onMouseEnter={() => setSpin(i)}
              onMouseLeave={() => setSpin(null)}
              onFocus={() => setSpin(i)}
              onBlur={() => setSpin(null)}
              className="group block text-left"
              aria-label={`${r.title}，${r.month} 月，${r.genre}，${r.artist}`}
            >
              <span
                className="relative block aspect-square w-full overflow-hidden transition-transform duration-300 ease-out group-hover:-translate-y-1"
                style={{ borderRadius: '50%' }}
              >
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    borderRadius: '50%',
                    background: `repeating-radial-gradient(circle at 50% 50%, oklch(16% 0.03 ${HUE[r.genre] ?? 0}) 0 1.5px, oklch(24% 0.05 ${HUE[r.genre] ?? 0}) 1.5px 3px)`,
                    animation:
                      spin === i ? 'spin-disc 2.6s linear infinite' : undefined,
                  }}
                />
                <span
                  aria-hidden
                  className="absolute inset-0 grid place-items-center"
                  style={{
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 50% 50%, oklch(88% 0.17 ${HUE[r.genre] ?? 0}) 0 15%, transparent 15.6%)`,
                  }}
                />
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    borderRadius: '50%',
                    backgroundColor: 'var(--hm-paper)',
                  }}
                />
              </span>
              <span
                className="display mt-3 block text-base text-ink lg:text-sm"
                style={{ lineHeight: 1.15 }}
              >
                {r.title}
              </span>
              <span className="meta mt-1 block text-muted">{r.month} 月</span>
            </button>
          ))}
        </div>

        {/* 三个入口：同一批发行的三种浏览方式 */}
        <div className="mt-20">
          <div
            role="tablist"
            aria-label="浏览入口"
            className="flex flex-wrap gap-2"
          >
            {AXES.map((a) => (
              <button
                key={a.id}
                role="tab"
                type="button"
                id={`tab-${a.id}`}
                aria-selected={axis === a.id}
                aria-controls={`panel-${a.id}`}
                tabIndex={axis === a.id ? 0 : -1}
                onClick={() => setAxis(a.id)}
                onKeyDown={onTabKey}
                className="btn px-4 py-2 text-sm"
                style={{
                  backgroundColor:
                    axis === a.id ? 'var(--hm-cta-bg)' : 'transparent',
                  color: axis === a.id ? 'var(--hm-cta-fg)' : 'var(--hm-ink-2)',
                  borderColor:
                    axis === a.id ? 'var(--hm-cta-bg)' : 'var(--hm-rule-2)',
                }}
              >
                {a.label}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`panel-${axis}`}
            aria-labelledby={`tab-${axis}`}
            className="mt-6"
          >
            {axis === 'time' && (
              <ul>
                {rel.map((r) => (
                  <Row key={r.title} r={r} />
                ))}
              </ul>
            )}

            {axis === 'genre' && (
              <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {genres.map((g) => (
                  <div key={g.key}>
                    <div
                      className="flex items-baseline justify-between gap-3 pb-2"
                      style={{ borderBottom: '2px solid var(--hm-rule)' }}
                    >
                      <span
                        className="display text-lg"
                        style={{ color: `oklch(46% 0.14 ${HUE[g.key] ?? 0})` }}
                      >
                        {g.key}
                      </span>
                      <span className="meta text-muted">
                        {g.list.length} 张
                      </span>
                    </div>
                    <ul className="mt-2">
                      {g.list.map((r) => (
                        <li key={r.title} className="py-2 text-sm text-ink-2">
                          {r.title}
                          <span className="mt-0.5 block text-xs text-muted">
                            {r.artist} · {r.month} 月
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {axis === 'artist' && (
              <ul className="grid gap-x-12 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
                {artists.map((a) => (
                  <li
                    key={a.key}
                    className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3"
                    style={{ borderBottom: '1px solid var(--hm-rule)' }}
                  >
                    <span className="display text-lg text-ink">{a.key}</span>
                    <span className="meta text-muted">
                      {[...new Set(a.list.map((r) => r.genre))].join(' / ')}
                    </span>
                    <span className="flex-1 text-right text-sm text-ink-2">
                      {a.list.map((r) => r.title).join('、')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 厂牌事实 */}
        <div className="mt-16 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f) => (
            <div
              key={f.k}
              className="pt-3"
              style={{ borderTop: '2px solid var(--hm-ink)' }}
            >
              <span className="meta text-muted">{f.k}</span>
              <div className="display mt-1 text-md text-ink">{f.v}</div>
              <div className="mt-1 text-sm text-muted">{f.d}</div>
            </div>
          ))}
        </div>

        {page.images?.length ? (
          <figure className="mt-16 grid gap-x-12 gap-y-6 lg:grid-cols-[18rem_1fr]">
            <figcaption>
              <span className="meta text-muted">官方示例</span>
              <p
                className="mt-3 text-sm text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                Hallmark 用这套主题生成的示例页。
              </p>
            </figcaption>
            <div
              className="overflow-hidden"
              style={{
                border: '1px solid var(--hm-rule)',
                borderRadius: 'var(--hm-radius-card)',
              }}
            >
              <Img slug={page.images[0]} alt="Hallmark 为 Cold Snap 生成的官方示例页" />
            </div>
          </figure>
        ) : null}

        <div className="mt-14">
          <Cta label={page.cta} done="在放了" />
        </div>
      </div>
    </main>
  )
}
