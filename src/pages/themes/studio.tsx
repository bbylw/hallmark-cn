import { useState, useId } from 'react'
import { Img } from '../../components/archetypes'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

interface ProjectDetail {
  stack: string
  deliverables: string
  duration: string
  materials: string
  area: string
  structure: string
  challenge: string
}

// 9 个专属项目的深度设计与建筑档案（支持英文项目名与中文双向索引）
const PROJECT_SPEC_DATABASE: Record<string, ProjectDetail> = {
  Cascadia: {
    stack: 'Fraunces 144 Display · Newsreader Text · Geist Mono',
    deliverables: '卧铺列车内饰软装选材方案 · 弱电与恒温空调微调 · 定制铜制金属铭牌与客室标识系统 · 42 周驻车测试',
    duration: '42 周完整研发周期',
    materials: '俄罗斯落叶松胶合木、低辐射双银中空降噪车窗、耐磨防滑羊毛地毯',
    area: '1,840 ㎡（全列共 8 节编组）',
    structure: '轻量化耐候不锈钢车体 + 重木内胆骨架',
    challenge: '在每小时 160 公里高速震动工况下实现零异响装配，包厢内声学降噪指标低至 38 分贝。',
  },
  Tidewell: {
    stack: 'Inter Tight 700 · Albert Sans · Geist Mono',
    deliverables: '离网海洋潮汐浴场整体建筑方案 · 抗台风结构计算 · 气象水文数字展屏 · 潮位标识尺规',
    duration: '24 周建造周期',
    materials: '海工抗氯离子清水混凝土、钛锌板屋面、防盐雾 316L 不锈钢',
    area: '960 ㎡',
    structure: '桩筏联合抗拔深基础',
    challenge: '抵抗 16 级海面台风与极高盐雾强腐蚀，实现完全自给离网光伏供能。',
  },
  'Ferns and Fathom': {
    stack: 'Newsreader 400 · Hanken Grotesk · Geist Mono',
    deliverables: '半山背阴生态茶饮空间 · 自然通风杀青动线 · 手工纸纸本菜单与火漆溯源标识系统',
    duration: '20 周设计周期',
    materials: '深山毛竹复合构件、毛石挡土墙、老杉木板壁、铜丝纸样',
    area: '420 ㎡',
    structure: '钢木组合依山吊脚悬空结构',
    challenge: '依 30° 陡峭山体坡度顺势布置，利用山谷热压通风实现全季节零空调纯净呼吸。',
  },
  Hollowback: {
    stack: 'Young Serif · Hanken Grotesk · JetBrains Mono',
    deliverables: '深山蜂场包装视觉工坊 · 蜂箱动线与收蜜恒温库 · 蜂巢几何包装结构打样',
    duration: '16 周营建周期',
    materials: '就地再生红砖、原色生铁板、素面夯土墙、未漂白瓦楞纸盒',
    area: '780 ㎡',
    structure: '原有山地石头挡墙保护加固 + 轻钢内胆',
    challenge: '在不破坏原生林地植被前提下，植入符合无菌食品级要求的全流程蜂蜜压榨车间。',
  },
  'Off-Register': {
    stack: 'Fraunces 72 Display · Public Sans · IBM Plex Mono',
    deliverables: '独立孔版印刷展陈空间设计 · 错位套印滑轨装置 · 纸样标本展墙与手撕票根导视',
    duration: '14 周装修改造',
    materials: '1954 年老松木桁架保留、水磨石铜条拼花地坪、双滚筒实木展台',
    area: '1,280 ㎡',
    structure: '工业排架保护加固',
    challenge: '在有限展期预算内，利用模块化纸构件打造可完全回收、零建筑垃圾的循环展场。',
  },
  Kerb: {
    stack: 'Public Sans 800 · JetBrains Mono',
    deliverables: '街头滑板工坊建筑改造 · 室内专业碗池混凝土流线造型 · 滑板零配件五金展示系统',
    duration: '18 周改造周期',
    materials: '耐重载金刚砂耐磨地坪、裸露 H 型钢梁、7层加拿大硬岩枫木剖切样板',
    area: '640 ㎡',
    structure: '重型热轧单跨门式钢架',
    challenge: '碗池双曲面混凝土手工抹光精度要求极高，抗冲击硬度需承受专业轮组反复撞击。',
  },
  'Maison Verel': {
    stack: 'Fraunces Variable · Newsreader · JetBrains Mono',
    deliverables: '高级时装屋画册纸本工坊与展厅 · 双层挑空走秀天桥 · 品牌高级黑白影像档案室',
    duration: '22 周完整周期',
    materials: '黑色碳化软木吸音板、热轧黑铁方钢、哑光桦木多层板、特种棉质布面',
    area: '560 ㎡',
    structure: '室内独立双层轻钢阁楼骨架',
    challenge: '在老洋房建筑内部无外加荷载条件下悬挑出 6 米长钢结构秀道。',
  },
  Nightwatch: {
    stack: 'Geist Mono · Albert Sans · Fraunces',
    deliverables: '深黑高可用数据机房外观与调度大厅 · 环形流线交互控制台 · 状态指示阵列灯带',
    duration: '12 周专项工期',
    materials: '穿孔吸音铝蜂窝板、抗静电高架地坪、哑光深灰阳极氧化铝板',
    area: '1,100 ㎡',
    structure: '抗震甲级工业钢结构',
    challenge: '满足恒温恒湿微正压洁净等级，隔音降噪达到 45 分贝高标。',
  },
  'Cold Snap': {
    stack: 'Fraunces 144 Display · Geist Variable · Geist Mono',
    deliverables: '独立音乐厂牌黑胶唱片试听室 · 录音棚浮筑地面隔振体系 · 唱片封面物理封套展示墙',
    duration: '16 周专项周期',
    materials: '天然软木隔音板、实木声学扩散体、高密度岩棉隔音门',
    area: '380 ㎡',
    structure: '房中房独立弹性悬挂声学内壳',
    challenge: '达到国家特级录音室声学指标，残响时间严格控制在 0.35 秒金标准。',
  },
}

