import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/**
 * 租户联盟。装置：一整条红。宣言不该是网格，
 * 它应该是一行一行压下来的句子，每一行之间用 2px 隔开。
 *
 * 右侧钉着两个数字（收信的 124 户、在册的 67 户），
 * 否则整节正文右侧 45% 都是空的。
 */
export function ManifestoPage({ page }: { page: ThemePage }) {
  const body = page.body ?? []

  const STATS = [
    ['124', '去年收到加租通知的户数', '平均涨三成二，没有一户拿到书面理由'],
    ['67', '现在在联盟里的户数', '我们不提供法律意见，我们提供彼此的电话'],
  ]

  return (
    <main id="main" className="pb-24">
      {/* 首屏：字压在左下，像一张海报。导语只在下面那条红里出现一次 */}
      <section
        className="flex min-h-[58dvh] flex-col px-[var(--page-gutter)] pt-12"
        style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          {/* 导航里已有品牌名，这里放门类 */}
          <span className="meta text-muted">{page.discipline}</span>
          <span className="meta text-muted">二〇二六 · 第六街区</span>
        </div>

        <h1
          className="display mt-auto text-ink"
          style={{
            fontSize: 'clamp(3rem, 12.5vw, 9rem)',
            // 中文巨字不能低于 1 倍行高，否则上下两行字形相撞
            lineHeight: 'var(--lh-tight)',
            letterSpacing: 'var(--hm-tracking-display)',
          }}
        >
          房租
          <br />
          不是天气
        </h1>
      </section>

      {/* 红条：全页唯一一句导语 */}
      <section
        className="px-[var(--page-gutter)]"
        style={{ backgroundColor: 'var(--hm-accent)' }}
      >
        <div
          className="py-10"
          style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
        >
          <p
            className="display"
            style={{
              color: 'var(--hm-accent-ink)',
              fontSize: 'clamp(1.5rem, 4vw, 2.75rem)',
              lineHeight: 1.15,
              maxWidth: '26ch',
            }}
          >
            {page.standfirst}
          </p>
        </div>
      </section>

      {/* 宣言 + 右侧钉住的数字 */}
      <section
        className="px-[var(--page-gutter)] pt-16"
        style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
      >
        <div className="grid gap-x-14 gap-y-12 lg:grid-cols-12">
          <ol className="lg:col-span-7">
            {body.map((p, i) => (
              <li
                key={p}
                className="flex gap-6 py-7"
                style={{ borderTop: '2px solid var(--hm-rule)' }}
              >
                <span className="meta w-8 shrink-0 text-accent-line">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p
                  className="display text-ink"
                  style={{
                    fontSize: 'clamp(1.25rem, 2.6vw, 2rem)',
                    lineHeight: 1.25,
                    maxWidth: '30ch',
                  }}
                >
                  {p}
                </p>
              </li>
            ))}
            <li style={{ borderTop: '2px solid var(--hm-rule)' }} />
          </ol>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-24">
              {STATS.map(([n, k, d]) => (
                <div
                  key={n}
                  className="py-5"
                  style={{ borderTop: '2px solid var(--hm-rule)' }}
                >
                  <div
                    className="display text-accent-line"
                    style={{
                      fontSize: 'clamp(3rem, 7vw, 5rem)',
                      lineHeight: 0.9,
                    }}
                  >
                    {n}
                  </div>
                  <div className="mt-3 text-sm text-ink">{k}</div>
                  <div
                    className="mt-1 text-sm text-muted"
                    style={{ maxWidth: '24ch' }}
                  >
                    {d}
                  </div>
                </div>
              ))}
              <div className="mt-8">
                <Cta label={page.cta} done="名字记下了" />
                <p className="meta mt-4 text-muted">
                  下周三晚七点，社区中心二楼，带你的租约来。
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
