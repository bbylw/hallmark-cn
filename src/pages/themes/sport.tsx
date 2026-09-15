import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/**
 * 五档配速。pace 是每公里秒数，是唯一的事实；
 * 条长和「半小时能跑多远」都由它算出来，不是另外编的数。
 */
const PACES = [
  { lane: '01', pace: 420, d: '走跑结合，中途可折返' },
  { lane: '02', pace: 360, d: '能说完整的句子' },
  { lane: '03', pace: 300, d: '说半句就要喘' },
  { lane: '04', pace: 270, d: '基本不说话' },
  { lane: '05', pace: 240, d: '队里最快的那几个' },
]

/** 30 分钟 = 1800 秒，除以每公里秒数就是这半小时能跑的距离 */
const KM30 = 1800
const kmAt = (pace: number) => KM30 / pace
const mmss = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

const SCALE = 8 // 条长按 8 公里满格，零起点，五档之间才比得出来

/**
 * 跑团。宏观结构是「引言领衔」，所以那句带出处的引用就是 h1 本身——
 * 标题借的是周叙的信誉，不是品牌自己的嗓门。
 * 下面那张是配速分道表，条长是这一档半小时真正能跑的距离。
 */
export function SportPage({ page }: { page: ThemePage }) {
  return (
    <main id="main" className="px-[var(--page-gutter)] pb-20 pt-12">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        <span className="meta text-accent-line">
          {page.brand} · {page.discipline}
        </span>

        {/* 首屏：引言 + 出处 */}
        <blockquote className="mt-6">
          <h1
            className="display text-balance text-ink"
            style={{
              fontSize: 'clamp(1.7rem, 4.2vw, 3.1rem)',
              lineHeight: 'var(--lh-snug)',
              maxWidth: '19em',
            }}
          >
            「{page.quote?.text}」
          </h1>
          <footer className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="display text-lg text-ink">{page.quote?.name}</span>
            <span className="meta text-muted">{page.quote?.role}</span>
          </footer>
        </blockquote>

        {/* 引言之后才是事实 */}
        <div
          className="mt-12 pt-6"
          style={{ borderTop: '1.5px solid var(--hm-ink)' }}
        >
          <h2
            className="display text-ink"
            style={{
              fontSize: 'clamp(1.35rem, 2.6vw, 1.95rem)',
              lineHeight: 'var(--lh-tight)',
            }}
          >
            {page.title}
          </h2>
          <p className="mt-2 text-md text-ink-2" style={{ maxWidth: '30ch' }}>
            {page.standfirst}
          </p>
        </div>

        {/* 配速分道 */}
        <div className="mt-14">
          <div
            className="flex flex-wrap items-center gap-x-4 py-2 font-mono text-xs text-muted"
            style={{ borderBottom: '1.5px solid var(--hm-ink)' }}
          >
            <span className="w-8 shrink-0">道次</span>
            <span className="w-16 shrink-0">配速</span>
            <span className="min-w-[8rem] flex-1">这半小时能跑</span>
            <span className="shrink-0 sm:ml-auto">说明</span>
          </div>

          {PACES.map((p) => (
            <div
              key={p.lane}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3"
              style={{ borderBottom: '1.5px solid var(--hm-rule)' }}
            >
              <span className="w-8 shrink-0 font-mono text-xs text-muted">
                {p.lane}
              </span>
              <span
                className="display w-16 shrink-0 text-lg text-ink"
                style={{ letterSpacing: 'var(--hm-tracking-display)' }}
              >
                {mmss(p.pace)}
              </span>
              <span
                aria-hidden
                className="flex min-w-[8rem] flex-1 items-center gap-3"
              >
                <span
                  className="block h-2"
                  style={{
                    width: `${(kmAt(p.pace) / SCALE) * 100}%`,
                    backgroundColor: 'var(--hm-accent)',
                  }}
                />
                <span className="ml-auto shrink-0 font-mono text-xs text-ink-2">
                  {kmAt(p.pace).toFixed(1)} 公里
                </span>
              </span>
              <span className="w-full shrink-0 text-sm text-muted sm:ml-auto sm:w-auto">
                {p.d}
              </span>
            </div>
          ))}
          <p className="mt-2 text-xs text-muted">
            配速单位是每公里用时。条长按八公里满格算，所以五档之间直接比得出来。
          </p>
        </div>

        {/* 信息板 */}
        <div className="mt-14 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          {(page.items ?? []).map((it) => (
            <div
              key={it.v}
              className="pt-3"
              style={{ borderTop: '1.5px solid var(--hm-ink)' }}
            >
              <span className="meta text-muted">{it.k}</span>
              <div className="display mt-1 text-lg text-ink">{it.v}</div>
              <div className="mt-1 text-sm text-muted">{it.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Cta label={page.cta} done="给你留了位置" />
        </div>
      </div>
    </main>
  )
}
