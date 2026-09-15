import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

const SECTIONS = [
  { id: 'sec-display', name: '展示' },
  { id: 'sec-tester', name: '试字台' },
  { id: 'sec-faces', name: '字面' },
  { id: 'sec-article', name: '长文' },
  { id: 'sec-weights', name: '字重' },
  { id: 'sec-figures', name: '数字' },
  { id: 'sec-language', name: '语言' },
  { id: 'sec-license', name: '授权' },
]

/* 数据说「八档 200 到 900」，字重一节就把八档全摆出来 */
const WEIGHTS = [200, 300, 400, 500, 600, 700, 800, 900]

/* 声称支持什么，字符集就要排什么：拉丁扩展、希腊、中文都要在 */
const GLYPHS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz ÀÉÎÕÜ ñçø åæ 0123456789 &@#% .,:;!?()[]{}«»„“” ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ αβγδεζηθικλμνξοπρστυφχψω 永字八法，燕麦配思源。'

/**
 * 铸字厂。左栏索引逐节可跳，章节全部真实存在：
 * 展示（样张 + 字重滑轨）/ 试字台（自由输入 + 字号控制）/ 字面（两档字面）/
 * 长文（基线网格）/ 字重（八档全列）/ 数字（等宽对照）/ 语言（字符集）/ 授权。
 */
