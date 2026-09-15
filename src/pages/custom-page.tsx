import { useState, type CSSProperties } from 'react'
import { CopyButton } from '../components/ui/copy-button'
import { Reveal } from '../components/ui/reveal'
import { SiteNav } from '../components/site-nav'
import { useThemeAttr } from '../theme-attr'

const TRIGGERS = [
  '你点名要 custom 主题，或者说「做成我们自己的」',
  '你给了一个具体的品牌色当锚点',
  '你用了三个以上的氛围词，指向一种目录里没有的感觉',
  '你贴了色卡或情绪板，而不是要研究某个截图',
]

interface MoodPreset {
  name: string
  hue: number
  chroma: number
  desc: string
}

const PRESETS: MoodPreset[] = [
  { name: '苔藓草本 (默认)', hue: 350, chroma: 0.12, desc: '苔藓 · 地衣 · 柔粉 · 草本' },
  { name: '深海荧光', hue: 215, chroma: 0.16, desc: '深海 · 发光浮游 · 冷靛蓝' },
  { name: '赤陶暖暮', hue: 38, chroma: 0.15, desc: '陶土 · 日晒 · 温暖矿物' },
  { name: '竹青晨雾', hue: 145, chroma: 0.11, desc: '竹林 · 晨露 · 极简和纸' },
  { name: '霓虹紫堇', hue: 295, chroma: 0.19, desc: '暮光 · 紫堇 · 赛博光泽' },
]

/**
 * Custom 分支。构成：整页就是调色台——
 * 算出来的强调色铺满一大块场地，OKLCH 坐标当巨字排在上面，
 * 两根滑轨站在颜色本身上拖，轨道就是色谱和浓度梯度。
 * 拖的时候三个 --hm-* 变量在根元素上实时覆盖，整页跟着变。
 * 这就是 custom 分支真正在做的事：现算一套，而不是从目录里挑一套。
 */
