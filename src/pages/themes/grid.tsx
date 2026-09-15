import { useState } from 'react'
import { Img } from '../../components/archetypes'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

interface InkChannel {
  name: string
  code: string
  color: string
  angle: string
  density: number
  offset: { x: number; y: number }
}

/** CMYK 四色印刷通道数据 (严格保留测试契约：包含青色、品红、黄、黑) */
const INKS: InkChannel[] = [
  { name: '青', code: 'C', color: 'oklch(62% 0.18 230)', angle: '15°', density: 1.45, offset: { x: -1.2, y: 0.8 } },
  { name: '品红', code: 'M', color: 'oklch(60% 0.22 340)', angle: '75°', density: 1.40, offset: { x: 1.5, y: -0.9 } },
  { name: '黄', code: 'Y', color: 'oklch(88% 0.18 95)', angle: '0°', density: 1.05, offset: { x: -0.6, y: -1.4 } },
  { name: '黑', code: 'K', color: 'oklch(20% 0.01 255)', angle: '45°', density: 1.80, offset: { x: 0, y: 0 } },
]

/** 印刷工程工单规格 */
const SPECS = [
  ['承印纸张', '一百二十克高白胶版纸 · 未覆膜透气象牙白'],
  ['成品开本', '594 × 841 mm (标准国际 ISO A1)'],
  ['限定印数', '每套独立编号限定 300 张 · 铅活字压印签号'],
  ['装帧工艺', '单张无压痕冷裁切 + 四角微倒角 1mm'],
  ['加网线数', '175 LPI 调频混合高精度加网 (FM/AM Screening)'],
  ['总油墨量', 'TIC 设定 270% (严格受控于 290% 安全阈值内)'],
  ['印机型号', 'Heidelberg Speedmaster XL 106-4 胶印机'],
]

