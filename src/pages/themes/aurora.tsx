import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/**
 * AI 视频工具。装置：五个问题全部摊在左边当索引，
 * 右边一次只答一个 —— 问答就该让人看见还有哪几个问题。
 */
export function AuroraPage({ page }: { page: ThemePage }) {
  const [pick, setPick] = useState(0)
  const qa = page.qa ?? []
  const cur = qa[pick]

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1
            className="display text-ink"
            style={{ fontSize: 'clamp(2rem, 4.8vw, 3.25rem)', lineHeight: 1.06 }}
          >
            {page.title}
          </h1>
          <p
            className="max-w-[32ch] text-sm text-ink-2"
            style={{ lineHeight: 'var(--lh-relaxed)' }}
          >
            {page.standfirst}
          </p>
        </div>

        <div className="mt-14 grid gap-x-12 gap-y-10 lg:grid-cols-12">
          {/* 左：问题索引 */}
          <div className="lg:col-span-5">
            <div className="meta text-muted">{qa.length} 个问题</div>
            <ul
              className="mt-4"
              role="tablist"
              aria-label="常见问题"
              aria-orientation="vertical"
            >
              {qa.map((row, i) => (
                <li key={row.q}>
                  <button
                    type="button"
                    role="tab"
                    id={`faq-tab-${i}`}
                    aria-selected={pick === i}
                    aria-controls="faq-panel"
                    onClick={() => setPick(i)}
                    className="flex w-full items-baseline gap-4 py-4 text-left"
                    style={{
                      borderTop: '1px solid var(--hm-rule)',
                      borderLeft:
                        pick === i
                          ? '2px solid var(--hm-accent)'
                          : '2px solid transparent',
                      paddingLeft: '0.75rem',
                    }}
                  >
                    <span
                      className="meta shrink-0"
                      style={{
                        color:
                          pick === i ? 'var(--hm-accent)' : 'var(--hm-muted)',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="display text-lg transition-colors duration-200"
                      style={{
                        color:
                          pick === i ? 'var(--hm-ink)' : 'var(--hm-ink-2)',
                        fontWeight: 'inherit',
                      }}
                    >
                      {row.q}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 右：答案 */}
          <div className="lg:col-span-7">
            <div
              id="faq-panel"
              role="tabpanel"
              aria-labelledby={`faq-tab-${pick}`}
              className="p-6 sm:p-8"
              style={{
                backgroundColor: 'var(--hm-paper-2)',
                borderRadius: 'var(--hm-radius-card)',
                border: 'var(--hm-rule-card) solid var(--hm-rule)',
              }}
            >
              <div className="meta text-accent-line">
                第 {pick + 1} 个问题
              </div>
              <p
                className="display mt-3 text-ink"
                style={{
                  fontSize: 'clamp(1.25rem, 2.6vw, 1.75rem)',
                  lineHeight: 1.25,
                }}
              >
                {cur?.q}
              </p>
              <p
                className="mt-5 text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                {cur?.a}
              </p>
            </div>

            {/* 队列 */}
            <div className="mt-6">
              <div className="meta flex items-baseline justify-between text-muted">
                <span>生成队列</span>
                <span>前面还有 2 条</span>
              </div>
              <div
                className="mt-3 h-1.5 w-full overflow-hidden"
                style={{
                  backgroundColor: 'var(--hm-rule)',
                  borderRadius: 'var(--hm-radius-pill)',
                }}
              >
                <span
                  className="block h-full"
                  style={{
                    width: '38%',
                    backgroundColor: 'var(--hm-accent)',
                  }}
                />
              </div>
              <p className="mt-3 text-sm text-muted">
                三十秒的一零八零p 大约两分钟。排队的时候页面会告诉你前面有几条，
                不是转圈。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-6">
          <Cta label={page.cta} done="排在队列里了" />
          <span className="text-sm text-muted">
            免费额度每月 20 条，不用绑卡。
          </span>
        </div>
      </div>
    </main>
  )
}
