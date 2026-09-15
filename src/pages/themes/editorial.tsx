import { useState, useId } from 'react'
import type { ThemePage } from '../../data/pages'
import { Stamp } from '../../components/archetypes'
import { Cta } from './cta'

interface ExcerptInfo {
  author: string
  readingTime: string
  wordCount: string
  lead: string
  pullQuote: string
  exLibrisNo: string
  typographicNote: string
}

const ARTICLE_EXCERPTS_DB: Record<string, ExcerptInfo> = {
  '错位的那一毫米': {
    author: '林克 / 孔版印刷研究员',
    readingTime: '约需阅读 11 分钟',
    wordCount: '6,400 字',
    lead: '在数字排印把精度推向 0.001 毫米的年代，孔版印刷那 1 毫米的套印漂移反而成了机械的心跳。油墨在未涂布纸面纤维间自然浸润，没有两张印张是完全相同的。',
    pullQuote: '完美是算法的牢笼，错位是手艺留在纸上的体温。',
    exLibrisNo: 'EX-LIBRIS #28-A · 联邦蓝与荧光红双色套印',
    typographicNote: '正文排印：Newsreader 16pt / 28pt 行距 · 标题：Fraunces 144 Display',
  },
  '周慕云谈中文字库': {
    author: '周慕云 口述 / 陆寻 整理',
    readingTime: '约需阅读 18 分钟',
    wordCount: '9,800 字',
    lead: '做一套包含 27,533 个汉字的国标全字库，需要一个人坐在屏幕前把横、竖、撇、捺重画六万余次。这不是设计，这是苦行僧在石头上雕经。',
    pullQuote: '一个字在草稿纸上很好看，放进一段社论里若无其事地隐退，它才算真正立住了。',
    exLibrisNo: 'EX-LIBRIS #28-B · 铅字凸版压印黑墨藏书票',
    typographicNote: '正文排印：Newsreader 16pt · 附注：Geist Mono 9pt 边栏排定',
  },
  '北坡的十二箱蜂': {
    author: '陈松年 / 秦岭蜂农',
    readingTime: '约需阅读 9 分钟',
    wordCount: '4,800 字',
    lead: '山里的大师傅从不看日历，看的是山桃花开到第几根枝桠。春天蜜蜂不睡，人也不能睡。十二箱中蜂在峭壁下扎营，取的是清明前的纯净椴树头蜜。',
    pullQuote: '蜂子比人诚实。花信到了就飞出三里地，天阴了绝不勉强出工。',
    exLibrisNo: 'EX-LIBRIS #28-C · 纯手工天然蜂蜡火漆封印',
    typographicNote: '正文排印：Newsreader 15.5pt / 27pt 行距 · 自然段首字下沉三行',
  },
  'AI 写的界面为什么都长一样': {
    author: '本期特约评论员 · 许明远',
    readingTime: '约需阅读 14 分钟',
    wordCount: '7,200 字',
    lead: '当你要求大模型设计一个界面，它提取的是一千万个现有页面的数学均值：灰底白卡、大圆角、居中加粗标题、三个等宽卡片。这是均值的胜利，也是灵魂的安乐死。',
    pullQuote: '工业审美在向几何均值坍塌，而真正的风格永远诞生于极少数偏执者的拒绝。',
    exLibrisNo: 'EX-LIBRIS #28-D · 纯黑红粗野高对比丝印票根',
    typographicNote: '正文排印：Newsreader 16pt · 配合 1970 瑞士国际主义栅格',
  },
  '工具箱': {
    author: '工坊记录组',
    readingTime: '约需阅读 6 分钟',
    wordCount: '3,200 字',
    lead: '这把 1958 年出品的德国双齿轮手摇钻，没有锂电池，没有电路板。握柄是老榉木车削出来的，在手心旋转六十年，油脂已把它浸润成琥珀般的金黄。',
    pullQuote: '好工具不需要充电，它只在等你伸出双手的力量。',
    exLibrisNo: 'EX-LIBRIS #28-E · 机械剖面钢笔线稿微喷票',
    typographicNote: '正文排印：Newsreader 15pt / 26pt 行距 · 零件分解等宽排布',
  },
  '《纸的秩序》': {
    author: '林少白 / 出版史学者',
    readingTime: '约需阅读 12 分钟',
    wordCount: '5,900 字',
    lead: '书籍之所以能统治人类文明四百年，不是因为文字的庄严，而是纸张的克重、折页的阻尼与翻页时指腹拂过切口的微小摩擦，构成了无法被复刻的物理记忆场。',
    pullQuote: '屏幕吞噬注意力，而纸张留存时间。',
    exLibrisNo: 'EX-LIBRIS #28-F · 纯质象牙白和纸带纤维撕边票',
    typographicNote: '正文排印：Newsreader 16pt · 经典 Tschichold 黄金比例版心',
  },
  '来信三封': {
    author: '读者来信选登',
    readingTime: '约需阅读 5 分钟',
    wordCount: '2,800 字',
    lead: '读者指正了第 17 期第 84 页关于富春江竹纸配比的一个术语疏漏。手艺人的严苛让我们既羞愧又振奋，特在此全文刊发来信并勘误。',
    pullQuote: '办一本不刊登广告的刊物，读者就是唯一的审判官。',
    exLibrisNo: 'EX-LIBRIS #28-G · 读者来稿手写原迹影印票',
    typographicNote: '正文排印：Newsreader 14pt 略紧排式 · 附原信件拍照手抄样',
  },
  '订阅 / 零售': {
    author: '《象限》发行室',
    readingTime: '约需阅读 3 分钟',
    wordCount: '1,500 字',
    lead: '一年四本，春分、夏至、秋分、冬至发货。不设任何数字付费墙，实体刊物全部送达订户案头后，方在官网释出当期目录与长文摘录。',
    pullQuote: '做一件慢下来的事，给愿意等待的案头。',
    exLibrisNo: 'EX-LIBRIS #28-H · 全年订户专属特刊金色火漆封印',
    typographicNote: '正文排印：Geist Mono 11pt 纯等宽发行公报体',
  },
}

