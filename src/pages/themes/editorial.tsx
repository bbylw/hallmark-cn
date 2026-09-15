import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

const FACTS = [
  ['页数', '148'],
  ['开本', '185 × 260'],
  ['印数', '3000'],
  ['出版', '三月 / 六月 / 九月 / 十二月'],
]

const COLUMNS = [
  ['订阅', '一年四本，不接广告。寄到手上之前不会先上网。'],
  ['零售', '独立书店和美术馆商店有售，也可以在官网单买一本。'],
  ['投稿', '写清楚你要讲的那件事，以及为什么是你来讲。'],
]

/** 刊内页码。按条目序号算，接口改动时不用手改。 */
const pageNo = (i: number) => `p.${String(12 + i * 17).padStart(3, '0')}`

/**
 * 季刊目录。宏观结构是「索引优先」，所以索引本身要有入口，不能是平的一片：
 *   本期专题（一条，单独成块，字号最大）
 *   目录（其余文章，编号 + 前导点线 + 页码）
 *   固定（版权这类常设页，不编号、弱化）
 *
 * 之前八条一样大，而且把「版权 / 订阅零售」当成第 08 篇文章排在文章里 ——
 * 版权页不是文章，杂志目录也不这么列。
 */
export function EditorialPage({ page }: { page: ThemePage }) {
  const all = page.items ?? []
  // 最后一条是常设页，不是文章
  const feature = all[0]
  const standing = all[all.length - 1]
  const articles = all.slice(1, -1)

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-12">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        {/* 刊头 */}
        <div
          className="flex flex-wrap items-end justify-between gap-6 pb-5"
          style={{ borderBottom: '2px solid var(--hm-ink)' }}
        >
          <h1
            className="display text-ink"
            style={{ fontSize: 'clamp(2.25rem, 5.4vw, 3.75rem)', lineHeight: 1.04 }}
          >
            {page.title}
          </h1>
          <p
            className="max-w-[30ch] text-sm text-ink-2"
            style={{ lineHeight: 'var(--lh-relaxed)' }}
          >
            {page.standfirst}
          </p>
        </div>

        <div className="mt-12 grid gap-x-14 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {/* 本期专题 */}
            {feature && (
              <section aria-labelledby="feature">
                <div
                  className="flex flex-wrap items-baseline justify-between gap-4 pb-3"
                  style={{ borderBottom: '2px solid var(--hm-ink)' }}
                >
                  {/* feature.k 本身就是「专题」，再拼一次会变成「本期专题 · 专题」 */}
                  <h2 id="feature" className="meta text-ink">
                    本期专题
                  </h2>
                  <span className="font-mono text-xs text-muted">
                    {pageNo(0)}
                  </span>
                </div>
                <a href="#main" className="group block py-6">
                  <span
                    className="display block text-ink transition-colors duration-200 ease-out group-hover:text-accent-line"
                    style={{
                      fontSize: 'clamp(1.6rem, 3.6vw, 2.6rem)',
                      lineHeight: 1.08,
                    }}
                  >
                    {feature.v}
                  </span>
                  <span className="mt-2 block text-sm text-muted">
                    {feature.d}
                  </span>
                </a>
              </section>
            )}

            {/* 目录 */}
            <section aria-labelledby="contents" className="mt-10">
              <h2 id="contents" className="meta text-muted">
                目录
              </h2>
              <ul className="mt-2">
                {articles.map((it, i) => {
                  const no = i + 2
                  const at = all.indexOf(it)
                  return (
                    <li key={it.v}>
                      <a
                        href="#main"
                        className="group flex items-baseline gap-4 py-4"
                        style={{
                          borderBottom: 'var(--hm-rule-card) solid var(--hm-rule)',
                        }}
                      >
                        <span className="meta w-8 shrink-0 text-muted">
                          {String(no).padStart(2, '0')}
                        </span>
                        <span className="meta w-12 shrink-0 text-accent-line">
                          {it.k}
                        </span>
                        <span className="min-w-0">
                          <span
                            className="display block text-ink transition-all duration-200 ease-out group-hover:translate-x-1 group-hover:text-accent-line"
                            style={{
                              fontSize: 'clamp(1.15rem, 2.1vw, 1.5rem)',
                              lineHeight: 1.15,
                            }}
                          >
                            {it.v}
                          </span>
                          <span className="mt-1 block text-xs text-muted">
                            {it.d}
                          </span>
                        </span>
                        <span
                          aria-hidden
                          className="mx-2 hidden min-w-6 flex-1 translate-y-[-0.3em] sm:block"
                          style={{ borderBottom: '1px dotted var(--hm-rule-2)' }}
                        />
                        <span className="ml-auto shrink-0 font-mono text-xs text-muted sm:ml-0">
                          {pageNo(at)}
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </section>

            {/* 常设页：不是文章，不编号，弱化 */}
            {standing && (
              <div
                className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 text-muted"
                style={{ borderTop: '1px solid var(--hm-rule)' }}
              >
                <span className="meta">固定</span>
                <span className="meta">{standing.k}</span>
                <span className="text-sm">{standing.v}</span>
                <span
                  aria-hidden
                  className="mx-2 hidden min-w-6 flex-1 translate-y-[-0.3em] sm:block"
                  style={{ borderBottom: '1px dotted var(--hm-rule-2)' }}
                />
                <span className="ml-auto shrink-0 font-mono text-xs sm:ml-0">
                  {pageNo(all.length - 1)}
                </span>
              </div>
            )}
          </div>

          {/* 版本信息 */}
          <aside className="lg:col-span-3 lg:col-start-10">
            <div className="lg:sticky lg:top-24">
              <div className="meta text-muted">本期</div>
              <dl className="mt-4">
                {FACTS.map(([k, v]) => (
                  <div
                    key={k}
                    className="py-3"
                    style={{
                      borderTop: 'var(--hm-rule-card) solid var(--hm-rule)',
                    }}
                  >
                    <dt className="meta text-muted">{k}</dt>
                    <dd className="mt-1 font-mono text-xs text-ink-2">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6">
                <Cta label={page.cta} done="订阅上了" />
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-20 grid gap-x-10 gap-y-8 lg:grid-cols-3">
          {COLUMNS.map(([k, d]) => (
            <div
              key={k}
              className="pt-4"
              style={{ borderTop: '2px solid var(--hm-ink)' }}
            >
              <div className="meta text-muted">{k}</div>
              <p
                className="mt-2 text-sm text-ink-2"
                style={{ maxWidth: '34ch', lineHeight: 'var(--lh-relaxed)' }}
              >
                {d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
