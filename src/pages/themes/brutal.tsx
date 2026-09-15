import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

const BAND = [
  ['营业', '周二到周日 11:00 至 20:00'],
  ['地址', '旧货巷 14 号，卷帘门那一间'],
  ['电话', '0471 2288'],
]

/**
 * 滑板店。装置：整屏的描边巨字 + 一条红色信息带。
 * 描边只在首屏用一次，其余地方都用实心，避免变成装饰。
 */
export function BrutalPage({ page }: { page: ThemePage }) {
  const items = page.items ?? []

  return (
    <>
      <section
        id="main"
        className="px-[var(--page-gutter)] pb-16 pt-16"
      >
        <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
          <div className="flex items-start justify-between gap-6">
            <span className="meta text-muted">
              {page.brand} · 自二〇一一年
            </span>
            <span
              aria-hidden
              className="size-6 shrink-0"
              style={{ backgroundColor: 'var(--hm-accent)' }}
            />
          </div>

          <h1
            className="display mt-8 text-ink"
            style={{
              fontSize: 'clamp(3.25rem, 13vw, 10rem)',
              // 中文字形几乎占满 em 盒，行高小于 1 上下两行会真的压上。
              // 紧排走 token，不要自己写数字。
              lineHeight: 'var(--lh-tight)',
              letterSpacing: 'var(--hm-tracking-display)',
            }}
          >
            <span className="block">板子</span>
            <span
              className="block"
              style={{
                color: 'transparent',
                WebkitTextStroke: '2px var(--hm-ink)',
              }}
            >
              是用来坏的
            </span>
          </h1>

          <div
            className="mt-12 flex flex-wrap items-end justify-between gap-6 pt-6"
            style={{ borderTop: '2px solid var(--hm-ink)' }}
          >
            <p
              className="display text-ink"
              style={{ fontSize: 'clamp(1.5rem, 3.4vw, 2.5rem)', maxWidth: '16ch' }}
            >
              {page.standfirst}
            </p>
            <p
              className="max-w-[30ch] text-sm text-ink-2"
              style={{ lineHeight: 'var(--lh-relaxed)' }}
            >
              整板按你的脚长和习惯配。滑断了拿回来，我们看一眼就知道是哪儿的问题。
            </p>
          </div>
        </div>
      </section>

      {/* 信息带 */}
      <section
        className="px-[var(--page-gutter)]"
        style={{ backgroundColor: 'var(--hm-accent)' }}
      >
        <div
          className="flex flex-wrap items-baseline gap-x-10 gap-y-3 py-4"
          style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
        >
          {BAND.map(([k, v]) => (
            <span key={k} className="flex items-baseline gap-3">
              {/* 红底上的字走 accent-ink，之前用 --hm-ink（近黑）压红底，对比不够 */}
              <span
                className="meta"
                style={{ color: 'var(--hm-accent-ink)' }}
              >
                {k}
              </span>
              <span
                className="font-mono text-xs"
                style={{ color: 'var(--hm-accent-ink)' }}
              >
                {v}
              </span>
            </span>
          ))}
        </div>
      </section>

      {/* 价目，用 2px 横线分行，不做卡片 */}
      <section className="px-[var(--page-gutter)] pb-24 pt-14">
        <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
          {items.map((it, i) => (
            <div
              key={it.v}
              className="grid items-baseline gap-x-6 gap-y-1 py-6 sm:grid-cols-[3rem_1fr_auto]"
              style={{ borderBottom: '2px solid var(--hm-ink)' }}
            >
              <span className="font-mono text-xs text-muted">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>
                <span
                  className="display block text-ink"
                  style={{ fontSize: 'clamp(1.5rem, 3.6vw, 2.5rem)', lineHeight: 1.06 }}
                >
                  {it.v}
                </span>
                {it.d ? (
                  <span className="mt-1 block text-sm text-muted">{it.d}</span>
                ) : null}
              </span>
              <span className="font-mono text-sm text-ink-2 sm:text-right">
                {it.k}
              </span>
            </div>
          ))}

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Cta label={page.cta} done="地址已发你" />
            <span className="text-sm text-muted">
              第一次来配板，带旧板子来，我们照着你磨掉的边配。
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
