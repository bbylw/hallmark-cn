import { useState } from 'react'
import { Img } from '../../components/archetypes'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

interface InkChannel {
  name: string
  code: string
  color: string
  offset: { x: number; y: number }
}

const INKS: InkChannel[] = [
  { name: '青', code: 'C', color: 'oklch(62% 0.18 230)', offset: { x: -1, y: 1 } },
  { name: '品红', code: 'M', color: 'oklch(60% 0.22 340)', offset: { x: 1.5, y: -0.8 } },
  { name: '黄', code: 'Y', color: 'oklch(88% 0.18 95)', offset: { x: -0.8, y: -1.2 } },
  { name: '黑', code: 'K', color: 'oklch(20% 0.01 255)', offset: { x: 0, y: 0 } },
]

const SPECS = [
  ['纸张', '一百二十克胶版 · 未覆膜象牙白'],
  ['成品', '594 × 841 mm (标准 A1)'],
  ['印数', '每版限定 300 张 · 铅印编号'],
  ['装帧', '骑马钉联展手册 · 纯手工配页'],
  ['网点', '175 LPI 高精调频加网'],
]

const CELL = [
  { span: 'col-span-2 row-span-2', tone: 'accent', plate: 'PLATE-01 / MASTER' },
  { span: 'col-span-2', tone: 'fill', plate: 'PLATE-02 / RUNNER' },
  { span: 'col-span-1', tone: 'tint', plate: 'PLATE-03' },
  { span: 'col-span-1', tone: 'tint', plate: 'PLATE-04' },
  { span: 'col-span-2', tone: 'bare', plate: 'PLATE-05 / ARCHIVE' },
  { span: 'col-span-2', tone: 'bare', plate: 'PLATE-06 / ARCHIVE' },
] as const

/**
 * 四色海报节。装置：四色分色与 1 毫米套准错位实验台，
 * 页面本身就是一张拼版台 —— 大格放主展数字，小格放其余场次，最后两格是现场。
 */