const BINDING_SPECS = [
  {
    id: 'swiss',
    name: '裸脊锁线平摊装订 (Lay-Flat Swiss Binding)',
    material: '芬兰进口天然亚麻加固粗线，16 帖手工穿锁',
    durability: '耐翻折 50,000 次以上，书脊 180° 完全平摊',
    experience: '双手脱手平置桌面完全不回弹，跨页全景图文零夹缝吞字，极具纸本翻阅从容感。',
    tag: '工艺核心 · 零阻力翻阅',
  },
  {
    id: 'paper',
    name: '90g 纯质樱花内文纸 (Sakura Uncoated 90g)',
    material: '日本进口长纤维原木无氯未涂布浆，高松厚度 1.45 cm³/g',
    durability: '中性无酸纸，百年存放不黄脆，耐墨不洇',
    experience: '象牙微暖底色，自然吸收室内环境光，长时间台灯下深度阅读双眼不疲劳、不刺眼。',
    tag: '阅读物态 · 触感温润',
  },
  {
    id: 'cover',
    name: '240g 丝绒特种卡压凹 (240g Velvet Card Blind Deboss)',
    material: '德国环保再生棉浆，表面附带天鹅绒微细触感层',
    durability: '抗刮擦、防指纹油脂渗透，边缘硬挺不起毛边',
    experience: '刊名采用 0.4mm 深度手工铜版无色深压凹，指尖抚过犹如雕刻石碑般的物理起伏感。',
    tag: '封面雕刻 · 光影触感',
  },
  {
    id: 'deckle',
    name: '手工古法毛边撕边 (Handmade Deckle Edge)',
    material: '手工抄造纸张边缘天然纤维流向自然沉淀',
    durability: '每册独立成幅，绝非工业切纸刀平直呆板裁切',
    experience: '三边保留天然毛边原貌，翻阅时指腹与纸张纤维轻柔耳语，重现古籍抄本经典物态。',
    tag: '典藏级 · 独一无二',
  },
]

const FACTS = [
  ['页数', '148 页 · 纯手工双线锁脊'],
  ['开本', '185 × 260 mm 黄金分割开本'],
  ['印数', '限定 3,000 册 · 独立编号'],
  ['出版', '春分 / 夏至 / 秋分 / 冬至'],
  ['用纸', '内文 90g 樱花纸 · 封面 240g 特种卡'],
  ['装订', '裸脊平摊 · 跨页双版芯展开'],
]

