import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

const BAND = [
  ['营业', '周二到周日 11:00 至 20:00'],
  ['地址', '旧货巷 14 号，卷帘门那一间'],
  ['电话', '0471 2288'],
  ['现场', '提供免费贴砂纸与桥钉调试'],
]

interface DeckSpec {
  size: string
  truck: string
  wheel: string
  style: string
}

const DECK_CONFIGS: Record<string, DeckSpec> = {
  '7.75"': { size: '7.75 英寸', truck: '129mm 支架', wheel: '52mm / 101A 硬轮', style: '技术街式 · 翻板迅捷' },
  '8.00"': { size: '8.00 英寸', truck: '139mm 支架', wheel: '53mm / 99A 经典', style: '全能街头 · 黄金平衡' },
  '8.25"': { size: '8.25 英寸', truck: '144mm 支架', wheel: '54mm / 99A 宽轮', style: '碗池道具 · 落地稳固' },
  '8.50"': { size: '8.50 英寸', truck: '149mm 支架', wheel: '56mm / 85A 软轮', style: '大乱跳台 · 刷街巡游' },
}

/**
 * 滑板店。装置：整屏的描边巨字 + 红色硬核信息带 + 现场配板规格速查。
 * 描边只在首屏用一次，其余地方都用实心，粗黑线直截了当。
 */
export function BrutalPage({ page }: { page: ThemePage }) {
  const items = page.items ?? []
  const [outlineMode, setOutlineMode] = useState<'stroke' | 'solid' | 'invert'>('stroke')
  const [selectedWidth, setSelectedWidth] = useState('8.00"')

  const currentDeck = DECK_CONFIGS[selectedWidth]

  return (
    <main id="main" className="pb-24">
      {/* 首屏巨字区 */}
      <section className="px-[var(--page-gutter)] pb-16 pt-12 sm:pt-16">
        <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="meta font-mono font-bold text-muted">
              {page.brand} · HARDCORE SKATE SHOP · SINCE 2011
            </span>
            <div className="flex items-center gap-2">
              <span className="meta text-xs text-muted">字体状态:</span>
              <button
                type="button"
                onClick={() => setOutlineMode('stroke')}
                className={`min-h-[32px] rounded border px-2 py-1 font-mono text-xs ${
                  outlineMode === 'stroke'
                    ? 'border-ink bg-ink text-paper'
                    : 'border-rule text-muted hover:border-ink'
                }`}
                aria-pressed={outlineMode === 'stroke'}
              >
                描边
              </button>
              <button
                type="button"
                onClick={() => setOutlineMode('solid')}
                className={`min-h-[32px] rounded border px-2 py-1 font-mono text-xs ${
                  outlineMode === 'solid'
                    ? 'border-ink bg-ink text-paper'
                    : 'border-rule text-muted hover:border-ink'
                }`}
                aria-pressed={outlineMode === 'solid'}
              >
                实心
              </button>
            </div>
          </div>

          <h1
            className="display mt-8 text-ink"
            style={{
              fontSize: 'clamp(3.25rem, 13vw, 10rem)',
              lineHeight: 'var(--lh-tight)',
              letterSpacing: 'var(--hm-tracking-display)',
            }}
          >
            <span className="block">板子</span>
            <span
              className="block transition-all duration-200"
              style={{
                color: outlineMode === 'solid' ? 'var(--hm-ink)' : 'transparent',
                WebkitTextStroke:
                  outlineMode === 'stroke' ? '2.5px var(--hm-ink)' : 'none',
              }}
            >
              是用来坏的
            </span>
          </h1>

          <div
            className="mt-12 flex flex-wrap items-end justify-between gap-8 pt-6"
            style={{ borderTop: '2px solid var(--hm-ink)' }}
          >
            <p
              className="display text-ink"
              style={{ fontSize: 'clamp(1.5rem, 3.4vw, 2.5rem)', maxWidth: '18ch', lineHeight: 1.15 }}
            >
              {page.standfirst}
            </p>
            <p
              className="max-w-[34ch] text-sm text-ink-2"
              style={{ lineHeight: 'var(--lh-relaxed)' }}
            >
              整板按你的脚长和习惯配。滑断了拿回来，我们看一眼断口就知道是哪儿的问题。
              断板享旧件移植免费服务。
            </p>
          </div>
        </div>
      </section>

      {/* 硬核信息带 */}
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
              <span
                className="meta font-mono font-bold"
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

      {/* 硬核配板装置 */}
      <section className="px-[var(--page-gutter)] pt-14">
        <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
          <div className="rounded-lg border-2 border-ink bg-paper p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-4">
              <div>
                <span className="meta font-mono font-bold text-accent-line">TOOL #01 · 配板速查台</span>
                <h2 className="display text-xl text-ink">选择你的板面宽度 (DECK WIDTH)</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(DECK_CONFIGS).map((width) => (
                  <button
                    key={width}
                    type="button"
                    onClick={() => setSelectedWidth(width)}
                    className={`min-h-[38px] rounded px-3 py-1.5 font-mono text-xs font-bold transition-all ${
                      selectedWidth === width
                        ? 'bg-ink text-paper ring-2 ring-accent-line'
                        : 'border border-ink/40 bg-paper text-ink hover:border-ink'
                    }`}
                    aria-pressed={selectedWidth === width}
                  >
                    {width}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-4">
              <div className="border-l-2 border-ink pl-3">
                <span className="meta text-muted">适配桥架 (TRUCK)</span>
                <div className="mt-1 font-mono text-sm font-bold text-ink">{currentDeck.truck}</div>
              </div>
              <div className="border-l-2 border-ink pl-3">
                <span className="meta text-muted">轮组推荐 (WHEELS)</span>
                <div className="mt-1 font-mono text-sm font-bold text-ink">{currentDeck.wheel}</div>
              </div>
              <div className="border-l-2 border-ink pl-3">
                <span className="meta text-muted">风格取向 (STYLE)</span>
                <div className="mt-1 font-mono text-sm font-bold text-ink">{currentDeck.style}</div>
              </div>
              <div className="border-l-2 border-ink pl-3">
                <span className="meta text-muted">调教周期 (CHECK)</span>
                <div className="mt-1 font-mono text-sm font-bold text-ink">每 30 天回店紧桥</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 价目清单，用 2px 横线分行，不做卡片 */}
      <section className="px-[var(--page-gutter)] pb-24 pt-14">
        <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
          <div className="border-b-2 border-ink pb-3">
            <span className="meta font-mono font-bold text-ink">SERVICE & PRICE · 透明明细</span>
          </div>
          {items.map((it, i) => (
            <div
              key={it.v}
              className="grid items-baseline gap-x-6 gap-y-1 py-6 sm:grid-cols-[3.5rem_1fr_auto]"
              style={{ borderBottom: '2px solid var(--hm-ink)' }}
            >
              <span className="font-mono text-xs font-bold text-muted">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <span
                  className="display block text-ink"
                  style={{ fontSize: 'clamp(1.5rem, 3.6vw, 2.5rem)', lineHeight: 1.08 }}
                >
                  {it.v}
                </span>
                {it.d ? (
                  <span className="mt-1 block text-sm text-muted" style={{ lineHeight: 'var(--lh-normal)' }}>
                    {it.d}
                  </span>
                ) : null}
              </div>
              <span className="font-mono text-sm font-bold text-ink-2 sm:text-right">
                {it.k}
              </span>
            </div>
          ))}

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Cta label={page.cta} done="已把到店路线发你" />
            <span className="text-sm text-muted">
              第一次来配板，带旧板子来，我们照着你磨掉的边配。
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}