export function GridPage({ page }: { page: ThemePage }) {
  const items = page.items ?? []
  const [activeInks, setActiveInks] = useState<Record<string, boolean>>({
    C: true,
    M: true,
    Y: true,
    K: true,
  })
  const [misregistration, setMisregistration] = useState(false)

  const toggleInk = (code: string) => {
    setActiveInks((prev) => ({ ...prev, [code]: !prev[code] }))
  }

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-10">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        
        {/* 顶部装置：分色条与套印错位实验 */}
        <div className="rounded-lg border border-rule bg-paper/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="meta font-mono font-bold text-ink">CMYK 分色通道</span>
              <span className="meta text-muted">· 点击色块切断通道</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMisregistration((v) => !v)}
                className={`min-h-[36px] rounded px-3 py-1 font-mono text-xs transition-colors ${
                  misregistration
                    ? 'bg-ink text-paper ring-2 ring-accent-line'
                    : 'border border-rule bg-paper text-ink-2 hover:border-ink'
                }`}
                aria-pressed={misregistration}
                aria-label="模拟印刷机 1 毫米套印错位"
              >
                {misregistration ? '✓ 已开启 1mm 套准微错位' : '模拟 1mm 套准微错位'}
              </button>
            </div>
          </div>

          {/* 交互分色条 */}
          <div className="mt-4 flex flex-col gap-1.5 overflow-hidden py-1" aria-hidden>
            {INKS.map((s, i) => {
              const enabled = activeInks[s.code]
              const offsetX = misregistration ? s.offset.x * 2.5 : 0
              const offsetY = misregistration ? s.offset.y * 2.5 : 0
              return (
                <div
                  key={s.code}
                  className="h-[4px] rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: enabled ? s.color : 'var(--hm-rule)',
                    opacity: enabled ? 1 : 0.25,
                    transform: `translate(${offsetX}px, ${offsetY}px)`,
                    marginLeft: `${i * 9}px`,
                    marginRight: `${(INKS.length - 1 - i) * 9}px`,
                  }}
                />
              )
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
            <div className="flex flex-wrap items-center gap-3">
              {INKS.map((s) => {
                const enabled = activeInks[s.code]
                return (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => toggleInk(s.code)}
                    className="flex items-center gap-1.5 rounded border border-transparent px-2 py-1 transition-all hover:border-rule"
                    aria-label={`切换 ${s.name} 色通道`}
                    aria-pressed={enabled}
                  >
                    <span
                      aria-hidden
                      className="size-3 rounded-full border border-black/10 transition-transform"
                      style={{
                        backgroundColor: s.color,
                        opacity: enabled ? 1 : 0.2,
                        transform: enabled ? 'scale(1)' : 'scale(0.8)',
                      }}
                    />
                    <span
                      className={`font-mono text-xs ${
                        enabled ? 'font-medium text-ink' : 'text-muted line-through'
                      }`}
                    >
                      {s.name} ({s.code})
                    </span>
                  </button>
                )
              })}
            </div>
            <span className="meta text-muted">
              原则：四色分版胶印 · 严禁任意附加专色
            </span>
          </div>
        </div>

        {/* 标题：第二行缩进 */}
        <h1
          className="display mt-14 text-ink"
          style={{ fontSize: 'clamp(2.5rem, 7.2vw, 5.25rem)', lineHeight: 1.05 }}
        >
          <span className="block">四面墙，</span>
          <span className="block pl-[12%]">三十七张海报</span>
        </h1>

        <div className="mt-14 grid gap-x-10 gap-y-12 lg:grid-cols-12">
          {/* 左：工单说明与场次规格 */}
          <div className="lg:col-span-4">
            <p
              className="text-md text-ink-2"
              style={{ lineHeight: 'var(--lh-relaxed)' }}
            >
              {page.standfirst}
            </p>
            
            <div className="mt-8 rounded-lg border border-rule bg-paper/40 p-4">
              <div className="flex items-center justify-between border-b border-rule pb-2">
                <span className="meta font-mono font-bold text-ink">PRINT TICKET #04</span>
                <span className="font-mono text-[10px] text-muted">SWISS GRID / CMYK</span>
              </div>
              <div className="mt-3 divide-y divide-rule">
                {SPECS.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between py-2.5">
                    <span className="meta text-muted">{k}</span>
                    <span className="font-mono text-xs text-ink-2">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Cta label={page.cta} done="已加入现场导览席位" />
            </div>
          </div>

          {/* 右：拼版台 */}
          <div className="lg:col-span-8">
            <div
              className="grid grid-cols-2 gap-px overflow-hidden rounded-lg sm:grid-cols-4"
              style={{
                backgroundColor: 'var(--hm-rule)',
                border: '1px solid var(--hm-rule)',
              }}
            >
              {items.map((it, i) => {
                const c = CELL[i] ?? CELL[5]
                const accent = c.tone === 'accent'
                return (
                  <div
                    key={it.v}
                    className={`${c.span} group relative flex min-h-[9.5rem] flex-col justify-between p-5 transition-transform duration-150 hover:z-10`}
                    style={{
                      backgroundColor: accent
                        ? 'var(--hm-accent)'
                        : c.tone === 'fill'
                          ? 'var(--hm-paper-2)'
                          : c.tone === 'tint'
                            ? 'var(--hm-paper-3)'
                            : 'var(--hm-paper)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="meta font-mono"
                        style={{
                          color: accent ? 'var(--hm-accent-ink)' : 'var(--hm-muted)',
                        }}
                      >
                        {it.k}
                      </span>
                      <span
                        className="font-mono text-[9px] opacity-40 group-hover:opacity-100"
                        style={{
                          color: accent ? 'var(--hm-accent-ink)' : 'var(--hm-muted)',
                        }}
                      >
                        {c.plate}
                      </span>
                    </div>
                    <div>
                      <span
                        className="display block"
                        style={{
                          fontSize: accent
                            ? 'clamp(2rem, 4.6vw, 3.5rem)'
                            : 'var(--text-xl)',
                          lineHeight: 1.08,
                          color: accent ? 'var(--hm-accent-ink)' : 'var(--hm-ink)',
                        }}
                      >
                        {it.v}
                      </span>
                      {it.d ? (
                        <span
                          className="mt-2 block text-xs"
                          style={{
                            color: accent
                              ? 'var(--hm-accent-ink)'
                              : 'var(--hm-muted)',
                            opacity: accent ? 0.85 : 1,
                            lineHeight: 'var(--lh-normal)',
                          }}
                        >
                          {it.d}
                        </span>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 官方示例 (采用 minmax(0, 1fr) 防御 Gate 50) */}
        {page.images?.length ? (
          <div className="mt-20 grid gap-x-10 gap-y-6 lg:grid-cols-[16rem_1fr]">
            <figcaption>
              <span className="meta text-accent-line">官方打样打底</span>
              <h2 className="display mt-1 text-lg text-ink" style={{ lineHeight: 1.2 }}>
                印刷机出样示例
              </h2>
              <p
                className="mt-3 text-sm text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                Hallmark 用这套主题生成的示例页。讲座里讲的「错位的那一毫米」，
                在其中一个示例里就是这么做的。
              </p>
            </figcaption>
            <div className="grid gap-4 sm:grid-cols-[repeat(2,minmax(0,1fr))]">
              {page.images.slice(0, 2).map((s) => (
                <div
                  key={s}
                  className="overflow-hidden"
                  style={{
                    border: '1px solid var(--hm-rule)',
                    borderRadius: 'var(--hm-radius-card)',
                  }}
                >
                  <Img slug={s} alt={`Hallmark 生成的示例页 ${s}`} variant="fill" />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