const COLUMNS = [
  ['年度订阅 (全年四期)', '每年春分、夏至、秋分、冬至当天统一发货。寄达读者案头前绝不在网络公开全文。全刊不接任何商业赞助，纯粹由订阅者供养。'],
  ['精选实体零售网络', '仅入选全国 42 家独立先锋书店、美术馆书店与器物生活馆上架。各零售点均配有专属试读样书与展示架。'],
  ['手艺与田野自由投稿', '写清楚你要记录的那项手艺、那个偏执的人，以及为什么必须由你来写。双月编辑部同僚评议，每投必认真回复。'],
]

const pageNo = (i: number) => `p.${String(12 + i * 17).padStart(3, '0')}`

/**
 * 季刊目录独立页 EditorialPage。
 * 遵循 Hallmark Skills 规范打造深邃的人文纸本物态感：
 * 1. 顶部刊物发行状态条（Issue 28、无广告宣言、当前发货轮次）
 * 2. 封面特辑醒目大字
 * 3. 专属互动装置：版芯速读摘录面板（满足 text=EXCERPT 契约，收录 8 篇深度专稿摘录与藏书票）
 * 4. 专属互动装置：纸本装帧与工艺解构台（4 种装帧物态切面与触感参数）
 * 5. 专属互动装置：经典 Tschichold 金分割版心律与阅读规范标尺
 * 6. 顺丰冷链特快寄递台账与全年订阅锁定
 * 7. 底部配置标准 Hallmark Stamp 58/58 生产印章
 */
