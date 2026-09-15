import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

const MONTHS = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
]

// 一年里真正动手的月份：三月、六月、八月。
// 和数据 items 里的「春 · 三月 / 夏 · 六月 / 夏 · 八月」对得上。
const WORK = { 2: '油菜', 5: '荆条', 7: '荆条' } as Record<number, string>

/**
 * 蜂蜜农场。装置：一年的取蜜日历，
 * 十二格里只有三格是满的 —— 这就是这门生意全部的样子。
 */
export function GardenPage({ page }: { page: ThemePage }) {
  const [hover, setHover] = useState<number | null>(null)

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-14">
      <div
        style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
        className="grid gap-x-12 gap-y-14 lg:grid-cols-12"
      >
        {/* 正文，长文占主栏，不居中 */}
        <article className="lg:col-span-7 lg:col-start-2">
          <h1
            className="display text-ink"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', lineHeight: 1.08 }}
          >
            {page.title}
          </h1>
          <p
            className="display mt-6 text-ink"
            style={{ fontSize: '1.375rem', lineHeight: 1.55 }}
          >
            {page.standfirst}
          </p>

          <div className="mt-10">
            {(page.body ?? []).map((p) => (
              <p
                key={p}
                className="mt-5 text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                {p}
              </p>
            ))}
          </div>

          {/* 那张 hero-garden-01 是 Hallmark 生成的示例网页截图，
              不是蜂场照片，配「十二箱并排放」这种图注就是在说谎。
              长文里不放它。 */}
        </article>

        {/* 侧栏：这一季的账 */}
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-24">
            <div className="meta text-muted">这一季</div>
            <div className="mt-4">
              {(page.items ?? []).map((it) => (
                <div
                  key={it.k + it.v}
                  className="py-4"
                  style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
                >
                  <div className="meta text-muted">{it.k}</div>
                  <div className="display mt-1 text-xl text-ink">{it.v}</div>
                  <div className="mt-1 text-xs text-muted">{it.d}</div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Cta label={page.cta} done="会给你留一瓶" />
            </div>
          </div>
        </aside>
      </div>

      {/* 一年的日历 */}
      <div
        className="mt-20"
        style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
      >
        <div className="meta flex items-baseline justify-between gap-4 text-muted">
          <span>一年</span>
          <span>满色的三个月才是取蜜的月份</span>
        </div>
        <div className="mt-4 flex gap-1.5">
          {MONTHS.map((m, i) => {
            const on = i in WORK
            return (
              <div
                key={m}
                className="group flex-1"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <div
                  className="h-16 transition-all duration-300 ease-out"
                  style={{
                    backgroundColor: on ? 'var(--hm-accent)' : 'var(--hm-paper-2)',
                    border: 'var(--hm-rule-card) solid var(--hm-rule)',
                    borderRadius: 'var(--hm-radius-input)',
                    transform:
                      hover === i ? 'translateY(-4px)' : 'translateY(0)',
                  }}
                />
                {/* 数字标签。之前用 m.slice(0,1)，十月/十一月/十二月
                    全变成同一个「十」，一格对着三行 */}
                <div
                  className="mt-2 text-center font-mono text-[11px]"
                  style={{
                    color: on ? 'var(--hm-accent-line)' : 'var(--hm-muted)',
                  }}
                >
                  {i + 1}
                </div>
              </div>
            )
          })}
        </div>
        <p
          className="mt-3 text-sm text-muted"
          style={{ minHeight: '1.5rem' }}
        >
          {hover === null
            ? '三月、六月、八月各摇一次，其余时间不动箱。'
            : WORK[hover]
              ? `${MONTHS[hover]}：取${WORK[hover]}。`
              : `${MONTHS[hover]}：不取，留给蜂群。`}
        </p>
      </div>
    </main>
  )
}