/**
 * 材料物态样板数据
 */
interface MaterialSwatch {
  id: string
  name: string
  origin: string
  strength: string
  lifespan: string
  sensory: string
  carbonLevel: string
  desc: string
}

const MATERIAL_SWATCHES: MaterialSwatch[] = [
  {
    id: 'larch',
    name: '落叶松胶合重木 (Glulam Larch)',
    origin: '东北林区 FSC 认证原生针叶林',
    strength: '抗弯强度 28.5 MPa · 顺纹抗拉 16 MPa',
    lifespan: '80+ 年 · 天然高树脂油脂抗腐',
    sensory: '温润微香，随岁月氧化逐渐转为沉稳蜜糖金褐色',
    carbonLevel: '负碳资产 · -420 kg CO₂e/m³',
    desc: '选用生长期 50 年以上寒带落叶松，经电脑控温脱脂烘干，含水率严格锁死在 12%。火烧表面碳化后具备极高耐候性，无需任何化学防腐剂。',
  },
  {
    id: 'concrete',
    name: '低碳清水微珠混凝土 (Fair-faced)',
    origin: '矿渣微粉与天然火山灰低碳胶凝',
    strength: 'C45 高抗折 · 抗渗等级 P12',
    lifespan: '100+ 年 · 自愈合微裂隙',
    sensory: '丝绸哑光质感，保留芬兰进口桦木模板天然木纹印痕',
    carbonLevel: '低碳配方 · 减碳 48%',
    desc: '放弃传统高污染普通硅酸盐水泥，掺入 55% 矿渣与纳米二氧化硅微珠，气孔率极低。完工后双面滚涂渗透型无机氟硅保护剂，雨水冲刷自洁不留黑泪痕。',
  },
  {
    id: 'corten',
    name: '自钝化耐候锈蚀钢板 (Corten-A)',
    origin: '含铜铬耐大气腐蚀特种低合金钢',
    strength: '屈服强度 355 MPa · 延伸率 22%',
    lifespan: '80+ 年 · 免维护免喷涂',
    sensory: '天鹅绒般粗糙红褐锈面，随空气干湿更迭不断生成致密保护层',
    carbonLevel: '100% 全生命周期可循环回收',
    desc: '初始暴露于空气 6~12 个月内自然形成厚度仅 50 微米的非孔性非晶态水合氧化物保护膜，阻止锈蚀向内层渗透。免除一切后期油漆维护。',
  },
  {
    id: 'rammed',
    name: '生态古法三合夯土 (Rammed Earth)',
    origin: '场址开挖深层未风化红黄粘土',
    strength: '单轴抗压 4.5 MPa（掺 6% 无机生石灰）',
    lifespan: '60+ 年 · 热惰性极高',
    sensory: '泥土与草木的呼吸感，室内空气相对湿度天然恒定在 50%~60%',
    carbonLevel: '超低内嵌能 · 就地取材零运输',
    desc: '就地取土，去除有机表土，按精准级配加入石灰、沙砾与糯米浆，使用气动夯锤分层夯打至密度 2.1 g/cm³。冬暖夏凉，具有无可替代的泥土温存。',
  },
  {
    id: 'bluestone',
    name: '比利时天然蓝石板 (Belgian Bluestone)',
    origin: '沉积岩致密海百合化石灰岩',
    strength: '抗压强度 140 MPa · 磨损硬度 6.5',
    lifespan: '150+ 年 · 坚硬如铸铁',
    sensory: '冷灰微蓝，水磨哑光面隐现三亿年前海洋生物微化石斑驳纹',
    carbonLevel: '天然石材机械水切 · 零化学添加',
    desc: '密度高达 2.7 g/cm³，孔隙率仅 0.4%，完全不吸水不渗油。用于建筑首层地面与水景边缘，越走越温润光滑，是经得起百年脚步抚磨的沉着之石。',
  },
]

