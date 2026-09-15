import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/**
 * AI 视频工具 Aurora 主题。
 * 装置：极光问答索引 + 实时算力渲染队列模拟器。
 */
export function AuroraPage({ page }: { page: ThemePage }) {
  const [pick, setPick] = useState(0)
  const [queueProgress, setQueueProgress] = useState(38)
  const [isSimulating, setIsSimulating] = useState(false)

  const qa = page.qa ?? []
  const cur = qa[pick]

  const triggerSimulation = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setQueueProgress(45)
    const t1 = setTimeout(() => setQueueProgress(72), 300)
    const t2 = setTimeout(() => setQueueProgress(95), 700)
    const t3 = setTimeout(() => {
      setQueueProgress(100)
      setIsSimulating(false)
    }, 1100)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }

  function onQuestionKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setPick((index + 1) % qa.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setPick((index - 1 + qa.length) % qa.length)
    }
  }

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-10 sm:pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        
        {/* 刊头 */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-6">
          <div>
            <div className="meta font-mono font-bold text-accent-line">
              AURORA VIDEO FOUNDATION · DIFFUSION 4.0
            </div>
            <h1
              className="display mt-2 text-ink font-bold"
              style={{ fontSize: 'clamp(2rem, 4.8vw, 3.25rem)', lineHeight: 1.08 }}
            >
              {page.title}
            </h1>
          </div>
          <p
            className="max-w-[34ch] text-sm text-ink-2"
            style={{ lineHeight: 'var(--lh-relaxed)' }}
          >
            {page.standfirst}
          </p>
        </div>

        <div className="mt-12 grid gap-x-12 gap-y-10 lg:grid-cols-12">
          {/* 左：问题索引 */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between pb-2 border-b border-rule">
              <span className="meta font-mono font-bold text-ink">常见问题索引 · FAQS</span>
              <span className="font-mono text-xs text-muted">{qa.length} 个核心关切</span>
            </div>

            <ul
              className="mt-3 divide-y divide-rule"
              role="tablist"
              aria-label="常见问题列表"
              aria-orientation="vertical"
            >
              {qa.map((row, i) => {
                const on = pick === i
                return (
                  <li key={row.q}>
                    <button
                      type="button"
                      role="tab"
                      id={`faq-tab-${i}`}
                      aria-selected={on}
                      aria-controls="faq-panel"
                      onClick={() => setPick(i)}
                      onKeyDown={(e) => onQuestionKeyDown(e, i)}
                      className={`flex w-full items-baseline gap-4 py-4 text-left transition-all ${
                        on
                          ? 'border-l-4 border-accent-line bg-paper/80 pl-3 font-semibold'
                          : 'border-l-4 border-transparent pl-3 text-ink-2 hover:bg-paper/40'
                      }`}
                    >
                      <span
                        className="meta font-mono shrink-0 font-bold"
                        style={{
                          color: on ? 'var(--hm-accent-line)' : 'var(--hm-muted)',
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className="display text-base transition-colors sm:text-lg"
                        style={{
                          color: on ? 'var(--hm-ink)' : 'var(--hm-ink-2)',
                        }}
                      >
                        {row.q}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* 右：答案与渲染队列装置 */}
          <div className="lg:col-span-7">
            <div
              id="faq-panel"
              role="tabpanel"
              aria-labelledby={`faq-tab-${pick}`}
              className="rounded-lg border border-rule bg-paper/70 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-rule/60 pb-3">
                <span className="meta font-mono font-bold text-accent-line">
                  ANSWER · 第 {pick + 1} 项解答
                </span>
                <span className="font-mono text-xs text-muted">AURORA DOCS</span>
              </div>
              <p
                className="display mt-4 text-ink font-bold"
                style={{
                  fontSize: 'clamp(1.25rem, 2.6vw, 1.75rem)',
                  lineHeight: 1.25,
                }}
              >
                {cur?.q}
              </p>
              <p
                className="mt-4 text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                {cur?.a}
              </p>
            </div>

            {/* 核心互动装置：极光生成渲染队列 */}
            <div className="mt-8 rounded-lg border border-rule bg-paper/50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-accent-line animate-pulse" />
                  <span className="meta font-mono font-bold text-ink">集群渲染队列状态</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted">
                    {queueProgress === 100 ? '✓ 渲染完成' : '前面还有 2 条'}
                  </span>
                  <button
                    type="button"
                    onClick={triggerSimulation}
                    disabled={isSimulating}
                    className="min-h-[30px] rounded border border-rule px-2.5 py-0.5 font-mono text-xs text-ink hover:border-ink"
                  >
                    {isSimulating ? '计算中...' : '测试排队演练'}
                  </button>
                </div>
              </div>

              {/* 进度条 */}
              <div
                className="mt-4 h-2 w-full overflow-hidden rounded-full"
                style={{
                  backgroundColor: 'var(--hm-rule)',
                }}
              >
                <span
                  className="block h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${queueProgress}%`,
                    backgroundColor: 'var(--hm-accent)',
                  }}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted font-mono">
                <span>30 秒 1080p 约需 2 分钟 · 队列公开透明绝不虚假转圈</span>
                <span>当前节点已就绪：{queueProgress}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-6 border-t border-rule pt-8">
          <Cta label={page.cta} done="已加入算力调度队列" />
          <span className="text-sm text-muted">
            免费额度每月 20 条，无需绑定信用卡，导出无水印。
          </span>
        </div>
      </div>
    </main>
  )
}
