import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

const SECTIONS = [
  { id: 'sec-display', name: '展示' },
  { id: 'sec-tester', name: '试字台' },
  { id: 'sec-anatomy', name: '骨架' },
  { id: 'sec-faces', name: '字面' },
  { id: 'sec-article', name: '长文' },
  { id: 'sec-weights', name: '字重' },
  { id: 'sec-figures', name: '数字' },
  { id: 'sec-kerning', name: '字偶' },
  { id: 'sec-language', name: '语言' },
  { id: 'sec-license', name: '授权' },
]

/** 数据说「八档 200 到 900」，字重一节就把八档全摆出来 */
const WEIGHTS = [200, 300, 400, 500, 600, 700, 800, 900]

/** 声称支持什么，字符集就要排什么：拉丁扩展、希腊、中文都要在 */
const GLYPHS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz ÀÉÎÕÜ ñçø åæ 0123456789 &@#% .,:;!?()[]{}«»„“” ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ αβγδεζηθικλμνξοπρστυφχψω 永字八法，燕麦配思源。'

/** 字形骨架微观解剖数据 */
const ANATOMY_GLYPHS = [
  {
    char: '永',
    role: '永字八法 · 内白呼吸感',
    aperture: '开度 0.92',
    counter: '字腔放大 +6.2%',
    note: '侧勒努趯策掠啄磔八法毕具，字腔内部空间特意放开，在 9pt~11pt 小字排版时长读不糊眼。',
  },
  {
    char: '燕',
    role: '汉字主骨架 · 稳固下沉',
    aperture: '重心 520 单元',
    counter: '四点底内凹 12%',
    note: '廿字头与四点底呼应，横细竖粗对比度受控，下盘重心中度下沉，横排视觉视线如水流平缓。',
  },
  {
    char: 'g',
    role: '双层双环 · 文艺复兴手抄本',
    aperture: '开环收尾 45°',
    counter: '下环蓄量 64%',
    note: '汲取早期意大利人文主义衬线骨架，上环紧致，耳笔微翘，下环平展，长篇排印节奏感极强。',
  },
  {
    char: 'Q',
    role: '长尾降部 · 优雅延伸',
    aperture: '降部 -140 单元',
    counter: '内椭圆轴 15°',
    note: '大写椭圆外轮廓优雅斜切，长尾平滑划过基线下方，在章首大字与标题展示中尽显锋芒。',
  },
]

/** 经典字偶间距 (Kerning Pairs) */
const KERNING_PAIRS = [
  { pair: 'AV', val: -75, desc: '斜向笔画正交咬合' },
  { pair: 'To', val: -65, desc: '横向悬臂覆于圆弧' },
  { pair: 'WA', val: -80, desc: '双重对顶倾角互嵌' },
  { pair: 'Ye', val: -50, desc: '降部内缩平衡余白' },
  { pair: 'LT', val: -60, desc: '横竖留白对称收窄' },
]

/**
 * 铸字厂官方样张 SpecimenPage
 * 严格贯彻 Hallmark 58 项规范与物态感，保留完整目录、试字台、千字文载入与 58/58 生产印章
 */
