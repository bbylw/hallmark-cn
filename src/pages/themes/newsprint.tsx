import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

const LEDGER = [
  ['41', '件东西送进来'],
  ['33', '件修好了'],
  ['8', '件我们也没办法'],
]

const NOTICE = [
  ['十月', '十七台台灯，九把椅子，六只电水壶'],
  ['十一月', '带缝纫机来的人变多了'],
  ['十二月', '只收小件，工作台要腾出来做年历'],
]

/**
 * 修理咖啡馆。装置：一封信就该是一栏。右侧那道报边放的是本月的账，
 * 首字下沉只在第一段用一次。
 */
export function NewsprintPage({ page }: { page: ThemePage }) {
  const body = page.body ?? []
  // 信有结构：称呼 / 首段（首字下沉）/ 中段 / 结尾一句 / 署名。
  // 之前把称呼「亲爱的邻居：」当成首段做了首字下沉，渲染成大「亲」配「爱的邻居」。
  const salutation = body[0] ?? ''
  const lead = body[1] ?? ''
  const closing = body[body.length - 1] ?? ''
  const mid = body.slice(2, -1)

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-12">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        <h1
          className="display text-ink"
          style={{ fontSize: 'clamp(1.75rem, 4.4vw, 3rem)', lineHeight: 1.08 }}
        >
          {page.title}
        </h1>

        <div className="mt-10 grid gap-x-14 gap-y-12 lg:grid-cols-12">
          {/* 信 */}
          <article className="lg:col-span-7">
            <div
              className="meta pb-4 text-muted"
              style={{ borderBottom: '2px solid var(--hm-ink)' }}
            >
              给街坊
            </div>

            {/* 称呼：单独一行，不做首字下沉 */}
            <p className="display mt-6 text-lg text-ink">{salutation}</p>

            {/* 首段：首字下沉只在这里用一次 */}
            <p
              className="mt-6 text-md text-ink-2"
              style={{ lineHeight: 'var(--lh-relaxed)' }}
            >
              <span
                className="display float-left mr-3 mt-2 text-ink"
                style={{ fontSize: '3.5rem', lineHeight: 0.72 }}
              >
                {lead?.slice(0, 1)}
              </span>
              {lead?.slice(1)}
            </p>

            {mid.map((p) => (
              <p
                key={p}
                className="mt-5 text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                {p}
              </p>
            ))}

            {/* 结尾一句：比正文大一号 */}
            <p
              className="display mt-6 text-xl text-ink"
              style={{ lineHeight: 'var(--lh-relaxed)' }}
            >
              {closing}
            </p>

            {/* 署名：有称呼就得有人 */}
            <div className="mt-8">
              <div className="display text-lg text-ink">{page.brand}</div>
              <div className="meta mt-1 text-muted">{page.discipline}</div>
            </div>

            <div
              className="mt-10 pt-5"
              style={{ borderTop: '2px solid var(--hm-ink)' }}
            >
              <Cta label={page.cta} done="周六见" ghost />
            </div>
          </article>

          {/* 报边 */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="meta text-muted">本月的账</div>
            <dl className="mt-4">
              {LEDGER.map(([n, d]) => (
                <div
                  key={d}
                  className="flex items-baseline gap-4 py-4"
                  style={{ borderTop: '1px solid var(--hm-rule)' }}
                >
                  <dt
                    className="display w-14 shrink-0 text-3xl text-accent-line"
                    style={{ lineHeight: 1 }}
                  >
                    {n}
                  </dt>
                  <dd className="text-sm text-ink-2">{d}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <div className="meta text-muted">前几个月</div>
              <ul className="mt-4">
                {NOTICE.map(([m, d]) => (
                  <li
                    key={m}
                    className="py-3"
                    style={{ borderTop: '1px solid var(--hm-rule)' }}
                  >
                    <span className="text-sm text-ink">{m}</span>
                    <span className="mt-1 block text-xs text-muted">{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p
              className="mt-10 pt-4 text-xs text-muted"
              style={{
                borderTop: '1px solid var(--hm-rule)',
                lineHeight: 'var(--lh-relaxed)',
              }}
            >
              更正：上一期把「电水壶」印成了「电水壳」，本期订正。
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}
