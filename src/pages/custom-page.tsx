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
    { name: '纸色', v: 'oklch(95% 0.02 130)', live: false },
    { name: '墨色', v: 'oklch(20% 0.025 145)', live: false },
    { name: '强调', v: accent, live: true },
    { name: '强调线', v: accentLine, live: true },
    { name: '焦点', v: focusC, live: true },
    { name: '行动钮', v: 'oklch(42% 0.1 145)', live: false },
  ]

  return (
    <div className="min-h-[100dvh] bg-paper" style={live}>
      {/* 调色台的两根滑轨：轨道画成本身的意义——色相那根是全色谱，
          浓度那根从灰到饱和，读数直接长在轨道上 */}
      <style>{`
        .spec-hue::-webkit-slider-runnable-track,
        .spec-chroma::-webkit-slider-runnable-track { height: 14px; border-radius: 999px; }
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
        .spec-chroma::-moz-range-track { height: 14px; border-radius: 999px; }
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
          width: 24px; height: 24px; margin-top: -5px; border-radius: 999px;
          background: #fff; border: 2px solid oklch(20% 0.02 145);
          box-shadow: 0 1px 5px oklch(0% 0 0 / 0.35); cursor: grab;
        }
        .spec-hue::-moz-range-thumb,
        .spec-chroma::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 999px;
          background: #fff; border: 2px solid oklch(20% 0.02 145);
          box-shadow: 0 1px 5px oklch(0% 0 0 / 0.35); cursor: grab;
        }
      `}</style>

      <SiteNav />
      <main
        id="main"
        className="mx-auto px-[var(--page-gutter)] py-20 sm:py-24"
        style={{ maxWidth: 'var(--page-max)' }}
      >
        <Reveal>
          <span className="meta text-accent-line">Custom 分支</span>
          <h1
            className="display mt-3 text-ink"
            style={{ fontSize: 'var(--text-display)' }}
          >
            目录接不住的时候，现做一套
          </h1>
          <p
            className="mt-6 max-w-[50ch] text-md text-ink-2"
            style={{ lineHeight: 'var(--lh-relaxed)' }}
          >
            当某个需求带出现有目录主题都无法匹配的创意意图时，Hallmark 切到
            Custom：从零设计这一页，量身定制调色板、字体与版式。同样跑完 57
            道关卡，底下没有任何模板。
          </p>
        </Reveal>

        <Reveal className="mt-16" delay={0.05}>
          <h2
            className="display text-ink"
            style={{ fontSize: 'var(--text-xl)' }}
          >
            这一页就是一次 Custom
          </h2>
          <p
            className="mt-4 max-w-[50ch] text-md text-ink-2"
            style={{ lineHeight: 'var(--lh-relaxed)' }}
          >
            需求是「苔藓、地衣、柔粉、草本」。四个词指向一种目录里没有的感觉，
            于是有了下面这块颜色。拖那两根滑轨——你站在你正在调的颜色里。
          </p>

          {/* 调色台：现算的颜色本身就是场地 */}
          <div
            className="mt-8 overflow-hidden"
            style={{ borderRadius: 'var(--hm-radius-card)' }}
          >
            <div
              className="flex flex-col gap-10 px-6 py-10 sm:px-10 sm:py-12"
              style={{
                backgroundColor: 'var(--hm-accent)',
                minHeight: '26rem',
              }}
            >
              <div
                className="meta"
                style={{ color: 'var(--hm-ink)' }}
              >
                苔藓 · 地衣 · 柔粉 · 草本 —— 四个词，一块现算的颜色
              </div>

              <div className="flex flex-1 flex-col justify-center">
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
                  {hueName} · H {hue} · C {chroma.toFixed(2)} ——
                  拖滑轨，这个数就是活的
                </div>
              </div>

              <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                <label className="block">
                  <span className="meta" style={{ color: 'var(--hm-ink)' }}>
                    色相 H {hue}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={hue}
                    onChange={(e) => setHue(Number(e.target.value))}
                    className="spec-hue mt-3 w-full"
                    aria-label="调整强调色相"
                  />
                </label>
                <label className="block">
                  <span className="meta" style={{ color: 'var(--hm-ink)' }}>
                    浓度 C {chroma.toFixed(2)}
                  </span>
                  <input
                    type="range"
                    min={0.02}
                    max={0.3}
                    step={0.01}
                    value={chroma}
                    onChange={(e) => setChroma(Number(e.target.value))}
                    className="spec-chroma mt-3 w-full"
                    style={{ '--h': hue } as CSSProperties}
                    aria-label="调整强调色浓度"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* token 表：每一行都能复制。绿的三行是 tokens.css 里定死的，
              粉的三行跟着滑轨走 */}
          <dl className="mt-10">
            {tokens.map((t) => (
              <div
                key={t.name}
                className="hairline flex flex-wrap items-center gap-x-4 gap-y-1 py-3.5 sm:grid sm:grid-cols-[1.75rem_5rem_1fr_auto] sm:gap-y-0"
              >
                <span
                  className="size-7 shrink-0"
                  style={{
                    backgroundColor: t.v,
                    borderRadius: 'var(--hm-radius-input)',
                    border: '1px solid var(--hm-rule)',
                  }}
                />
                <span className="text-sm text-ink">
                  {t.name}
                  {t.live ? (
                    <span className="meta ml-2 text-accent-line">算</span>
                  ) : null}
                </span>
                <span className="order-last w-full min-w-0 truncate font-mono text-xs text-muted sm:order-none sm:w-auto">
                  {t.v}
                </span>
                <CopyButton
                  value={t.v}
                  ariaLabel={`复制 ${t.name} 的值`}
                  className="btn-ghost ml-auto shrink-0 px-2 py-1 text-xs sm:ml-0"
                />
              </div>
            ))}
          </dl>
          <p className="meta mt-4 text-muted">
            标「算」的三行跟着滑轨走；其余来自 tokens.css——纸和墨守着草本的绿，
            字体守在罗马衬线一轴上（display Newsreader · body Hanken Grotesk ·
            mono Geist Mono），变的只有色。
          </p>
        </Reveal>

        <Reveal className="mt-20" delay={0.08}>
          <h2
            className="display text-ink"
            style={{ fontSize: 'var(--text-xl)' }}
          >
            什么时候会触发
          </h2>
          <ol className="mt-6">
            {TRIGGERS.map((t, i) => (
              <li key={t} className="hairline flex items-baseline gap-5 py-4">
                <span className="meta w-7 shrink-0 text-accent-line">
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
            className="mt-8 max-w-[52ch] text-sm text-muted"
            style={{ lineHeight: 'var(--lh-relaxed)' }}
          >
            它是一条低调的分支，常规需求永远不会触发它。目录的 21
            套主题加上轮换规则，已经足够提供结构上的多样性。
          </p>
        </Reveal>

        <Reveal className="mt-20" delay={0.1}>
          <div className="hairline pt-8">
            <p className="text-md text-ink-2">
              想把这一套锁成可移植的设计系统，就对你的 agent 说一句话：
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <code className="font-mono text-sm text-ink">lock the system</code>
              <CopyButton
                value="lock the system"
                ariaLabel="复制 lock the system"
                className="btn-ghost px-3 py-1.5 text-sm"
              />
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  )
}