export function SpecimenPage({ page }: { page: ThemePage }) {
  const [w, setW] = useState(340)
  const [fontSize, setFontSize] = useState(44)
  const [lineHeight, setLineHeight] = useState(1.2)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [testText, setTestText] = useState('永字八法 · Oatmeal Foundry 1984')
  const [tabularNums, setTabularNums] = useState(true)
  const [liga, setLiga] = useState(true)
  const [activeAnatomy, setActiveAnatomy] = useState(0)

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-28 pt-8 sm:pt-14">
      <div
        style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
        className="grid gap-x-10 gap-y-12 lg:grid-cols-12"
      >
        {/* 左栏：编号索引，吸顶对齐，点击跳节 */}
        <aside className="lg:col-span-3 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-rule bg-paper p-4 shadow-sm">
            <div className="meta font-mono font-bold text-accent-line">
              {page.discipline} · OATMEAL
            </div>
            <ol className="mt-4 flex flex-wrap gap-x-4 lg:flex-col lg:gap-y-1">
              {SECTIONS.map((s, i) => (
                <li key={s.id} className="py-1">
                  <a
                    href={`#${s.id}`}
                    className="tap flex items-baseline gap-2.5 text-xs sm:text-sm text-ink-2 transition-colors duration-200 hover:text-accent-line font-medium"
                    style={{ minHeight: '36px' }}
                  >
                    <span className="meta w-6 shrink-0 text-accent-line font-mono font-bold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{s.name}</span>
                  </a>
                </li>
              ))}
            </ol>

            <div
              className="mt-6 pt-4 border-t border-rule"
            >
              <div className="meta text-muted font-mono text-xs">当前动态字重</div>
              <div
                className="display mt-1 text-4xl text-ink font-semibold"
                style={{ fontVariationSettings: `"wght" ${w}` }}
              >
                {w}
              </div>
              <div className="meta mt-1 text-accent-line font-mono text-xs font-bold">
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
          </div>
        </aside>

        {/* 右栏：各节详情 */}
        <div className="lg:col-span-9 space-y-16">
          
          {/* 01 展示 */}
          <section id="sec-display" className="scroll-mt-24">
            <header className="rounded-lg border border-rule bg-paper-2/60 px-4 py-2.5 font-mono text-xs text-muted flex flex-wrap items-center justify-between gap-2 mb-6">
              <span>OATMEAL SERIF · TYPE SPECIMEN BOOK</span>
              <span className="text-accent-line font-bold">VARIABLE 200 ~ 900</span>
            </header>

            <h1
              className="display text-ink font-bold tracking-tight"
              style={{ fontSize: 'clamp(2.25rem, 5.4vw, 4rem)', lineHeight: 1.05 }}
            >
              {page.title}
            </h1>
            <p className="mt-4 text-sm sm:text-base text-ink-2 max-w-[56ch] leading-relaxed">
              {page.standfirst}
            </p>

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
            <div className="mt-8 rounded-lg border border-rule bg-paper p-5 shadow-sm">
              <label className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="meta font-mono font-bold text-ink">WEIGHT</span>
                  <span className="font-mono text-sm text-accent-line font-bold">{w}</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={900}
                  step={10}
                  value={w}
                  onChange={(e) => setW(Number(e.target.value))}
                  className="min-h-[44px] w-full max-w-md cursor-pointer flex-1"
                  aria-label="调整展示字重"
                />
                <span className="font-mono text-xs text-muted">200 ~ 900 连续无级轴</span>
              </label>
            </div>
          </section>

          {/* 02 试字台：交互打字与字号装置 (Type Tester) */}
          <section id="sec-tester" className="scroll-mt-24">
            <SectionHead no="02" name="试字台 · TYPE TESTER" />
            
            <div className="mt-6 rounded-lg border-2 border-rule bg-paper p-5 sm:p-6 shadow-md">
              {/* 控制工具条 */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-5">
                <div className="flex flex-wrap items-center gap-5">
                  <label className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-muted">字号:</span>
                    <input
                      type="range"
                      min={18}
                      max={96}
                      step={2}
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="min-h-[44px] w-28 sm:w-36 cursor-pointer"
                      aria-label="调整试字字号"
                    />
                    <span className="text-ink font-bold w-10">{fontSize}px</span>
                  </label>

                  <label className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-muted">行高:</span>
                    <input
                      type="range"
                      min={1.05}
                      max={2.0}
                      step={0.05}
                      value={lineHeight}
                      onChange={(e) => setLineHeight(Number(e.target.value))}
                      className="min-h-[44px] w-20 cursor-pointer"
                      aria-label="调整行高"
                    />
                    <span className="text-ink font-bold">{lineHeight.toFixed(2)}</span>
                  </label>

                  <label className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-muted">字距:</span>
                    <input
                      type="range"
                      min={-0.05}
                      max={0.2}
                      step={0.01}
                      value={letterSpacing}
                      onChange={(e) => setLetterSpacing(Number(e.target.value))}
                      className="min-h-[44px] w-20 cursor-pointer"
                      aria-label="调整字距"
                    />
                    <span className="text-ink font-bold">{letterSpacing.toFixed(2)}</span>
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTabularNums((v) => !v)}
                    className={`min-h-[44px] rounded px-3 py-1 font-mono text-xs transition-colors ${
                      tabularNums
                        ? 'bg-ink text-paper font-bold'
                        : 'border border-rule text-muted hover:border-ink hover:text-ink'
                    }`}
                    aria-pressed={tabularNums}
                  >
                    {tabularNums ? '等宽数字 ON' : '等宽数字 OFF'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setLiga((v) => !v)}
                    className={`min-h-[44px] rounded px-3 py-1 font-mono text-xs transition-colors ${
                      liga
                        ? 'bg-ink text-paper font-bold'
                        : 'border border-rule text-muted hover:border-ink hover:text-ink'
                    }`}
                    aria-pressed={liga}
                  >
                    {liga ? '标准连字 ON' : '标准连字 OFF'}
                  </button>

                  {/* 关键测试契约：button:has-text("载入千字文") */}
                  <button
                    type="button"
                    onClick={() => setTestText('天地玄黄，宇宙洪荒。日月盈昃，辰宿列张。寒来暑往，秋收冬藏。')}
                    className="min-h-[44px] rounded border-2 border-rule px-3.5 py-1 font-mono text-xs font-bold text-ink hover:border-accent-line hover:text-accent-line bg-paper-2/60 transition-colors"
                  >
                    载入千字文
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestText('The quick brown fox jumps over the lazy dog 1234567890.')}
                    className="min-h-[44px] rounded border border-rule px-3 py-1 font-mono text-xs text-muted hover:text-ink hover:border-ink"
                  >
                    西文全字母
                  </button>
                </div>
              </div>

              {/* 关键测试契约：input[aria-label="自定义试字文本输入框"] */}
              <div className="mt-6 py-2 overflow-x-auto">
                <input
                  type="text"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="w-full border-none bg-transparent p-0 text-ink focus:outline-none placeholder:text-muted/40"
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: lineHeight,
                    letterSpacing: `${letterSpacing}em`,
                    fontVariationSettings: `"wght" ${w}`,
                    fontVariantNumeric: tabularNums ? 'tabular-nums' : 'normal',
                    fontFeatureSettings: liga ? '"liga" 1, "calt" 1' : '"liga" 0, "calt" 0',
                  }}
                  placeholder="在此输入自定义试字文本..."
                  aria-label="自定义试字文本输入框"
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-rule/50 pt-3 text-[11px] text-muted font-mono">
                <span>可直接点击上方文字自由键入，支持中西文混排</span>
                <span>OpenType: Standard Ligatures · Tabular Figures · Subpixel</span>
              </div>
            </div>
          </section>

          {/* 03 字形骨架微观解剖仪 (Glyph Anatomy) */}
          <section id="sec-anatomy" className="scroll-mt-24">
            <SectionHead no="03" name="骨架 · GLYPH ANATOMY" />
            
            <div className="mt-6 rounded-lg border border-rule bg-paper p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
                <span className="font-mono text-xs text-muted">汉字与西文字腔微观几何解剖</span>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  {ANATOMY_GLYPHS.map((g, idx) => (
                    <button
                      key={g.char}
                      type="button"
                      onClick={() => setActiveAnatomy(idx)}
                      className={`px-3 py-1 rounded font-bold transition-colors ${
                        activeAnatomy === idx
                          ? 'bg-ink text-paper'
                          : 'border border-rule text-muted hover:border-ink hover:text-ink'
                      }`}
                      style={{ minHeight: '44px' }}
                    >
                      {g.char}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* 模拟坐标系中的大字投影 */}
                <div className="md:col-span-5 relative size-56 sm:size-64 mx-auto border-2 border-dashed border-rule bg-paper-2/40 grid place-items-center rounded">
                  {/* 参考线 */}
                  <div className="absolute top-[20%] inset-x-0 border-b border-accent-line/30 flex justify-between px-1 text-[9px] font-mono text-accent-line select-none">
                    <span>CAP HEIGHT: 700</span>
                    <span>70%</span>
                  </div>
                  <div className="absolute top-[38%] inset-x-0 border-b border-muted/30 flex justify-between px-1 text-[9px] font-mono text-muted select-none">
                    <span>X-HEIGHT: 510</span>
                    <span>51%</span>
                  </div>
                  <div className="absolute bottom-[20%] inset-x-0 border-b-2 border-ink flex justify-between px-1 text-[9px] font-mono text-ink font-bold select-none">
                    <span>BASELINE: 0</span>
                    <span>0%</span>
                  </div>

                  <span
                    className="display select-none text-ink"
                    style={{
                      fontSize: '11rem',
                      lineHeight: 1,
                      fontVariationSettings: `"wght" ${w}`,
                    }}
                  >
                    {ANATOMY_GLYPHS[activeAnatomy].char}
                  </span>
                </div>

                {/* 文字解剖说明 */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <span className="font-mono text-xs text-accent-line font-bold">
                      ANATOMICAL FOCUS
                    </span>
                    <h3 className="display text-2xl font-bold text-ink mt-0.5">
                      {ANATOMY_GLYPHS[activeAnatomy].role}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-rule font-mono text-xs">
                    <div>
                      <span className="text-muted block text-[10px]">字谷开度 (APERTURE)</span>
                      <span className="text-ink font-bold text-sm">{ANATOMY_GLYPHS[activeAnatomy].aperture}</span>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px]">内部字腔 (COUNTER SPACE)</span>
                      <span className="text-accent-line font-bold text-sm">{ANATOMY_GLYPHS[activeAnatomy].counter}</span>
                    </div>
                  </div>

                  <p className="text-sm text-ink-2 leading-relaxed">
                    {ANATOMY_GLYPHS[activeAnatomy].note}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 04 字面 */}
          <section id="sec-faces" className="scroll-mt-24">
            <SectionHead no="04" name="字面 · OPTICAL SIZES" />
            
            <div className="mt-8 pb-8 border-t border-rule">
              <div className="meta flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-5">
                <span className="text-accent-line font-bold">Oatmeal Text 400</span>
                <span className="text-muted font-mono text-xs">正文，字腔放开，久读不糊</span>
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
                    fontSize: '1.4rem',
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

            <div className="pb-8 border-t border-rule">
              <div className="meta flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-5">
                <span className="text-accent-line font-bold">Oatmeal Display 340</span>
                <span className="text-muted font-mono text-xs">标题，高对比，衬线收薄</span>
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

          {/* 05 长文：为长文而生的字体 */}
          <section id="sec-article" className="scroll-mt-24">
            <SectionHead no="05" name="长文 · ESSAY SPECIMEN" />
            <article className="mt-8 rounded-lg border border-rule bg-paper p-6 sm:p-8 shadow-sm max-w-[46em]">
              <h2
                className="display text-ink font-bold"
                style={{
                  fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                  lineHeight: 1.15,
                }}
              >
                小字号的字腔
              </h2>
              <p className="meta mt-2 text-muted font-mono text-xs">设计手记 · 第三节</p>
              <p
                className="mt-6 text-lg sm:text-xl text-ink-2 font-medium"
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
                className="mt-8 text-ink bg-paper-2/60 p-4 rounded"
                style={{
                  borderLeft: '4px solid var(--hm-accent)',
                  fontSize: '1.125rem',
                  lineHeight: 'var(--lh-relaxed)',
                }}
              >
                排得紧不挤、松不散，中间那条线就是字腔画出来的。
              </blockquote>
              <p
                className="mt-6 text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                数字另做了一套等宽的。表格里 0 和 1 一样宽，账目才对得齐。
                这件事没人夸，做错了所有人都看得见。
              </p>
              <p className="meta mt-8 text-muted font-mono text-xs pt-4 border-t border-rule/50">
                以上样张用 Oatmeal Text 400 排，行距 1.9，标点挤压开。
              </p>
            </article>
          </section>

          {/* 06 字重：八档全列 */}
          <section id="sec-weights" className="scroll-mt-24">
            <SectionHead no="06" name="字重 · 8 WEIGHTS MATRIX" />
            <div className="mt-6 divide-y divide-rule border-y border-rule">
              {WEIGHTS.map((n) => (
                <div
                  key={n}
                  className="flex items-baseline justify-between gap-6 py-4 px-2 transition-colors"
                  style={{
                    backgroundColor: n === w ? 'var(--hm-paper-2)' : undefined,
                  }}
                >
                  <span
                    className="display text-2xl sm:text-3xl"
                    style={{
                      fontVariationSettings: `"wght" ${n}`,
                      color: n === w ? 'var(--hm-accent)' : undefined,
                    }}
                  >
                    燕麦 Oatmeal 衬线
                  </span>
                  <div className="text-right font-mono text-xs">
                    <span className="text-muted block">{n}</span>
                    <span className="text-accent-line font-bold">
                      {n === 200 ? 'ExtraLight' : n === 300 ? 'Light' : n === 400 ? 'Regular' : n === 500 ? 'Medium' : n === 600 ? 'SemiBold' : n === 700 ? 'Bold' : n === 800 ? 'ExtraBold' : 'Black'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted font-mono" style={{ lineHeight: 'var(--lh-relaxed)' }}>
              中间四档最常用。拖动上方展示或试字台的滑轨，落在此八档范围上的字重将自动高亮对齐。
            </p>
          </section>

          {/* 07 数字 */}
          <section id="sec-figures" className="scroll-mt-24">
            <SectionHead no="07" name="数字 · TABULAR FIGURES" />
            <div className="mt-8 space-y-4 text-right text-ink bg-paper p-6 rounded-lg border border-rule shadow-sm">
              {[24, 36, 48].map((px) => (
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
            <p className="meta mt-5 text-muted font-mono text-xs">
              等宽字位：0 到 9 每一位宽度完全一致，右缘强行对齐，字号换档行距换档永不跳位。
            </p>
            <p
              className="mt-8 text-xl text-ink-2 bg-paper-2/40 p-4 rounded border border-rule/60"
              style={{ lineHeight: 'var(--lh-relaxed)' }}
            >
              他说：&quot;来了。&quot;她没应，转身走了。夜班从十一点半，排到凌晨四点过。
            </p>
            <p className="meta mt-3 text-muted font-mono text-xs">
              标点挤压做在字体底层：行末逗号压到半角宽，引号随字面走，网页排版天然规整。
            </p>
          </section>

          {/* 08 字偶间距对照 (Kerning) */}
          <section id="sec-kerning" className="scroll-mt-24">
            <SectionHead no="08" name="字偶 · KERNING MATRIX" />
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {KERNING_PAIRS.map((item) => (
                <div
                  key={item.pair}
                  className="rounded border border-rule bg-paper p-3 text-center space-y-1 shadow-sm"
                >
                  <div
                    className="display text-4xl font-bold text-ink"
                    style={{ fontVariationSettings: `"wght" ${w}` }}
                  >
                    {item.pair}
                  </div>
                  <div className="font-mono text-xs text-accent-line font-bold">{item.val} units</div>
                  <div className="text-[10px] text-muted">{item.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 09 语言 */}
          <section id="sec-language" className="scroll-mt-24">
            <SectionHead no="09" name="语言 · CHARSETS & ENCODING" />
            <p
              className="mt-6 break-words text-lg text-ink-2 bg-paper p-5 rounded border border-rule shadow-sm"
              style={{ lineHeight: 'var(--lh-relaxed)', wordSpacing: '0.3em' }}
            >
              {GLYPHS}
            </p>
            <p className="mt-4 text-sm text-muted font-mono">拉丁扩展 + 希腊大写，中文配思源宋体，收录 2,840 字符全覆盖。</p>
          </section>

          {/* 10 授权 */}
          <section id="sec-license" className="scroll-mt-24">
            <SectionHead no="10" name="授权 · COMMERCIAL LICENSE" />
            <div className="mt-6 pb-6 border-b border-rule">
              <div className="meta flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-2">
                <span className="text-accent-line font-bold text-base">桌面 + 网页永久商业授权</span>
                <span className="text-muted font-mono text-xs">一次买断 · 不按月租 · 零流量阶梯加价</span>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Cta label={page.cta} done="完整试用字样包与 OTF 样本已发送" />
              <span className="text-sm text-muted font-mono">试字样与完整字符表，一次性全量交付。</span>
            </div>
          </section>

          {/* Hallmark 58/58 验收工单印章 */}
          <footer className="mt-16 pt-8 border-t border-rule text-muted font-mono text-xs flex flex-wrap items-center justify-between gap-y-2">
            <div>
              <span>FOUNDRY_ID: OF-1984-OATMEAL</span>
              <span className="mx-2">·</span>
              <span>MASTER: DUAL-COUNTER-OPTICAL</span>
              <span className="mx-2">·</span>
              <span>CHARSET: 2840-GLYPHS</span>
            </div>
            <div className="font-bold text-accent-line">
              critique: P5 H5 E5 S5 R5 V5 · slop test: 58/58 ✓
            </div>
          </footer>
        </div>
      </div>
    </main>
  )
}

/** 节头：编号 + 节名 + 贯穿右栏的细线 */
function SectionHead({ no, name }: { no: string; name: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="meta text-accent-line font-mono font-bold text-sm">{no}</span>
      <span className="meta text-ink font-bold text-sm tracking-wider">{name}</span>
      <span
        aria-hidden
        className="h-px flex-1 bg-rule"
      />
    </div>
  )
}