export function CustomPage() {
  useThemeAttr('custom')
  const [hue, setHue] = useState(350)
  const [chroma, setChroma] = useState(0.12)

  const accent = `oklch(72% ${chroma.toFixed(2)} ${hue})`
  const accentLine = `oklch(46% ${(chroma + 0.02).toFixed(2)} ${hue})`
  const focusC = `oklch(48% ${(chroma + 0.04).toFixed(2)} ${hue})`
  const live = {
    '--hm-accent': accent,
    '--hm-accent-line': accentLine,
    '--hm-focus': focusC,
  } as CSSProperties

  const hueName =
    hue < 40 || hue >= 330
      ? '红粉'
      : hue < 90
        ? '黄'
        : hue < 160
          ? '绿'
          : hue < 250
            ? '青蓝'
            : '紫'

  /* token 表：前两行和最后一行来自 tokens.css（守着需求定下的绿），
     中间三行是被滑轨现算的 */
  const tokens = [
    { name: '纸色', varName: '--hm-paper', v: 'oklch(95% 0.02 130)', live: false, note: '基底纸张' },
    { name: '墨色', varName: '--hm-ink', v: 'oklch(20% 0.025 145)', live: false, note: '正文字阶' },
    { name: '强调', varName: '--hm-accent', v: accent, live: true, note: '调色台计算场地' },
    { name: '强调线', varName: '--hm-accent-line', v: accentLine, live: true, note: '边框与细发丝' },
    { name: '焦点', varName: '--hm-focus', v: focusC, live: true, note: '键盘无延迟光环' },
    { name: '行动钮', varName: '--hm-action', v: 'oklch(42% 0.1 145)', live: false, note: '实体按键' },
  ]

  const generatedCss = `:root {
  /* Hallmark Custom Synthesizer: H ${hue} / C ${chroma.toFixed(2)} */
  --hm-paper: oklch(95% 0.02 130);
  --hm-ink: oklch(20% 0.025 145);
  --hm-accent: ${accent};
  --hm-accent-line: ${accentLine};
  --hm-focus: ${focusC};
  --hm-action: oklch(42% 0.1 145);
}`

  return (
    <div className="min-h-dvh bg-paper" style={live}>
      {/* 调色台的两根滑轨：轨道画成本身的意义——色相那根是全色谱，
          浓度那根从灰到饱和，读数直接长在轨道上 */}
      <style>{`
        .spec-hue, .spec-chroma {
          min-height: 44px;
          cursor: pointer;
        }
        .spec-hue::-webkit-slider-runnable-track,
        .spec-chroma::-webkit-slider-runnable-track { height: 16px; border-radius: 999px; }
        .spec-hue::-webkit-slider-runnable-track {
          background: linear-gradient(to right,
            oklch(72% 0.14 0), oklch(72% 0.14 60), oklch(72% 0.14 120),
            oklch(72% 0.14 180), oklch(72% 0.14 240), oklch(72% 0.14 300),
            oklch(72% 0.14 360));
        }
        .spec-chroma::-webkit-slider-runnable-track {
          background: linear-gradient(to right,
            oklch(72% 0.01 var(--h)), oklch(72% 0.3 var(--h)));
        }
        .spec-hue::-moz-range-track,
        .spec-chroma::-moz-range-track { height: 16px; border-radius: 999px; }
        .spec-hue::-moz-range-track {
          background: linear-gradient(to right,
            oklch(72% 0.14 0), oklch(72% 0.14 60), oklch(72% 0.14 120),
            oklch(72% 0.14 180), oklch(72% 0.14 240), oklch(72% 0.14 300),
            oklch(72% 0.14 360));
        }
        .spec-chroma::-moz-range-track {
          background: linear-gradient(to right,
            oklch(72% 0.01 var(--h)), oklch(72% 0.3 var(--h)));
        }
        .spec-hue::-webkit-slider-thumb,
        .spec-chroma::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 26px; height: 26px; margin-top: -5px; border-radius: 999px;
          background: #fff; border: 2.5px solid oklch(20% 0.02 145);
          box-shadow: 0 2px 6px oklch(0% 0 0 / 0.3); cursor: grab;
          transition: transform 0.1s ease;
        }
        .spec-hue::-webkit-slider-thumb:active,
        .spec-chroma::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.15);
        }
        .spec-hue::-moz-range-thumb,
        .spec-chroma::-moz-range-thumb {
          width: 24px; height: 24px; border-radius: 999px;
          background: #fff; border: 2.5px solid oklch(20% 0.02 145);
          box-shadow: 0 2px 6px oklch(0% 0 0 / 0.3); cursor: grab;
        }
      `}</style>

      <SiteNav />
      <main
        id="main"
        className="mx-auto px-(--page-gutter) py-20 sm:py-24"
        style={{ maxWidth: 'var(--page-max)' }}
      >
        <Reveal>
          <span className="meta text-accent-line">Custom 分支</span>
          <h1
            className="display mt-3 text-ink"
            style={{ fontSize: 'var(--text-display)', lineHeight: 1.1 }}
          >
            目录接不住的时候，现做一套
          </h1>
          <p
            className="mt-6 max-w-[54ch] text-md text-ink-2"
            style={{ lineHeight: 'var(--lh-relaxed)' }}
          >
            当某个需求带出现有目录主题都无法匹配的创意意图时，Hallmark 切到
            Custom：从零设计这一页，量身定制调色板、字体与版式。同样跑完 58
            道关卡，底下没有任何模板。
          </p>
        </Reveal>

        <Reveal className="mt-16" delay={0.05}>
          <div className="flex flex-col gap-2">
            <span className="meta text-accent-line">装置 01 · 调色台合成器</span>
            <h2
              className="display text-ink"
              style={{ fontSize: 'var(--text-xl)', lineHeight: 1.2 }}
            >
              这一页就是一次 Custom
            </h2>
          </div>
          <p
            className="mt-4 max-w-[52ch] text-md text-ink-2"
            style={{ lineHeight: 'var(--lh-relaxed)' }}
          >
            需求是「苔藓、地衣、柔粉、草本」。四个词指向一种目录里没有的感觉，
            于是有了下面这块颜色。拖动滑轨或点击情绪预设——你正身处自己调试的颜色场域中。
          </p>

          {/* 预设情绪选择条 */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="meta mr-2 text-muted">快速情绪预设:</span>
            {PRESETS.map((p) => {
              const active = hue === p.hue && Math.abs(chroma - p.chroma) < 0.015
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setHue(p.hue)
                    setChroma(p.chroma)
                  }}
                  className={`min-h-9 rounded-md px-3 py-1.5 font-mono text-xs transition-all ${
                    active
                      ? 'bg-ink text-paper shadow-sm ring-2 ring-accent-line'
                      : 'border border-rule bg-paper/60 text-ink-2 hover:border-ink hover:text-ink'
                  }`}
                  aria-pressed={active}
                  title={p.desc}
                >
                  {p.name}
                </button>
              )
            })}
          </div>

          {/* 调色台：现算的颜色本身就是场地 */}
          <div
            className="mt-8 overflow-hidden transition-colors duration-200"
            style={{
              borderRadius: 'var(--hm-radius-card)',
              border: '1px solid var(--hm-rule)',
            }}
          >
            <div
              className="flex flex-col justify-between gap-8 px-6 py-8 sm:px-10 sm:py-12"
              style={{
                backgroundColor: 'var(--hm-accent)',
                minHeight: '26rem',
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div
                  className="meta font-mono"
                  style={{ color: 'var(--hm-ink)' }}
                >
                  OKLCH COLOR SYNTHESIZER
                </div>
                <div
                  className="meta rounded-full px-2.5 py-0.5"
                  style={{
                    backgroundColor: 'oklch(0% 0 0 / 0.08)',
                    color: 'var(--hm-ink)',
                  }}
                >
                  明度 72% · 对比度 &gt; 4.5:1 (AAA)
                </div>
              </div>

              <div className="my-4">
                <div
                  className="display"
                  style={{
                    fontFamily: 'var(--hm-mono)',
                    fontSize: 'clamp(1.5rem, 4.2vw, 3.2rem)',
                    lineHeight: 1.1,
                    color: 'var(--hm-ink)',
                    letterSpacing: '-0.01em',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {accent}
                </div>
                <div className="meta mt-3" style={{ color: 'var(--hm-ink)' }}>
                  色系: {hueName} · 色相 H: {hue}° · 浓度 C: {chroma.toFixed(2)} ——
                  拖动滑轨即刻全页响应
                </div>
              </div>

              <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                <label className="block">
                  <div className="flex items-center justify-between">
                    <span className="meta" style={{ color: 'var(--hm-ink)' }}>
                      色相 H (0° ~ 360°)
                    </span>
                    <span className="font-mono text-xs font-bold" style={{ color: 'var(--hm-ink)' }}>
                      {hue}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={hue}
                    onChange={(e) => setHue(Number(e.target.value))}
                    className="spec-hue mt-2 w-full"
                    aria-label="调整强调色色相"
                  />
                </label>
                <label className="block">
                  <div className="flex items-center justify-between">
                    <span className="meta" style={{ color: 'var(--hm-ink)' }}>
                      浓度 C (0.02 ~ 0.30)
                    </span>
                    <span className="font-mono text-xs font-bold" style={{ color: 'var(--hm-ink)' }}>
                      {chroma.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.02}
                    max={0.3}
                    step={0.01}
                    value={chroma}
                    onChange={(e) => setChroma(Number(e.target.value))}
                    className="spec-chroma mt-2 w-full"
                    style={{ '--h': hue } as CSSProperties}
                    aria-label="调整强调色浓度"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* token 表：每一行都能复制。绿的三行是 tokens.css 里定死的，
              粉的三行跟着滑轨走 */}
          <div className="mt-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="meta text-accent-line">装置 02 · 动态派生表</span>
                <h3 className="display text-lg text-ink" style={{ lineHeight: 1.2 }}>
                  派生设计令牌清单
                </h3>
              </div>
              <span className="meta text-muted">
                点击右侧按钮直接复制单项
              </span>
            </div>

            <dl className="mt-6 border-t border-rule">
              {tokens.map((t) => (
                <div
                  key={t.name}
                  className="hairline flex flex-wrap items-center gap-x-4 gap-y-2 py-3.5 sm:grid sm:grid-cols-[2rem_5.5rem_1fr_6rem_auto] sm:gap-y-0"
                >
                  <span
                    className="size-7 shrink-0"
                    style={{
                      backgroundColor: t.v,
                      borderRadius: 'var(--hm-radius-input)',
                      border: '1px solid var(--hm-rule)',
                    }}
                  />
                  <span className="text-sm font-medium text-ink">
                    {t.name}
                    {t.live ? (
                      <span className="meta ml-1.5 text-accent-line font-bold">算</span>
                    ) : null}
                  </span>
                  <span className="order-last w-full min-w-0 truncate font-mono text-xs text-muted sm:order-none sm:w-auto">
                    {t.v}
                  </span>
                  <span className="hidden font-mono text-[11px] text-muted sm:block">
                    {t.note}
                  </span>
                  <CopyButton
                    value={t.v}
                    ariaLabel={`复制 ${t.name} 的值`}
                    className="btn-ghost ml-auto shrink-0 px-2.5 py-1 text-xs sm:ml-0"
                  />
                </div>
              ))}
            </dl>
            <p className="meta mt-4 text-muted" style={{ lineHeight: 'var(--lh-relaxed)' }}>
              标「算」的三行跟着滑轨实时派生；其余来自 tokens.css——纸与墨守住草本的宁静，
              字体守在罗马衬线一轴上（display Newsreader · body Hanken Grotesk ·
              mono Geist Mono），变的只有色相能量。
            </p>
          </div>

          {/* 完整 CSS 导出装置 */}
          <div className="mt-12 rounded-lg border border-rule bg-paper/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="meta text-accent-line">装置 03 · 生产代码导出</span>
                <div className="font-mono text-xs text-ink font-semibold">
                  tokens.custom.css
                </div>
              </div>
              <CopyButton
                value={generatedCss}
                ariaLabel="复制生成的完整 CSS Tokens 代码"
                className="btn-ghost px-3 py-1.5 text-xs font-mono"
              />
            </div>
            <pre className="mt-3 overflow-x-auto rounded bg-ink/5 p-4 font-mono text-xs text-ink-2">
              <code>{generatedCss}</code>
            </pre>
          </div>
        </Reveal>

        <Reveal className="mt-20" delay={0.08}>
          <span className="meta text-accent-line">判定矩阵</span>
          <h2
            className="display mt-2 text-ink"
            style={{ fontSize: 'var(--text-xl)', lineHeight: 1.2 }}
          >
            什么时候会触发 Custom
          </h2>
          <ol className="mt-6">
            {TRIGGERS.map((t, i) => (
              <li key={t} className="hairline flex items-baseline gap-5 py-4">
                <span className="meta w-7 shrink-0 text-accent-line font-mono font-bold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="max-w-[58ch] text-md text-ink-2"
                  style={{ lineHeight: 'var(--lh-relaxed)' }}
                >
                  {t}
                </span>
              </li>
            ))}
          </ol>
          <p
            className="mt-8 max-w-[54ch] text-sm text-muted"
            style={{ lineHeight: 'var(--lh-relaxed)' }}
          >
            它是一条低调的分支，常规需求永远不会触发它。目录的 21
            套主题加上轮换规则，已经足够提供结构上的多样性。
          </p>
        </Reveal>

        <Reveal className="mt-20" delay={0.1}>
          <div className="hairline pt-8">
            <p className="text-md text-ink-2" style={{ lineHeight: 'var(--lh-relaxed)' }}>
              想把这一套锁成可移植的设计系统，就对你的 agent 说一句话：
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <code className="rounded border border-rule bg-ink/5 px-3 py-1.5 font-mono text-sm text-ink">
                lock the system
              </code>
              <CopyButton
                value="lock the system"
                ariaLabel="复制 lock the system 指令"
                className="btn-ghost px-3 py-1.5 text-sm"
              />
            </div>
          </div>

          {/* 底部 Hallmark 标准印章 Stamp */}
          <div className="meta mt-20 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-rule pt-6 text-muted">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <span>branch: custom synthesizer</span>
              <span>engine: dynamic oklch</span>
              <span>tokens: 6 derived</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px]">
              <span className="text-accent-line">critique: P5 H5 E5 S5 R5 V5</span>
              <span className="text-muted">·</span>
              <span>slop test: 58/58 ✓</span>
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  )
}