export function EditorialPage({ page }: { page: ThemePage }) {
  const all = page.items ?? []
  const feature = all[0]
  const standing = all[all.length - 1]
  const articles = all.slice(1, -1)

  const [activeArticle, setActiveArticle] = useState<string | null>(feature?.v ?? null)
  const [activeBindingId, setActiveBindingId] = useState('swiss')

  const uid = useId()
  const activeExcerpt =
    (activeArticle && ARTICLE_EXCERPTS_DB[activeArticle]) ||
    ARTICLE_EXCERPTS_DB['错位的那一毫米'] || {
      author: '本期特约编辑部',
      readingTime: '约需阅读 9 分钟',
      wordCount: '5,200 字',
      lead: '当工业标准把每一块砖削成同样的直角，我们开始在旧墙皮脱落的缝隙里寻找属于人的呼吸。这不仅是一次空间考察，而是一次对被遗忘工艺的招魂。',
      pullQuote: '书籍留存时间，屏幕吞噬注意力。',
      exLibrisNo: 'EX-LIBRIS #28-SPECIMEN',
      typographicNote: '正文排印：Newsreader 16pt / 28pt 行距',
    }

  const activeBinding = BINDING_SPECS.find((b) => b.id === activeBindingId) || BINDING_SPECS[0]

  return (
    <main
      id="main"
      className="relative px-(--page-gutter) pb-32 pt-10 sm:pt-14 overflow-x-clip"
      style={{
        backgroundColor: 'var(--hm-paper)',
        color: 'var(--hm-ink)',
      }}
    >
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>

        {/* 顶部刊头元信息 */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3.5 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent/15 text-accent-line font-bold border border-accent/30">
              <span className="size-2 rounded-full bg-accent-line" />
              QUARTERLY REVIEW · ISSUE NO. 28
            </span>
            <span className="text-muted hidden md:inline">|</span>
            <span className="text-muted">坚持零商业广告 · 读者独立供养</span>
            <span className="text-muted hidden lg:inline">|</span>
            <span className="text-muted hidden lg:inline">限定 3,000 册独立手写编号</span>
          </div>
          <div className="flex items-center gap-4 text-ink-2">
            <span>当前发货期：春季号出厂寄送中</span>
            <span className="text-accent-line font-bold">印存：仅余 142 册</span>
          </div>
        </header>

        {/* 刊名与核心主张 */}
        <div
          className="mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-6 pb-6"
          style={{ borderBottom: '2px solid var(--hm-ink)' }}
        >
          <div className="max-w-[50ch]">
            <span className="meta font-mono font-bold text-accent-line tracking-wider">
              {page.discipline} · LITERARY & MATERIAL CRAFT JOURNAL
            </span>
            <h1
              className="display mt-2 text-ink font-bold"
              style={{
                fontSize: 'clamp(2.25rem, 5.4vw, 3.8rem)',
                lineHeight: 1.05,
                letterSpacing: 'var(--hm-tracking-display)',
              }}
            >
              {page.title}
            </h1>
          </div>
          <p
            className="max-w-[36ch] text-sm text-ink-2 leading-relaxed"
          >
            {page.standfirst}
          </p>
        </div>

        {/* 主体两栏结构 */}
        <div className="mt-12 grid gap-x-14 gap-y-12 lg:grid-cols-12 items-start">
          
          {/* 左侧主栏：封面特辑 + 篇目目录 + 深度版芯速读面板 */}
          <div className="lg:col-span-8">
            
            {/* 封面特辑大字呈现 */}
            {feature && (
              <section aria-labelledby="feature" className="border-b border-rule pb-8">
                <div
                  className="flex flex-wrap items-baseline justify-between gap-4 pb-3"
                  style={{ borderBottom: '2px solid var(--hm-ink)' }}
                >
                  <h2 id="feature" className="meta font-mono font-bold text-ink">
                    本期封面特辑 · FEATURE ESSAY
                  </h2>
                  <span className="font-mono text-xs text-muted">
                    {pageNo(0)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveArticle(feature.v)}
                  className="group block w-full py-6 text-left transition-colors cursor-pointer"
                >
                  <span
                    className="display block text-ink transition-colors duration-200 ease-out group-hover:text-accent-line font-bold"
                    style={{
                      fontSize: 'clamp(1.75rem, 3.8vw, 2.75rem)',
                      lineHeight: 1.1,
                    }}
                  >
                    {feature.v}
                  </span>
                  <span
                    className="mt-2.5 block text-sm sm:text-base text-muted"
                    style={{ lineHeight: 'var(--lh-relaxed)' }}
                  >
                    {feature.d} · 点击展开本期主选篇目版芯摘录与丝网藏书票
                  </span>
                </button>
              </section>
            )}

            {/* 核心互动装置：版芯速读与藏书票摘录面板 (满足 text=EXCERPT 契约) */}
            {activeArticle && (
              <section
                aria-label="文章版芯速读摘录"
                className="my-8 rounded-xl border-2 border-accent-line/40 bg-paper-2/60 p-6 sm:p-7 shadow-sm transition-all duration-200 backdrop-blur-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent/20 text-accent-line border border-accent/40">
                      EXCERPT · 版芯试读
                    </span>
                    <span className="font-bold text-sm text-ink truncate">
                      《{activeArticle}》
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs text-muted">
                    <span>{activeExcerpt.author}</span>
                    <span>·</span>
                    <span>{activeExcerpt.readingTime}</span>
                    <span>·</span>
                    <span>{activeExcerpt.wordCount}</span>
                  </div>
                </div>

                <blockquote
                  className="mt-5 text-base sm:text-lg text-ink-2 font-serif italic-none leading-relaxed border-l-4 border-accent-line pl-4 py-1"
                  style={{ fontFamily: 'var(--hm-font-display)' }}
                >
                  “{activeExcerpt.lead}”
                </blockquote>

                <div className="mt-4 p-3 rounded bg-paper border border-rule text-xs font-mono text-accent-line font-bold flex items-center gap-2">
                  <span>★</span>
                  <span>金句摘录：“{activeExcerpt.pullQuote}”</span>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-rule/80 font-mono text-[11px] text-muted">
                  <span>{activeExcerpt.typographicNote}</span>
                  <span className="text-ink font-bold bg-paper-2 px-2 py-0.5 rounded border border-rule">
                    {activeExcerpt.exLibrisNo}
                  </span>
                </div>
              </section>
            )}

            {/* 目录列表 */}
            <section aria-labelledby="contents" className="mt-8">
              <div className="flex items-baseline justify-between border-b border-rule pb-2">
                <h2 id="contents" className="meta font-mono font-bold text-ink">
                  本期全部篇目索引 · CONTENTS
                </h2>
                <span className="font-mono text-xs text-muted">共收录 8 篇专题长文与田野纪实</span>
              </div>

              <ul className="mt-2 divide-y divide-rule/60">
                {articles.map((it, i) => {
                  const no = i + 2
                  const at = all.indexOf(it)
                  const isSelected = activeArticle === it.v
                  return (
                    <li key={it.v}>
                      <button
                        type="button"
                        onClick={() => setActiveArticle(it.v)}
                        className={`group flex w-full items-baseline gap-3 sm:gap-4 py-4 text-left transition-all min-h-13 ${
                          isSelected ? 'bg-accent/10 pl-3 rounded-md font-semibold' : 'hover:pl-2'
                        }`}
                      >
                        <span className="meta w-7 shrink-0 font-mono text-muted text-xs">
                          {String(no).padStart(2, '0')}
                        </span>
                        <span className="meta w-14 shrink-0 font-mono font-bold text-accent-line text-xs">
                          {it.k}
                        </span>
                        <span className="min-w-0">
                          <span
                            className="display block text-ink transition-all duration-200 ease-out group-hover:text-accent-line font-medium"
                            style={{
                              fontSize: 'clamp(1.15rem, 2.1vw, 1.45rem)',
                              lineHeight: 1.2,
                            }}
                          >
                            {it.v}
                          </span>
                          <span className="mt-1 block text-xs text-muted">
                            {it.d}
                          </span>
                        </span>
                        <span
                          aria-hidden
                          className="mx-2 hidden min-w-6 flex-1 translate-y-[-0.3em] sm:block"
                          style={{ borderBottom: '1px dotted var(--hm-rule-2)' }}
                        />
                        <span className="ml-auto shrink-0 font-mono text-xs text-muted sm:ml-0">
                          {pageNo(at)}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>

            {/* 常设页 */}
            {standing && (
              <div
                className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 text-muted border-t border-rule"
              >
                <span className="meta font-mono font-bold text-ink">固定常设</span>
                <span className="meta text-xs">{standing.k}</span>
                <span className="text-sm text-ink-2">{standing.v}</span>
                <span
                  aria-hidden
                  className="mx-2 hidden min-w-6 flex-1 translate-y-[-0.3em] sm:block"
                  style={{ borderBottom: '1px dotted var(--hm-rule-2)' }}
                />
                <span className="ml-auto shrink-0 font-mono text-xs sm:ml-0">
                  {pageNo(all.length - 1)}
                </span>
              </div>
            )}
          </div>

          {/* 右侧边栏：出版物态参数 + 订购入口 */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-24 rounded-xl border border-rule bg-paper-2/50 p-6">
              <div className="flex items-center justify-between border-b border-rule pb-3">
                <span className="meta font-mono font-bold text-ink">第 28 期出版参数</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-paper border border-rule text-muted">COLOPHON</span>
              </div>

              <dl className="mt-4 divide-y divide-rule/60">
                {FACTS.map(([k, v]) => (
                  <div key={k} className="py-2.5">
                    <dt className="meta text-muted text-xs font-mono">{k}</dt>
                    <dd className="mt-1 font-mono text-xs text-ink-2 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 pt-4 border-t border-rule">
                <div className="text-xs font-mono text-muted mb-2">
                  包含全年四期特快直邮 + 随刊藏书票
                </div>
                <Cta label={page.cta} done="订阅已确认，第 28 期现货即发" />
              </div>
            </div>
          </aside>
        </div>

        {/* ────────────────────────────────────────────────────────────
            装置 2：实体装帧与印后工艺解构台 (Binding & Finishing Lab)
            ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby={`${uid}-craft-title`} className="mt-16 rounded-xl border border-rule bg-paper-2/50 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule/80 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-line">
                DEVICE 02 · TACTILE BINDING & PRINT FINISH ANATOMY
              </span>
              <h2 id={`${uid}-craft-title`} className="display text-xl sm:text-2xl font-bold text-ink mt-1">
                实体书刊装帧工艺与特种材料切面
              </h2>
            </div>
            <span className="font-mono text-xs text-muted">
              点击工艺剖面查看抗疲劳度、纸张松厚度与手工触感
            </span>
          </div>

          <p className="mt-3 text-sm text-ink-2 max-w-[70ch]" style={{ lineHeight: 1.6 }}>
            纸张与装订不是文字的容器，而是身体参与阅读的媒介。我们彻底拒绝塑料覆膜与劣质化学胶水，坚持使用可完全平摊的裸脊与高松厚度纯质无酸纸：
          </p>

          {/* 4 种工艺切换按钮 */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {BINDING_SPECS.map((b) => {
              const active = b.id === activeBindingId
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setActiveBindingId(b.id)}
                  className={`min-h-13 p-3 rounded-lg text-left transition-all border flex flex-col justify-between ${
                    active
                      ? 'border-accent-line bg-accent/15 text-ink font-bold shadow-sm'
                      : 'border-rule bg-paper/60 text-ink-2 hover:border-rule-2 hover:text-ink'
                  }`}
                >
                  <span className="text-xs font-bold truncate">{b.name.split('(')[0]}</span>
                  <span className="text-[10px] font-mono text-muted mt-1 truncate">{b.tag}</span>
                </button>
              )
            })}
          </div>

          {/* 选中工艺深度解析 */}
          <div className="mt-6 rounded-lg border border-rule bg-paper p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule/60 pb-3 font-mono text-xs">
              <span className="font-bold text-ink text-sm">{activeBinding.name}</span>
              <span className="px-2 py-0.5 rounded bg-accent/10 text-accent-line border border-accent/30 font-bold">
                {activeBinding.tag}
              </span>
            </div>

            <p className="mt-4 text-sm text-ink-2 leading-relaxed">
              {activeBinding.experience}
            </p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded bg-paper-2/40 border border-rule/70">
                <span className="text-muted block text-[10px] uppercase">材料与规格</span>
                <span className="text-ink font-medium block mt-1">{activeBinding.material}</span>
              </div>
              <div className="p-3 rounded bg-paper-2/40 border border-rule/70">
                <span className="text-muted block text-[10px] uppercase">物理耐久度指标</span>
                <span className="text-accent-line font-medium block mt-1">{activeBinding.durability}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────
            装置 3：Tschichold 经典黄金分割版心律与阅读规范标尺
            ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby={`${uid}-canon-title`} className="mt-14 rounded-xl border border-rule bg-paper-2/40 p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule/80 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-line">
                DEVICE 03 · CANONS OF PAGE CONSTRUCTION & TYPOGRAPHY
              </span>
              <h2 id={`${uid}-canon-title`} className="display text-xl sm:text-2xl font-bold text-ink mt-1">
                Tschichold 经典版心法则与视线跳跃力学
              </h2>
            </div>
            <span className="font-mono text-xs text-muted">
              订口 2 : 天头 3 : 切口 4 : 地脚 6 黄金余白比
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-lg border border-rule bg-paper">
              <span className="text-accent-line font-bold block mb-1">01 · 汉字行长极限律</span>
              <p className="text-ink-2 leading-relaxed">
                正文单行严格控制在 38~42 个标准汉字，杜绝视线长距离换行时的断层疲劳；行距设定为字号的 1.75 倍（28pt），留出纯净的横向呼吸空间。
              </p>
            </div>
            <div className="p-4 rounded-lg border border-rule bg-paper">
              <span className="text-accent-line font-bold block mb-1">02 · 基线网格绝对对齐</span>
              <p className="text-ink-2 leading-relaxed">
                全刊所有标题、正文、摘录与尾注严格锚定在 14pt 统一垂直节拍基线（Baseline Grid），透光反面阅读时背面墨迹与正面行行重叠，纸背无杂光。
              </p>
            </div>
            <div className="p-4 rounded-lg border border-rule bg-paper">
              <span className="text-accent-line font-bold block mb-1">03 · 丝网藏书票独立编号</span>
              <p className="text-ink-2 leading-relaxed">
                随刊附赠由作者与装帧师双签名的手工丝网藏书票（Ex-Libris），附独立 4 位序列号，采用防伪凸版压力机打制，具备纸本艺术品收藏属性。
              </p>
            </div>
          </div>
        </section>

        {/* 底部三大发行支柱 */}
        <div className="mt-16 grid gap-x-10 gap-y-8 lg:grid-cols-3">
          {COLUMNS.map(([k, d]) => (
            <div
              key={k}
              className="pt-4"
              style={{ borderTop: '2px solid var(--hm-ink)' }}
            >
              <div className="meta font-mono font-bold text-ink">{k}</div>
              <p
                className="mt-2 text-sm text-ink-2 leading-relaxed"
                style={{ maxWidth: '34ch' }}
              >
                {d}
              </p>
            </div>
          ))}
        </div>

        {/* 底部 Hallmark 规范生产印章与六维评分 */}
        <footer className="mt-20">
          <Stamp page={page} />
        </footer>

      </div>
    </main>
  )
}
export default EditorialPage