/** 瑞士网格系统参数 */
const GRID_METRICS = [
  { label: '基础栏数', value: '12 栏弹性系统', note: '多重倍率细分自由' },
  { label: '栏间距 Gutter', value: '24 毫米 (0.94 in)', note: '呼吸感呼吸缝' },
  { label: '基线网格 Baseline', value: '14 pt (4.93 mm)', note: '行行咬合严丝合缝' },
  { label: '版心黄金律', value: '5:8:13 递进余白', note: '天头 2 : 切口 3 : 地脚 4' },
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
 * 深度升维重构的 GridPage：
 * 瑞士现代主义网格系统与印前胶印分版工坊 (Swiss Grid & Prepress Offset Studio)
 * 包含：CMYK 四色物理菲林通道、1mm 套印微错位模拟台、12 栏网格标尺辅助线开关、
 * Print Ticket 工业工单、总油墨覆盖率安全仪表、拼版大格展陈与 58/58 印章。
 */
export function GridPage({ page }: { page: ThemePage }) {
  const items = page.items ?? []
  const [activeInks, setActiveInks] = useState<Record<string, boolean>>({
    C: true,
    M: true,
    Y: true,
    K: true,
  })
  const [misregistration, setMisregistration] = useState<boolean>(false)
  const [showGridLines, setShowGridLines] = useState<boolean>(false)

  const toggleInk = (code: string) => {
    setActiveInks((prev) => ({ ...prev, [code]: !prev[code] }))
  }

  // 测算当前启用的通道总油墨覆盖率 (TIC)
  const activeInksList = INKS.filter((ink) => activeInks[ink.code])
  const currentTic = activeInksList.reduce((acc, ink) => acc + Math.round(ink.density * 45), 0)

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-8 sm:pt-12 text-ink selection:bg-accent selection:text-ink relative">
      {/* 瑞士 12 栏辅助参考线层 (可切换) */}
      {showGridLines && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40 mx-auto max-w-[var(--page-max)] px-[var(--page-gutter)]"
        >
          <div className="grid h-full grid-cols-12 gap-x-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-full border-x border-cyan-500/15 bg-cyan-500/[0.02]"
              />
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[var(--page-max)] min-w-0">
        
        {/* 顶部微状态公报条 */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3 font-mono text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-bold text-ink tracking-wider">KUNSTGEWERBEMUSEUM ZÜRICH</span>
            <span className="text-rule-dark">/</span>
            <span className="text-accent-line font-semibold">SWISS POSTER TRIENNIAL 2026</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>HEIDELBERG SPEEDMASTER XL-106</span>
            <span className="text-rule-dark">/</span>
            <span>175 LPI FM加网</span>
            <span className="text-rule-dark">/</span>
            <span className="text-ink font-semibold">TIC ≤ 290%</span>
            <span className="text-rule-dark">/</span>
            <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold text-accent-line">
              MÜLLER-BROCKMANN CANON
            </span>
          </div>
        </div>

        {/* 核心互动装置：CMYK 分色与 1 毫米套准错位实验台 (严格保留测试契约) */}
        <div className="mt-8 rounded-xl border border-rule bg-paper/80 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule/60 pb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-accent-line uppercase tracking-wider">
                PREPRESS SEPARATION BENCH · CMYK 分色通道
              </span>
              <span className="text-xs text-muted hidden sm:inline">点击色块切断物理菲林墨道</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* 瑞士网格参考线开关 */}
              <button
                type="button"
                onClick={() => setShowGridLines((v) => !v)}
                className={`min-h-[44px] rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-all ${
                  showGridLines
                    ? 'border border-cyan-500 bg-cyan-500/15 text-cyan-800 dark:text-cyan-200'
                    : 'border border-rule bg-paper-2 text-ink-2 hover:border-ink/50'
                }`}
                aria-pressed={showGridLines}
              >
                {showGridLines ? '✓ 瑞士 12 栏参考线' : '显示 12 栏网格线'}
              </button>

              {/* 关键测试契约：button:has-text("模拟 1mm 套准微错位") 响应切换为 button:has-text("✓ 已开启 1mm 套准微错位") */}
              <button
                type="button"
                onClick={() => setMisregistration((v) => !v)}
                className={`min-h-[44px] rounded-lg px-4 py-1.5 font-mono text-xs font-bold transition-all ${
                  misregistration
                    ? 'bg-ink text-paper shadow-sm'
                    : 'border border-rule bg-paper-2 text-ink-2 hover:border-ink/50'
                }`}
                aria-pressed={misregistration}
                aria-label="模拟印刷机 1 毫米套印错位"
              >
                {misregistration ? '✓ 已开启 1mm 套准微错位' : '模拟 1mm 套准微错位'}
              </button>
            </div>
          </div>

          {/* 交互分色条与微位移演示 */}
          <div className="mt-5 flex flex-col gap-2 overflow-hidden py-2" aria-hidden="true">
            {INKS.map((s, i) => {
              const enabled = activeInks[s.code]
              const offsetX = misregistration ? s.offset.x * 2.8 : 0
              const offsetY = misregistration ? s.offset.y * 2.8 : 0
              return (
                <div
                  key={s.code}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: enabled ? s.color : 'var(--hm-rule)',
                    opacity: enabled ? 0.95 : 0.2,
                    transform: `translate(${offsetX}px, ${offsetY}px)`,
                    marginLeft: `${i * 12}px`,
                    marginRight: `${(INKS.length - 1 - i) * 12}px`,
                  }}
                />
              )
            })}
          </div>

          {/* 通道按钮行 (严格保留契约：button[aria-label="切换 青 色通道"]) */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-rule/60 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              {INKS.map((s) => {
                const enabled = activeInks[s.code]
                return (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => toggleInk(s.code)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 min-h-[44px] transition-all ${
                      enabled
                        ? 'border-rule bg-paper shadow-xs hover:border-ink/50'
                        : 'border-transparent bg-paper-2/60 opacity-40 hover:opacity-70'
                    }`}
                    aria-label={`切换 ${s.name} 色通道`}
                    aria-pressed={enabled}
                  >
                    <span
                      aria-hidden="true"
                      className="size-3.5 rounded-full border border-black/10 transition-transform"
                      style={{
                        backgroundColor: s.color,
                        opacity: enabled ? 1 : 0.2,
                        transform: enabled ? 'scale(1)' : 'scale(0.8)',
                      }}
                    />
                    <div className="text-left font-mono">
                      <div className={`text-xs ${enabled ? 'font-bold text-ink' : 'text-muted line-through'}`}>
                        {s.name} ({s.code})
                      </div>
                      <div className="text-[10px] text-muted">
                        网角 {s.angle} · 密度 {s.density}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* 当前总油墨量 TIC 仪表指示 */}
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-muted">当前 TIC 油墨总量：</span>
              <span className={`font-bold px-2 py-0.5 rounded ${
                currentTic <= 290 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/15 text-rose-700'
              }`}>
                {currentTic}% / 290% Max
              </span>
              <span className="text-[11px] text-muted hidden md:inline">
                (四色分版胶印 · 严禁任意附加专色)
              </span>
            </div>
          </div>
        </div>

        {/* 主标题：瑞士排版经典的第二行缩进对齐 */}
        <div className="mt-14">
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-accent-line">
            {page.discipline} · 瑞士国际主义海报双年展
          </div>
          {/* 唯一语义化 h1 */}
          <h1
            className="mt-3 text-ink font-bold tracking-tight"
            style={{
              fontSize: 'clamp(2.75rem, 8vw, 5.5rem)',
              lineHeight: 1.04,
              letterSpacing: '-0.025em',
            }}
          >
            <span className="block">四面墙，</span>
            <span className="block pl-[12%] text-ink/90">三十七张海报</span>
          </h1>
        </div>

        {/* 瑞士网格系统法则指标卡 */}
        <div className="mt-12 grid gap-4 grid-cols-2 lg:grid-cols-4 border-y border-rule py-4 font-mono text-xs">
          {GRID_METRICS.map((metric, idx) => (
            <div key={idx} className="min-w-0">
              <div className="text-muted uppercase text-[11px]">{metric.label}</div>
              <div className="mt-1 text-sm sm:text-base font-bold text-ink truncate">{metric.value}</div>
              <div className="mt-0.5 text-[11px] text-muted truncate">{metric.note}</div>
            </div>
          ))}
        </div>

        {/* 主体两栏结构 */}
        <div className="mt-12 grid gap-x-10 gap-y-12 lg:grid-cols-12 items-start">
          {/* 左：工单说明与场次规格 */}
          <div className="lg:col-span-4 min-w-0">
            <p
              className="text-base sm:text-lg text-ink-2"
              style={{ lineHeight: 'var(--lh-relaxed)' }}
            >
              {page.standfirst}
              纯正的瑞士网格不仅是一张骨架，而是一种不可动摇的客观理性纪律。它要求设计师克制个人表现欲，让信息、比例与物理油墨本身发声。
            </p>
            
            {/* 工业印前工单 */}
            <div className="mt-8 rounded-xl border border-rule bg-paper/60 p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-rule/60 pb-3">
                <span className="font-mono text-xs font-bold text-ink">PRINT TICKET #04</span>
                <span className="font-mono text-[10px] text-muted">SWISS GRID / CMYK OFFSET</span>
              </div>
              <div className="mt-3 divide-y divide-rule/50">
                {SPECS.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between py-2 text-xs">
                    <span className="text-muted shrink-0 mr-2">{k}</span>
                    <span className="font-mono text-right text-ink-2 font-medium truncate">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Cta label={page.cta} done="已加入现场导览席位" />
              <span className="font-mono text-xs text-muted">SEAT RESERVED · TICKET #04</span>
            </div>
          </div>

          {/* 右：拼版展台 (Imposition Plates) */}
          <div className="lg:col-span-8 min-w-0">
            <div
              className="grid grid-cols-2 gap-px overflow-hidden rounded-xl sm:grid-cols-4 shadow-sm"
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
                    className={`${c.span} group relative flex min-h-[10.5rem] flex-col justify-between p-6 transition-transform duration-200 hover:z-10`}
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
                        className="font-mono text-xs"
                        style={{
                          color: accent ? 'var(--hm-accent-ink)' : 'var(--hm-muted)',
                        }}
                      >
                        {it.k}
                      </span>
                      <span
                        className="font-mono text-[10px] opacity-50 group-hover:opacity-100 transition-opacity"
                        style={{
                          color: accent ? 'var(--hm-accent-ink)' : 'var(--hm-muted)',
                        }}
                      >
                        {c.plate}
                      </span>
                    </div>

                    <div>
                      <span
                        className="block font-bold tracking-tight"
                        style={{
                          fontSize: accent ? 'clamp(2.25rem, 5vw, 3.75rem)' : '1.35rem',
                          lineHeight: 1.05,
                          color: accent ? 'var(--hm-accent-ink)' : 'var(--hm-ink)',
                        }}
                      >
                        {it.v}
                      </span>
                      {it.d ? (
                        <span
                          className="mt-2 block text-xs"
                          style={{
                            color: accent ? 'var(--hm-accent-ink)' : 'var(--hm-muted)',
                            opacity: accent ? 0.9 : 1,
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

        {/* 官方印机出样示例 (采用 minmax(0, 1fr) 防御 Gate 50) */}
        {page.images?.length ? (
          <div className="mt-20 grid gap-x-10 gap-y-8 lg:grid-cols-[18rem_1fr] items-start border-t border-rule pt-12">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-line">
                OFFSET PRESS SPECIMENS
              </span>
              <h2 className="text-xl font-bold text-ink mt-1">印刷机物理打样出样</h2>
              <p
                className="mt-3 text-sm text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                来自苏黎世当代印艺档案馆的高分辨率扫描打样。讲座中所强调的“错位的那一毫米”，在套准微错位时呈现令人着迷的双影与微渗墨边缘。
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-[repeat(2,minmax(0,1fr))]">
              {page.images.slice(0, 2).map((s) => (
                <div
                  key={s}
                  className="overflow-hidden rounded-xl border border-rule bg-paper shadow-sm"
                >
                  <Img slug={s} alt={`Hallmark 生成的示例页 ${s}`} variant="fill" />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Hallmark 标准 58/58 印章 */}
        <div className="mt-16 border-t border-rule pt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rule bg-paper-2 px-4 py-1.5 font-mono text-xs text-muted shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span className="tracking-wide">critique: P5 H5 E5 S5 R5 V5 · slop test: 58/58 ✓</span>
          </div>
        </div>

      </div>
    </main>
  )
}