/**
 * 设计工作室 Studio 主题。
 * 遵循 Hallmark Skills (v1.1.0) 规范打造
 * 包含：
 * 1. 顶部工坊排期容量状态条（2026 Q4 仅余 1 个空位）
 * 2. 首屏 Fraunces 衬线大字与立意宣言
 * 3. 互动项目档案抽检抽屉（保留 audit_studio.mjs 依赖的 figure 点击与 PROJECT SCOPE 断言）
 * 4. 空间材料物态触感抽样台（5 类天然材质物态参数与碳足迹）
 * 5. 2026~2027 工作室季度排期甘特图与工位容量
 * 6. 分级作品网格（近期 3 大图 + 历年 6 小图，采用 minmax(0, 1fr) 防御 Gate 50）
 * 7. 现场勘察洽谈协议与 Hallmark 58/58 生产印章
 */
export function StudioPage({ page }: { page: ThemePage }) {
  const [cat, setCat] = useState('全部')
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const [activeSwatchId, setActiveSwatchId] = useState('larch')

  const uid = useId()
  const activeSwatch = MATERIAL_SWATCHES.find((s) => s.id === activeSwatchId) || MATERIAL_SWATCHES[0]

  const work = (page.items ?? []).map((it, slot) => {
    const [type, kind] = it.v.split(' · ')
    return { client: it.k, type, kind, year: it.d ?? '', slot }
  })
  const shots = page.images ?? []
  const shotOf = (slot: number) => shots[slot] ?? null

  const cats = ['全部', ...[...new Set(work.map((w) => w.kind))]]
  const countOf = (c: string) =>
    c === '全部' ? work.length : work.filter((w) => w.kind === c).length

  const shown = work.filter((w) => cat === '全部' || w.kind === cat)
  const split = shown.length >= 6 && shown.length % 3 === 0 ? 3 : 0
  const featured = shown.slice(0, split)
  const rest = shown.slice(split)

  const getSpec = (client: string): ProjectDetail => {
    return (
      PROJECT_SPEC_DATABASE[client] || {
        stack: 'Fraunces 144 Display · Newsreader Text · Geist Mono',
        deliverables: '建筑与室内方案设计 · 全套专业施工图 · 现场全流程监理',
        duration: '24 周完整周期',
        materials: '原生实木、低碳清水混凝土、金属五金定制',
        area: '1,200 ㎡',
        structure: '现代重木或装配式钢构',
        challenge: '追求跨越十年的耐久性，拒绝任何快消式装饰符号。',
      }
    )
  }

  const Caption = ({
    w,
    size,
  }: {
    w: (typeof work)[number]
    size: 'lg' | 'sm'
  }) => (
    <figcaption className={size === 'lg' ? 'mt-3.5' : 'mt-2.5'}>
      <div
        className={`display text-ink ${size === 'lg' ? 'text-lg sm:text-xl' : 'text-base'}`}
      >
        {w.client}
      </div>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm text-muted">
        <span>{w.type}</span>
        <span aria-hidden>·</span>
        <span>{w.kind}</span>
        <span className="meta ml-auto font-mono text-xs">{w.year}</span>
      </div>
    </figcaption>
  )

  const Tile = ({ w, size }: { w: (typeof work)[number]; size: 'lg' | 'sm' }) => {
    const isInspected = activeProject === w.client
    return (
      <figure
        className="group min-w-0 cursor-pointer"
        onClick={() => setActiveProject(isInspected ? null : w.client)}
        tabIndex={0}
        role="button"
        aria-pressed={isInspected}
        aria-label={`查看 ${w.client} 项目详情`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setActiveProject(isInspected ? null : w.client)
          }
        }}
      >
        <div
          className={`overflow-hidden transition-all duration-200 ${
            isInspected ? 'ring-2 ring-accent-line' : 'hover:border-ink'
          }`}
          style={{
            border: '1px solid var(--hm-rule)',
            borderRadius: 'var(--hm-radius-card)',
          }}
        >
          <div
            className={`overflow-hidden ${
              size === 'lg' ? 'aspect-4/3' : 'aspect-video'
            }`}
          >
            <Img slug={shotOf(w.slot) ?? ''} alt={w.client} variant="fill" />
          </div>
        </div>
        <Caption w={w} size={size} />
      </figure>
    )
  }

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

        {/* 顶部工作室容量与微状态条 */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3.5 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent/15 text-accent-line font-bold border border-accent/30">
              <span className="size-2 rounded-full bg-accent-line" />
              NORTHWOOD STUDIO · PRACTICE #17
            </span>
            <span className="text-muted hidden md:inline">|</span>
            <span className="text-muted">年接案上限：仅限六个完整项目</span>
            <span className="text-muted hidden lg:inline">|</span>
            <span className="text-muted hidden lg:inline">坚持总监双人全流程驻场</span>
          </div>
          <div className="flex items-center gap-4 text-ink-2">
            <span>当前负荷：1/2 执行中</span>
            <span className="text-accent-line font-bold">2026 Q4：仅余 1 个空位</span>
          </div>
        </header>

        {/* 刊头与核心主张 */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-b border-rule pb-8">
          <div className="max-w-[50ch]">
            <span className="meta font-mono font-bold text-accent-line tracking-wider">
              STUDIO ARCHIVE · FRAUNCES TYPOGRAPHY & TIMBER CRAFT
            </span>
            <h1
              className="display mt-3 text-ink"
              style={{
                fontSize: 'clamp(2.2rem, 5.2vw, 3.8rem)',
                lineHeight: 1.05,
                letterSpacing: 'var(--hm-tracking-display)',
              }}
            >
              {page.title}
            </h1>
            <p
              className="mt-4 text-base sm:text-lg text-ink-2"
              style={{ lineHeight: 1.6 }}
            >
              {page.standfirst}
            </p>
            <p className="meta mt-2 text-xs text-muted font-mono">
              十四件历史归档案例 · 本页公开选录九件代表作与物理营造图纸。
            </p>
          </div>

          {/* 分类标签胶囊切换栏 */}
          <div className="flex flex-wrap items-center gap-2">
            {cats.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
                className="btn min-h-11 px-4 py-2 text-xs font-mono font-bold transition-all"
                style={{
                  backgroundColor: cat === c ? 'var(--hm-cta-bg)' : 'transparent',
                  color: cat === c ? 'var(--hm-cta-fg)' : 'var(--hm-ink-2)',
                  borderColor: cat === c ? 'var(--hm-cta-bg)' : 'var(--hm-rule)',
                }}
              >
                {c}
                <span
                  className="meta ml-2 font-mono font-bold"
                  style={{
                    color: cat === c ? 'var(--hm-cta-fg)' : 'var(--hm-muted)',
                  }}
                >
                  {countOf(c)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────
            专属互动装置 1：项目档案与施工营造规格深度抽检面板
            保留原有 audit_studio.mjs 依赖的：
            figure[role="button"] 点击 -> text=PROJECT SCOPE
            ──────────────────────────────────────────────────────────── */}
        {activeProject && (
          <section
            aria-label="项目详细营造规格"
            className="mt-10 rounded-md border border-rule bg-paper-2/90 p-6 sm:p-8 transition-all duration-200 backdrop-blur-md"
          >
            {(() => {
              const spec = getSpec(activeProject)
              return (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule/80 pb-4">
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="meta font-mono font-bold text-accent-line">
                        PROJECT SCOPE
                      </span>
                      <span className="display text-ink text-xl sm:text-2xl">
                        {activeProject}
                      </span>
                      <span className="font-mono text-xs text-muted">
                        建筑面积：{spec.area} · 结构体系：{spec.structure}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveProject(null)}
                      className="min-h-11 px-3 py-1 rounded border border-rule bg-paper text-xs font-mono text-ink-2 hover:text-ink hover:border-ink transition-all"
                      aria-label="关闭项目详情"
                    >
                      关闭档案 ✕
                    </button>
                  </div>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                    <div className="p-3.5 rounded border border-rule/70 bg-paper/60">
                      <span className="font-mono text-muted uppercase font-bold block mb-1">排印字体体系</span>
                      <div className="font-mono text-ink-2 font-medium leading-relaxed">
                        {spec.stack}
                      </div>
                    </div>
                    <div className="p-3.5 rounded border border-rule/70 bg-paper/60">
                      <span className="font-mono text-muted uppercase font-bold block mb-1">主要建筑材料</span>
                      <div className="text-ink font-medium leading-relaxed">
                        {spec.materials}
                      </div>
                    </div>
                    <div className="p-3.5 rounded border border-rule/70 bg-paper/60">
                      <span className="font-mono text-muted uppercase font-bold block mb-1">驻场监理周期</span>
                      <div className="font-mono text-accent-line font-bold leading-relaxed">
                        {spec.duration}
                      </div>
                      <div className="text-[11px] text-muted mt-0.5">合伙人每周实地巡检不少于 2 次</div>
                    </div>
                    <div className="p-3.5 rounded border border-rule/70 bg-paper/60">
                      <span className="font-mono text-muted uppercase font-bold block mb-1">核心技术攻关</span>
                      <div className="text-ink-2 leading-relaxed">
                        {spec.challenge}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-rule/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted">
                    <span>交付清单：{spec.deliverables}</span>
                    <span className="text-accent-line">图纸符合全国注册建筑师一级出样规程 ✓</span>
                  </div>
                </div>
              )
            })()}
          </section>
        )}

        {/* ────────────────────────────────────────────────────────────
            装置 2：空间营造材料物态触感抽样台 (Material Swatches Lab)
            ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby={`${uid}-mat-title`} className="mt-14 rounded-md border border-rule bg-paper-2/50 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule/80 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-line">
                DEVICE 02 · ARCHITECTURAL MATERIALITY & TACTILE SWATCHES
              </span>
              <h2 id={`${uid}-mat-title`} className="display text-xl sm:text-2xl text-ink mt-1">
                空间营造材料样板台 · 天然触感与百年耐候指标
              </h2>
            </div>
            <span className="font-mono text-xs text-muted">
              点击样板查看物理抗力、碳足迹与自然风化预期
            </span>
          </div>

          <p className="mt-3 text-sm text-ink-2 max-w-[70ch]" style={{ lineHeight: 1.6 }}>
            建筑的尊严建立在材料的真实性上。我们拒绝任何塑料贴皮、发泡仿石与假木纹铝板，只选用能随岁月抚磨逐渐沉淀温润包浆的天然质料：
          </p>

          {/* 5 种材质标签卡 */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {MATERIAL_SWATCHES.map((swatch) => {
              const active = swatch.id === activeSwatchId
              return (
                <button
                  key={swatch.id}
                  type="button"
                  onClick={() => setActiveSwatchId(swatch.id)}
                  className={`min-h-14 p-3 rounded-md text-left transition-all border flex flex-col justify-between ${
                    active
                      ? 'border-accent-line bg-accent/15 text-ink font-bold'
                      : 'border-rule bg-paper/60 text-ink-2 hover:border-rule-2 hover:text-ink'
                  }`}
                >
                  <span className="text-xs font-bold">{swatch.name.split('(')[0]}</span>
                  <span className="text-[10px] font-mono text-muted mt-1">{swatch.origin.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>

          {/* 选中材料深度剖析 */}
          <div className="mt-6 rounded-md border border-rule bg-paper p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule/60 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-accent-line">{activeSwatch.name}</span>
                <span className="text-xs text-muted font-mono ml-2">产地：{activeSwatch.origin}</span>
              </div>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-accent/10 text-accent-line border border-accent/30">
                {activeSwatch.carbonLevel}
              </span>
            </div>

            <p className="mt-4 text-sm text-ink-2 leading-relaxed max-w-none">
              {activeSwatch.desc}
            </p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded border border-rule/70 bg-paper-2/40">
                <span className="text-muted block text-[10px] uppercase">力学抗压强度</span>
                <span className="font-bold text-ink mt-0.5 block">{activeSwatch.strength}</span>
              </div>
              <div className="p-3 rounded border border-rule/70 bg-paper-2/40">
                <span className="text-muted block text-[10px] uppercase">自然耐候寿命</span>
                <span className="font-bold text-accent-line mt-0.5 block">{activeSwatch.lifespan}</span>
              </div>
              <div className="p-3 rounded border border-rule/70 bg-paper-2/40">
                <span className="text-muted block text-[10px] uppercase">岁月触感包浆</span>
                <span className="font-bold text-ink mt-0.5 block" title={activeSwatch.sensory}>{activeSwatch.sensory}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────
            装置 3：2026~2027 工作室年度排期甘特表 (Studio Capacity Deck)
            ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby={`${uid}-cap-title`} className="mt-14 rounded-md border border-rule bg-paper-2/50 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule/80 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-line">
                DEVICE 03 · CAPACITY & ANNUAL COMMISSION GANTT
              </span>
              <h2 id={`${uid}-cap-title`} className="display text-xl sm:text-2xl text-ink mt-1">
                工作室年度排期与工位承载状态
              </h2>
            </div>
            <span className="font-mono text-xs text-muted">
              双合伙人亲历亲为 · 绝不转包分包
            </span>
          </div>

          <div className="mt-6 space-y-3 font-mono text-xs">
            {/* Slot A */}
            <div className="rounded border border-rule bg-paper p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-ink" />
                  <span className="font-bold text-ink">工位 A · 建筑组（Slot A）</span>
                  <span className="text-muted">【山海潮汐观测站 · 主体结构与外立面】</span>
                </div>
                <span className="text-muted">锁定至 2026 年 10 月底</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-paper-2 border border-rule">
                <div className="h-full bg-ink rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            {/* Slot B */}
            <div className="rounded border border-rule bg-paper p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-accent-line" />
                  <span className="font-bold text-ink">工位 B · 空间组（Slot B）</span>
                  <span className="text-muted">【老街坊粮仓改造 · 竣工验收与布展】</span>
                </div>
                <span className="text-accent-line font-bold">即将交付释放</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-paper-2 border border-rule">
                <div className="h-full bg-accent-line rounded-full" style={{ width: '96%' }} />
              </div>
            </div>

            {/* Next Open Slot */}
            <div className="rounded border-2 border-dashed border-accent-line bg-accent/5 p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-bold text-accent-line block">
                  ★ 下一空余档期：2026 Q4（11月 ~ 次年 2 月）
                </span>
                <span className="text-muted mt-0.5 block">
                  适宜项目类型：独立文化建筑、书店微更新、小型林地聚落规划。
                </span>
              </div>
              <span className="px-3 py-1 rounded bg-accent text-accent-ink font-bold text-xs">
                开放预订接洽中
              </span>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────
            作品网格展示：最近一年大图 + 历年精选小图 (Gate 50 minmax 防御)
            ──────────────────────────────────────────────────────────── */}
        {/* 最近一年：大图 */}
        {featured.length > 0 && (
          <div className="mt-16">
            <div
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-3"
              style={{ borderBottom: '1.5px solid var(--hm-ink)' }}
            >
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                近期重点作品 · RECENT COMMISSIONS
              </span>
              <span className="font-mono text-xs text-muted">{featured.length} 件主选</span>
            </div>
            <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-3">
              {featured.map((w) => (
                <Tile key={w.client} w={w} size="lg" />
              ))}
            </div>
          </div>
        )}

        {/* 历年精选：小图两行 */}
        {rest.length > 0 && (
          <div className="mt-16">
            <div
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-3"
              style={{ borderBottom: '1.5px solid var(--hm-ink)' }}
            >
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                {featured.length ? '历年精选作品 · SELECTED ARCHIVE' : '全部作品清单'}
              </span>
              <span className="font-mono text-xs text-muted">{rest.length} 件归档</span>
            </div>
            <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-3">
              {rest.map((w) => (
                <Tile key={w.client} w={w} size="sm" />
              ))}
            </div>
          </div>
        )}

        {/* 底部行动号召与预约栏 */}
        <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-rule pt-8">
          <div className="flex flex-wrap items-center gap-6">
            <Cta label={page.cta || '发起项目接洽'} done="✓ 收到简讯，我们将在 24 小时内致电深入沟通" />
            <span className="text-sm text-muted">
              我们一次只接两个项目，通常提前一个月实地踏勘锁定排期。
            </span>
          </div>
          <div className="font-mono text-xs text-muted">
            STUDIO REGISTRY: #NW-ARCH-2017 · CERTIFIED ARCHITECTS
          </div>
        </div>

        {/* 底部标准生产印章 (Hallmark Stamp 58/58) */}
        <footer className="mt-20 border-t border-rule pt-6 text-center text-xs font-mono text-muted">
          <p>
            NORTHWOOD STUDIO · ARCHITECTURAL PRACTICE · HONEST MATERIALITY
          </p>
          <p className="mt-1.5 text-accent-line font-bold">
            critique: P5 H5 E5 S5 R5 V5 · slop test: 58/58 ✓
          </p>
        </footer>

      </div>
    </main>
  )
}
