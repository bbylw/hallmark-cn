import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/**
 * 租户联盟。装置：一整条红 + 租金涨幅合法性自查装置。
 * 宣言不该是网格，它应该是一行一行压下来的句子，每一行之间用 2px 隔开。
 */
export function ManifestoPage({ page }: { page: ThemePage }) {
  const body = page.body ?? []

  const [signed, setSigned] = useState(false)
  const [rent, setRent] = useState(3800)
  const [hike, setHike] = useState(25)

  const hikeAmount = Math.round(rent * (hike / 100))
  const newRent = rent + hikeAmount
  const isExcessive = hike > 5

  const STATS = [
    ['124', '去年收到加租通知的户数', '平均涨三成二，没有一户拿到书面理由'],
    [signed ? '68' : '67', '现在在联盟里的户数', signed ? '感谢你的签署，你已加入街区连署名册' : '我们不提供法律意见，我们提供彼此的电话'],
  ]

  return (
    <main id="main" className="pb-24">
      {/* 首屏：字压在左下，像一张海报。导语只在下面那条红里出现一次 */}
      <section
        className="flex min-h-[55dvh] flex-col px-[var(--page-gutter)] pt-12"
        style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <span className="meta font-mono font-bold text-accent-line">
            {page.discipline} · TENANT SOLIDARITY UNION
          </span>
          <span className="meta font-mono text-muted">二〇二六 · 第六街区支部</span>
        </div>

        <h1
          className="display mt-auto text-ink"
          style={{
            fontSize: 'clamp(3rem, 12.5vw, 9rem)',
            lineHeight: 'var(--lh-tight)',
            letterSpacing: 'var(--hm-tracking-display)',
            overflowWrap: 'break-word',
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
            className="display font-medium"
            style={{
              color: 'var(--hm-accent-ink)',
              fontSize: 'clamp(1.5rem, 4vw, 2.75rem)',
              lineHeight: 1.18,
              maxWidth: '28ch',
            }}
          >
            {page.standfirst}
          </p>
        </div>
      </section>

      {/* 核心互动装置：涨租合法性自查台 */}
      <section
        className="px-[var(--page-gutter)] pt-14"
        style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
      >
        <div className="rounded-lg border-2 border-ink bg-paper p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-4">
            <div>
              <span className="meta font-mono font-bold text-accent-line">装置 · 街坊租金合规自查</span>
              <h2 className="display text-xl text-ink">算一算房东的涨幅合不合理</h2>
            </div>
            <div className="font-mono text-xs text-muted">
              依据《第六街区租住安定指导备忘》
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block">
                <div className="flex items-center justify-between">
                  <span className="meta text-ink">当前月租金</span>
                  <span className="font-mono text-sm font-bold text-ink">¥ {rent} /月</span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={12000}
                  step={100}
                  value={rent}
                  onChange={(e) => setRent(Number(e.target.value))}
                  className="min-h-[44px] w-full cursor-pointer"
                  aria-label="输入当前月租金"
                />
              </label>

              <label className="mt-4 block">
                <div className="flex items-center justify-between">
                  <span className="meta text-ink">房东要求的加租幅度</span>
                  <span className="font-mono text-sm font-bold text-accent-line">+{hike}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={hike}
                  onChange={(e) => setHike(Number(e.target.value))}
                  className="min-h-[44px] w-full cursor-pointer"
                  aria-label="输入房东要求的加租幅度百分比"
                />
              </label>
            </div>

            <div className="flex flex-col justify-between rounded border border-rule bg-paper/60 p-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="meta text-muted">月增支出</span>
                  <span className="font-mono text-lg font-bold text-accent-line">+ ¥ {hikeAmount}</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="meta text-muted">新租金</span>
                  <span className="font-mono text-sm font-bold text-ink">¥ {newRent} /月</span>
                </div>
              </div>

              <div className="mt-4 border-t border-rule pt-3 text-xs">
                {isExcessive ? (
                  <div className="text-accent-line font-medium">
                    ⚠️ 涨幅超过法定指导线 5%。房东依法必须提前 60 天出具维修通胀核算审计明细，且无权单方面解约。
                  </div>
                ) : (
                  <div className="text-muted">
                    ✓ 处于常规指导区间。请检查租约是否明确包含修缮与公共部位能耗条款。
                  </div>
                )}
              </div>
            </div>
          </div>
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
                <span className="meta w-8 shrink-0 font-mono font-bold text-accent-line">
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
                  key={k}
                  className="py-5"
                  style={{ borderTop: '2px solid var(--hm-rule)' }}
                >
                  <div
                    className="display font-bold text-accent-line"
                    style={{
                      fontSize: 'clamp(3rem, 7vw, 5rem)',
                      lineHeight: 0.9,
                    }}
                  >
                    {n}
                  </div>
                  <div className="mt-3 text-sm font-semibold text-ink">{k}</div>
                  <div
                    className="mt-1 text-sm text-muted"
                    style={{ maxWidth: '24ch', lineHeight: 'var(--lh-relaxed)' }}
                  >
                    {d}
                  </div>
                </div>
              ))}
              <div className="mt-8 space-y-4">
                <button
                  type="button"
                  onClick={() => setSigned(true)}
                  disabled={signed}
                  className={`btn w-full justify-center ${
                    signed ? 'btn-ghost' : 'btn-primary'
                  }`}
                  aria-pressed={signed}
                >
                  {signed ? '✓ 已连署名册 (户数 +1)' : '在线连署支持宣言'}
                </button>
                <Cta label={page.cta} done="已为你预留听证席位" />
                <p className="meta text-muted" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                  下周三晚七点，社区中心二楼会议室，请带好纸质租约。
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