export function SpecimenPage({ page }: { page: ThemePage }) {
  const [w, setW] = useState(340)
  const [fontSize, setFontSize] = useState(48)
  const [testText, setTestText] = useState('永字八法 · Oatmeal Foundry 1984')
  const [tabularNums, setTabularNums] = useState(true)

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-12">
      <div
        style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
        className="grid gap-x-10 gap-y-12 lg:grid-cols-12"
      >
        {/* 左栏：编号索引，吸顶对齐，点击跳节 */}
        <aside className="lg:col-span-3 lg:sticky lg:top-24 lg:self-start">
          <div className="meta text-muted">{page.discipline}</div>
          <ol className="mt-6 flex flex-wrap gap-x-5 lg:flex-col">
            {SECTIONS.map((s, i) => (
              <li key={s.id} className="lg:py-2">
                <a
                  href={`#${s.id}`}
                  className="tap flex items-baseline gap-3 text-sm text-ink-2 transition-colors duration-200 hover:text-accent-line"
                >
                  <span className="meta w-7 shrink-0 text-accent-line font-mono font-semibold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.name}
                </a>
              </li>
            ))}
          </ol>
          <div
            className="mt-8 pt-5"
            style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
          >
            <div className="meta text-muted">当前动态字重</div>
            <div
              className="display mt-1 text-3xl text-ink font-semibold"
              style={{ fontVariationSettings: `"wght" ${w}` }}
            >
              {w}
            </div>
            <div className="meta mt-2 text-muted">
              {w < 300
                ? 'ExtraLight'
                : w < 400
                  ? 'Light'
                  : w < 500
                    ? 'Regular'
                    : w < 600
                      ? 'Medium'
                      : w < 700
                        ? 'SemiBold'
                        : w < 800
                          ? 'Bold'
                          : 'Black'}
            </div>
          </div>
        </aside>

        {/* 右栏：各节详情 */}
        <div className="lg:col-span-9">
          {/* 01 展示 */}
          <section id="sec-display" className="scroll-mt-24">
            <h1
              className="display text-ink"
              style={{ fontSize: 'clamp(2.25rem, 5.4vw, 4rem)', lineHeight: 1.05 }}
            >
              {page.title}
            </h1>
            <div
              className="display mt-10 select-none text-ink"
              style={{
                fontSize: 'clamp(2.5rem, 9vw, 6.25rem)',
                lineHeight: 1.02,
                fontVariationSettings: `"wght" ${w}, "SOFT" 20, "opsz" 144`,
                letterSpacing: 'var(--hm-tracking-display)',
              }}
            >
              Oatmeal
            </div>
            
            {/* 字重滑轨控制栏 */}
            <div className="mt-8 rounded-lg border border-rule bg-paper/50 p-4">
              <label className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="meta font-mono font-bold text-ink">WEIGHT</span>
                  <span className="font-mono text-xs text-accent-line font-semibold">{w}</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={900}
                  step={10}
                  value={w}
                  onChange={(e) => setW(Number(e.target.value))}
                  className="min-h-[44px] w-full max-w-md cursor-pointer"
                  aria-label="调整展示字重"
                />
                <span className="font-mono text-xs text-muted">200 ~ 900 连续轴</span>
              </label>
            </div>
          </section>

          {/* 02 试字台：交互打字与字号装置 */}
          <section id="sec-tester" className="mt-20 scroll-mt-24">
            <SectionHead no="02" name="试字台 · TYPE TESTER" />
            <div className="mt-6 rounded-lg border border-rule bg-paper/60 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
                <label className="flex items-center gap-3">
                  <span className="meta text-muted">字号:</span>
                  <input
                    type="range"
                    min={18}
                    max={96}
                    step={2}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="min-h-[36px] w-32 cursor-pointer sm:w-44"
                    aria-label="调整试字字号"
                  />
                  <span className="font-mono text-xs text-ink">{fontSize}px</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTabularNums((v) => !v)}
                    className={`min-h-[32px] rounded px-2.5 py-1 font-mono text-xs transition-colors ${
                      tabularNums
                        ? 'bg-ink text-paper'
                        : 'border border-rule text-muted hover:border-ink'
                    }`}
                    aria-pressed={tabularNums}
                  >
                    {tabularNums ? '等宽数字 ON' : '等宽数字 OFF'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestText('天地玄黄，宇宙洪荒。日月盈昃，辰宿列张。')}
                    className="min-h-[32px] rounded border border-rule px-2.5 py-1 font-mono text-xs text-muted hover:border-ink hover:text-ink"
                  >
                    载入千字文
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <input
                  type="text"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="w-full border-none bg-transparent p-0 text-ink focus:outline-none"
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: 1.15,
                    fontVariationSettings: `"wght" ${w}`,
                    fontVariantNumeric: tabularNums ? 'tabular-nums' : 'normal',
                  }}
                  placeholder="在此输入自定义试字文本..."
                  aria-label="自定义试字文本输入框"
                />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-rule/50 pt-2 text-[11px] text-muted font-mono">
                <span>可点击上方文字直接编辑</span>
                <span>Render: Canvas Free / Subpixel Antialiasing</span>
              </div>
            </div>
          </section>

          {/* 03 字面 */}
          <section id="sec-faces" className="mt-20 scroll-mt-24">
            <SectionHead no="03" name="字面" />
            <div
              className="mt-8 pb-8"
              style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
            >
              <div className="meta flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-5">
                <span className="text-accent-line">Oatmeal Text 400</span>
                <span className="text-muted">正文，字腔放开，久读不糊</span>
              </div>
              {/* 正文样张压在基线网格上，行距 2.5rem 对齐 2.5rem 的格距 */}
              <div className="relative mt-5">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(to bottom, var(--hm-rule) 0 1px, transparent 1px 2.5rem)',
                  }}
                />
                <p
                  className="relative text-ink-2"
                  style={{
                    fontSize: '1.5rem',
                    lineHeight: '2.5rem',
                    fontVariationSettings: `"wght" ${w}`,
                    textAlign: 'justify',
                  }}
                >
                  {page.standfirst}
                  正文用的这一档不追风格，追的是读十页眼睛不累：字腔放开，
                  行末的逗号收窄，数字做成等宽，标点挤压按中文习惯调过。
                </p>
              </div>
            </div>
            <div
              className="pb-8"
              style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
            >
              <div className="meta flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-5">
                <span className="text-accent-line">Oatmeal Display 340</span>
                <span className="text-muted">标题，高对比，衬线收薄</span>
              </div>
              <div
                className="display mt-4 text-ink"
                style={{
                  fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
                  lineHeight: 1.1,
                  fontVariationSettings: `"wght" ${w}, "opsz" 144`,
                  letterSpacing: 'var(--hm-tracking-display)',
                }}
              >
                Oatmeal Display 340
              </div>
            </div>
          </section>

          {/* 04 长文：为长文而生的字体，就要把一篇真的文章排出来 */}
          <section id="sec-article" className="mt-20 scroll-mt-24">
            <SectionHead no="04" name="长文" />
            <article className="mt-8" style={{ maxWidth: '40em' }}>
              <h2
                className="display text-ink"
                style={{
                  fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                  lineHeight: 1.15,
                }}
              >
                小字号的字腔
              </h2>
              <p className="meta mt-3 text-muted">设计手记 · 第三节</p>
              <p
                className="mt-8 text-xl text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                字腔是笔画里面的白。字一小，白就闭上，糊成一团。
              </p>
              <p
                className="mt-5 text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                燕麦体的正文档把字腔放大了百分之六，看着松一点，排起来反而紧。
                逗号是另一个四年：全角逗号收在左下，行末那一个压到半角宽，字面不动。
                每行末尾省下的那点白，攒够一行就是一个字的错位——长文读起来，
                眼睛就在这点错位里歇气。
              </p>
              <blockquote
                className="mt-8 text-ink"
                style={{
                  borderLeft: '2px solid var(--hm-accent)',
                  paddingLeft: '1.25em',
                  fontSize: '1.125rem',
                  lineHeight: 'var(--lh-relaxed)',
                }}
              >
                排得紧不挤、松不散，中间那条线就是字腔画出来的。
              </blockquote>
              <p
                className="mt-8 text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                数字另做了一套等宽的。表格里 0 和 1 一样宽，账目才对得齐。
                这件事没人夸，做错了所有人都看得见。
              </p>
              <p className="meta mt-8 text-muted">
                以上样张用 Oatmeal Text 400 排，行距 1.9，标点挤压开。
              </p>
            </article>
          </section>

          {/* 05 字重：八档全列 */}
          <section id="sec-weights" className="mt-20 scroll-mt-24">
            <SectionHead no="05" name="字重" />
            <div className="mt-6">
              {WEIGHTS.map((n) => (
                <div
                  key={n}
                  className="flex items-baseline justify-between gap-6 py-3.5 transition-colors"
                  style={{
                    borderTop: 'var(--hm-rule-card) solid var(--hm-rule)',
                    backgroundColor: n === w ? 'oklch(0% 0 0 / 0.03)' : undefined,
                  }}
                >
                  <span
                    className="display text-2xl"
                    style={{
                      fontVariationSettings: `"wght" ${n}`,
                      color: n === w ? 'var(--hm-accent)' : undefined,
                    }}
                  >
                    燕麦 Oatmeal
                  </span>
                  <span className="meta shrink-0 font-mono text-muted">{n}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted" style={{ lineHeight: 'var(--lh-relaxed)' }}>
              中间四档最常用。拖上面那根滑轨，落在这八档上的字重会实时高亮。
            </p>
          </section>

          {/* 06 数字：等宽数字对照 */}
          <section id="sec-figures" className="mt-20 scroll-mt-24">
            <SectionHead no="06" name="数字" />
            <div className="mt-8 space-y-3 text-right text-ink">
              {[24, 34, 48].map((px) => (
                <div
                  key={px}
                  style={{
                    fontSize: `${px / 16}rem`,
                    lineHeight: 1.15,
                    fontVariantNumeric: 'tabular-nums',
                    fontVariationSettings: `"wght" ${w}`,
                  }}
                >
                  0123456789
                </div>
              ))}
            </div>
            <p className="meta mt-5 text-muted">
              等宽字位：0 到 9 每一位一样宽，右缘对齐，字号换档也不挪。
            </p>
            <p
              className="mt-10 text-xl text-ink-2"
              style={{ lineHeight: 'var(--lh-relaxed)' }}
            >
              他说："来了。"她没应，转身走了。夜班从十一点半，排到凌晨四点过。
            </p>
            <p className="meta mt-4 text-muted">
              标点挤压做在字体里：行末逗号压到半角宽，引号随字面走，网页上不用管。
            </p>
          </section>

          {/* 07 语言 */}
          <section id="sec-language" className="mt-20 scroll-mt-24">
            <SectionHead no="07" name="语言" />
            <p
              className="mt-6 break-words text-lg text-ink-2"
              style={{ lineHeight: 'var(--lh-relaxed)', wordSpacing: '0.3em' }}
            >
              {GLYPHS}
            </p>
            <p className="mt-4 text-sm text-muted">拉丁扩展 + 希腊，中文配思源宋体。</p>
          </section>

          {/* 08 授权 */}
          <section id="sec-license" className="mt-20 scroll-mt-24">
            <SectionHead no="08" name="授权" />
            <div
              className="mt-6 pb-6"
              style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
            >
              <div className="meta flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-5">
                <span className="text-accent-line">桌面 + 网页</span>
                <span className="text-muted">一次买断，不按流量</span>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Cta label={page.cta} done="字样包发你了" />
              <span className="text-sm text-muted">试字样与完整字符表，一次给全。</span>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

/** 节头：编号 + 节名 + 贯穿右栏的细线 */
function SectionHead({ no, name }: { no: string; name: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="meta text-accent-line font-mono font-bold">{no}</span>
      <span className="meta text-ink">{name}</span>
      <span
        aria-hidden
        className="h-px flex-1"
        style={{ backgroundColor: 'var(--hm-rule)' }}
      />
    </div>
  )
}
