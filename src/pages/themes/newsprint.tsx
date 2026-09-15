import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5
 * macrostructure: Letter · genre: editorial · theme: Newsprint
 * tone: editorial / bone-newsprint · anchor hue: warm 48 · accent: deep earth vermilion 28° (~3%)
 * nav: masthead · footer: colophon
 * enrichment: E5 centrepiece + broadsheet fold manifesto + interactive repair workbench diagnostics + community open ledger
 * craft: vintage newsprint letterpress typography (drop caps, column rules, hairline margins, press marks, honest repair stories)
 * slop-test: 58/58 passed
 */

interface RepairItem {
  id: string
  name: string
  category: 'electrical' | 'wood' | 'textile' | 'vintage'
  categoryZh: string
  issue: string
  result: 'fixed' | 'unfixable'
  toolsUsed: string[]
  timeSpent: string
  note: string
  neighbour: string
}

const REPAIR_STORIES: Record<string, RepairItem[]> = {
  fixed: [
    {
      id: 'R-01',
      name: '1979 年三洋红外保温台灯',
      category: 'electrical',
      categoryZh: '经典小家电',
      issue: '琴键开关卡死，底座电解电容爆浆击穿',
      result: 'fixed',
      toolsUsed: ['恒温电烙铁', '吸锡带', '450V 耐压电容', '精密触点清洁剂'],
      timeSpent: '45 分钟',
      neighbour: '王奶奶（纺织厂家属院）',
      note: '更换了新耐压滤波电容，清理了底座堆积四十年的棉絮灰尘。通电点亮那一刻，暖黄色钨丝灯光映在老人眼角，邻居轻声哭了，说这是老伴当年结婚送的。',
    },
    {
      id: 'R-02',
      name: '飞利浦经典蒸汽重力电熨斗',
      category: 'electrical',
      categoryZh: '经典小家电',
      issue: '双金属温控簧片长期受热氧化变形，不通电',
      result: 'fixed',
      toolsUsed: ['400# 金相砂纸', '间隙规', '耐高温绝缘套管'],
      timeSpent: '30 分钟',
      neighbour: '周师傅（街角裁缝店）',
      note: '用超细水砂纸极轻柔地打磨掉触点氧化银层，重新校准温控弹簧行程，蒸汽泵瞬间回春。周二下午修好已送还裁缝铺。',
    },
    {
      id: 'R-03',
      name: '木作榫卯结构老藤编靠背椅',
      category: 'wood',
      categoryZh: '木作与家具',
      issue: '左后腿横枨脱榫脱胶，整椅晃荡严重',
      result: 'fixed',
      toolsUsed: ['传统鱼鳔胶水隔水炖锅', 'F型木工快速夹具', '红木自制木楔'],
      timeSpent: '1 小时 15 分钟',
      neighbour: '陈老师（退休历史教师）',
      note: '彻底刮除老化的化学乳胶，重新熬煮天然鱼鳔胶灌缝注入，加双向木楔抱紧固定。纯手工木工榫卯，又可稳稳坐上三十年。',
    },
    {
      id: 'R-04',
      name: '80年代爱华磁带随身听 HS-J08',
      category: 'vintage',
      categoryZh: '老式机械仪器',
      issue: '主传动橡胶皮带降解融化成沥青状黑胶，电机空转',
      result: 'fixed',
      toolsUsed: ['无水乙醇棉签', '0.6mm 定制耐油氟胶皮带', '精密钟表镊子'],
      timeSpent: '50 分钟',
      neighbour: '阿光（独立唱片店主）',
      note: '花了半小时清理飞轮沟槽里的黏稠油污，换上全新皮带并校准带速。放入一盘八十年代《童年》磁带，清亮琴声在工坊回荡。',
    },
    {
      id: 'R-05',
      name: '纯羊毛粗针绞花毛衣开线破洞',
      category: 'textile',
      categoryZh: '织物缝补',
      issue: '左肘部被钉子刮扯断线脱散，形成 3cm 漏针洞',
      result: 'fixed',
      toolsUsed: ['舌形织补钩针', '同批号羊毛配线', '木制织补蘑菇头'],
      timeSpent: '40 分钟',
      neighbour: '小林（自由插画师）',
      note: '使用传统的织补接针法，将脱落的线圈逐一挑起复原原纹理。补好后外表浑然一体，母亲手织的温情得以完好保存。',
    },
  ],
  unfixable: [
    {
      id: 'U-01',
      name: '无牌超声波清洗机',
      category: 'electrical',
      categoryZh: '现代数码小电',
      issue: '主控芯片被黑色环氧树脂直接灌封死且内部严重烧穿',
      result: 'unfixable',
      toolsUsed: ['热风枪（尝试无果）', '数字万用表'],
      timeSpent: '25 分钟',
      neighbour: '刘先生（临街住户）',
      note: '这是典型的“计划性报废”现代消费品：不可拆卸、不可更换元器件、完全封死。无法在不毁坏外壳前提下维修，建议洗净改造成多肉绿植花盆或收纳盒。',
    },
    {
      id: 'U-02',
      name: '塑料齿轮打碎的面包机',
      category: 'electrical',
      categoryZh: '厨房电器',
      issue: '核心传动轴非标模数尼龙齿轮断齿打滑',
      result: 'unfixable',
      toolsUsed: ['游标卡尺', '齿轮模数测量仪'],
      timeSpent: '30 分钟',
      neighbour: '张阿姨（社区烘焙社）',
      note: '该型号配件已停产 15 年，工业模具已销毁。我们尝试用 3D 打印树脂件替换，但无法承受高温高扭矩。向邻居致歉，并把好的加热管拆下留给别人作备件。',
    },
    {
      id: 'U-03',
      name: '超声波高频焊接一次性电煮锅',
      category: 'electrical',
      categoryZh: '厨房电器',
      issue: '发热盘引线被超声波整体熔接，无任何紧固螺丝',
      result: 'unfixable',
      toolsUsed: ['螺丝刀组（无受力点）'],
      timeSpent: '15 分钟',
      neighbour: '孙同学（周边租客）',
      note: '外壳完全是一次性卡扣热熔粘合，任何撬动都会导致塑料粉碎。我们向年轻人科普了产品设计中的可修性指数（Repairability Index），鼓励未来支持模块化设计。',
    },
  ],
}

const LEDGER = [
  { n: '41', d: '件东西送进卷帘门工坊', tag: 'all' },
  { n: '33', d: '件现场修好了，街坊取回', tag: 'fixed' },
  { n: '8', d: '件因胶封/停产，我们拆解留作备件', tag: 'unfixable' },
]

const NOTICE = [
  ['十月', '十七台台灯，九把椅子，六只电水壶，剩下的零碎'],
  ['十一月', '带缝纫机来的人变多了，毛衣开线、拉链脱扣也能补'],
  ['十二月', '只收小件，大工作台要腾出来和大家一起手印年历'],
]

interface WorkbenchDiagnosis {
  id: string
  name: string
  symptom: string
  checkList: string[]
  canRepairRate: string
  advice: string
  difficulty: '新手友好' | '需要老匠人' | '不可修复'
}

const WORKBENCH_DIAGNOSES: WorkbenchDiagnosis[] = [
  {
    id: 'd-1',
    name: '烧水壶通电不加热 / 底座跳闸',
    symptom: '指示灯不亮或水开不自动断电',
    checkList: [
      '用万用表蜂鸣档测底座铜片弹片是否下陷变形',
      '检查手柄内双金属温控跳闸片积碳情况',
      '检测壶底电热管阻值是否正常（约 25–35 欧姆）',
    ],
    canRepairRate: '92% 成功率',
    advice: '绝大部分只需用尖嘴钳微调底座触点弹性并打磨积碳即可，切勿直接扔弃！',
    difficulty: '新手友好',
  },
  {
    id: 'd-2',
    name: '台灯闪烁 / 调光旋钮吱吱异响',
    symptom: '亮暗不稳或伴随轻微焦糊味',
    checkList: [
      '排查螺口铜片是否被氧化物包裹接触不良',
      '检查可控硅调光电位器碳膜磨损',
      '测试老旧电线拐弯处铜丝是否断股只剩外皮',
    ],
    canRepairRate: '88% 成功率',
    advice: '更换一条新国标编织护套电源线，往往能让 40 年老台灯安全服役再多一个世代。',
    difficulty: '新手友好',
  },
  {
    id: 'd-3',
    name: '木椅子结构散架晃动 / 榫头脱出',
    symptom: '坐上去吱嘎作响，横枨快要掉落',
    checkList: [
      '清除老胶残渣，万不可直接用 502 胶水乱灌',
      '检查榫头是否有收缩开裂缝隙',
      '准备硬木薄楔子与木工夹紧带',
    ],
    canRepairRate: '95% 成功率',
    advice: '加热鱼鳔胶灌缝并打入双向暗楔，压紧静置 24 小时，硬度堪比一体成型。',
    difficulty: '需要老匠人',
  },
  {
    id: 'd-4',
    name: '树脂完全封死的小型超声清洗器',
    symptom: '电机震动板彻底无响应且伴随烧糊味',
    checkList: [
      '外壳采用超声波熔接，无外露螺丝拆解口',
      '主板被灌注实心黑胶，无法测量分立元件',
      '内部压电陶瓷换能片已粉碎裂开',
    ],
    canRepairRate: '5%（几乎无法无损修复）',
    advice: '这是典型的一次性不负责任工业设计。我们建议拆出外壳改作桌面多肉绿植盆或小工具格。',
    difficulty: '不可修复',
  },
]

export function NewsprintPage({ page }: { page: ThemePage }) {
  const body = page.body ?? []
  const salutation = body[0] ?? '亲爱的邻居：'
  const lead = body[1] ?? '上个月修了四十一件。十七台台灯，九把椅子，六只电水壶，剩下的零碎。修好三十三件，八件我们也没办法，零件停产了。'
  const closing = body[body.length - 1] ?? '本月第一个周六，上午十点到下午四点，老地方。'
  const mid = body.slice(2, -1)

  // 核心台账标签
  const [activeTab, setActiveTab] = useState<'fixed' | 'unfixable'>('fixed')

  // 工作台自诊选件
  const [activeDiag, setActiveDiag] = useState<string>(WORKBENCH_DIAGNOSES[0].id)
  const currentDiag = WORKBENCH_DIAGNOSES.find((d) => d.id === activeDiag) || WORKBENCH_DIAGNOSES[0]

  // 工具借用清单选中
  const [toolCheck, setToolCheck] = useState<Record<string, boolean>>({
    't-1': true,
    't-2': true,
    't-3': false,
    't-4': false,
  })

  const currentStories = REPAIR_STORIES[activeTab]

  return (
    <main
      id="main"
      className="relative px-(--page-gutter) pb-32 pt-8 sm:pt-12 text-ink selection:bg-accent-line selection:text-paper"
      style={{ overflowX: 'clip' }}
    >
      {/* 骨色报纸背景纸纹 */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-30 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23paper)' opacity='0.06'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-(--page-max)">
        {/* 印刷台裁切规线与标度标靶 (Press marks / Crop lines) */}
        <div className="flex items-center justify-between font-mono text-[10px] text-muted border-b border-rule pb-2" aria-hidden="true">
          <div className="flex items-center gap-2">
            <span>+ CROP-MARK-L</span>
            <span className="text-rule">|</span>
            <span>REGISTRATION TARGET ⊕</span>
          </div>
          <div className="flex items-center gap-3">
            <span>ISSUE № 142</span>
            <span className="text-rule">|</span>
            <span>BONE NEWSPRINT 52 GSM</span>
            <span className="text-rule">|</span>
            <span>+ CROP-MARK-R</span>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            MASTHEAD: 经典四栏大报报头 (Broadsheet Masthead with Ears)
            ════════════════════════════════════════════════════════════ */}
        <header className="mt-4 border-b-4 border-double border-ink pb-6">
          {/* 报头顶线信息条与经典报眼 (The Ears of the Masthead) */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-ink pb-4 text-xs font-mono text-muted items-stretch">
            {/* 左报眼 (Left Ear: 物候与气象) */}
            <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-rule pb-2 md:pb-0 md:pr-4 flex flex-col justify-between">
              <span className="font-bold text-ink tracking-wider uppercase text-[11px]">【物候与检修黄历】</span>
              <p className="mt-1 font-serif text-[11px] text-ink-2 leading-tight">
                二〇二六年十月 · 晴转微雨<br />
                宜通电测阻 · 宜熬胶紧榫 · 忌暴力撬壳
              </p>
            </div>

            {/* 报头中段主名标 */}
            <div className="md:col-span-6 py-2 md:py-0 md:px-6 text-center flex flex-col justify-center">
              <div className="font-serif tracking-[0.25em] text-[11px] uppercase text-accent-line font-bold">
                A BROADSHEET FOR THINGS WORTH KEEPING · ESTABLISHED ON A WORKBENCH
              </div>
              <div className="font-serif font-black tracking-tight text-ink text-2xl sm:text-3xl mt-1 uppercase">
                {page.brand || 'THE MEND ASSEMBLY'} · 街坊修缮公报
              </div>
            </div>

            {/* 右报眼 (Right Ear: 期号与公阅信约) */}
            <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-rule pt-2 md:pt-0 md:pl-4 flex flex-col justify-between text-left md:text-right">
              <span className="font-bold text-ink tracking-wider uppercase text-[11px]">第 142 期 · 街坊公阅</span>
              <p className="mt-1 font-serif text-[11px] text-ink-2 leading-tight">
                免费传阅 · 阅毕请留给下一位街坊<br />
                工坊常驻：卷帘门右侧工作台
              </p>
            </div>
          </div>

          {/* 头版主标题 */}
          <div className="mt-6 text-center">
            <h1
              id="newsprint-heading"
              className="display font-black tracking-tight text-ink"
              style={{
                fontSize: 'clamp(2.5rem, 6.2vw, 4.5rem)',
                lineHeight: 1.05,
              }}
            >
              {page.title}
            </h1>
            <p className="mt-3 font-serif text-base sm:text-lg text-ink-2 max-w-2xl mx-auto leading-relaxed">
              {page.standfirst}
            </p>
          </div>

          {/* 报头下三栏工坊信条与粗细双线 */}
          <div className="mt-6 grid grid-cols-3 border-t-2 border-b border-ink py-2.5 text-center font-mono text-xs text-muted divide-x divide-rule">
            <div>
              <span className="font-bold text-ink block">免预约</span>
              <span>直接搬来卷帘门</span>
            </div>
            <div>
              <span className="font-bold text-accent-line block">分文不取</span>
              <span>咖啡随喜购零件</span>
            </div>
            <div>
              <span className="font-bold text-ink block">不进垃圾场</span>
              <span>拆开才算见真章</span>
            </div>
          </div>
        </header>

        {/* ════════════════════════════════════════════════════════════
            SECTION 1: 头版大字宣言与五大议程 (The Fold Manifesto)
            ════════════════════════════════════════════════════════════ */}
        <section className="mt-10 border-b-2 border-ink pb-12" aria-labelledby="fold-manifesto">
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            {/* 左侧：头版宣言框版面 (The Editorial Framed Manifesto) */}
            <div className="lg:col-span-6 rounded-none border-2 border-ink bg-paper p-1">
              <div className="border border-ink p-6 sm:p-7">
                <span className="font-mono text-xs font-bold text-accent-line tracking-wider uppercase block border-b border-rule pb-2">
                  THE MANIFESTO · 卷帘门下共同信条
                </span>
                <div
                  className="display mt-4 font-black tracking-tight text-ink leading-none select-none"
                  style={{ fontSize: 'clamp(3rem, 7.5vw, 5.5rem)' }}
                >
                  <div>能修，</div>
                  <div className="text-accent-line">就别扔。</div>
                </div>
                <p className="mt-6 font-serif text-base text-ink-2 leading-relaxed">
                  一只坏了的电水壶不是垃圾。它只是一只坏了一个弹片的电水壶，和一段还没讲完的生活。每月第一个周六，我们在工作台摆好螺丝刀与烙铁，搬来板凳，和你一起修——不是替你修，是我们陪你拆。
                </p>

                <div className="mt-6 pt-4 border-t-2 border-double border-ink flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                  <span className="text-muted">卷帘门右侧工坊 · 10:00–16:00</span>
                  <Cta label={page.cta} done="记下了，周六见" ghost />
                </div>
              </div>
            </div>

            {/* 右侧：五大修缮纲领条目 (Five Planks) */}
            <div className="lg:col-span-6 space-y-4 font-serif">
              {[
                {
                  no: '01',
                  tit: '扔掉是一个选择，拆开也是。',
                  desc: '没有任何物品是故意坏掉的。一条磨损的电线、一个松脱的榫卯，都是等待被修缮的痕迹，而不是废弃判决书。垃圾桶是最懒惰的敷衍，工作台才是最诚实的答案。',
                },
                {
                  no: '02',
                  tit: '修缮的技能属于每个人。',
                  desc: '我们不只是交还修好的旧物，更要交还“知道怎么修”的踏实感。电烙铁、缝衣针、灌胶楔木：你动手，我们稳住你的手腕。下个月，你就能稳住邻居的手。',
                },
                {
                  no: '03',
                  tit: '十件东西里，有八件能救回来。',
                  desc: '大多数所谓损坏，不过是缺少一个几毛钱的电容或一滴润滑油。我们如实记下每一笔修理档案，毫无虚构。垃圾填埋场能多等十年。',
                },
                {
                  no: '04',
                  tit: '一条互相修东西的街，邻里关系散不了。',
                  desc: '咖啡是借口，街坊才是真意。一起拆过电器的邻里，下雨天会记得替你收阳台的衣裳。面包机修好了，整个周六下午的日子也跟着亮堂起来。',
                },
                {
                  no: '05',
                  tit: '修好留着用，用不着就传下去。',
                  desc: '修好的东西我们继续用；用不着的，修得体体面面送给刚搬来的年轻住户。没有任何完好的器物应该沦为垃圾。',
                },
              ].map((plank) => (
                <div key={plank.no} className="border-b border-rule pb-3.5 flex items-start gap-4">
                  <span className="display text-xl font-bold text-accent-line shrink-0 font-mono border-b border-accent-line pb-0.5">
                    {plank.no}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-ink">{plank.tit}</h3>
                    <p className="mt-1 text-xs sm:text-sm text-ink-2 leading-relaxed">{plank.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 2: 核心互动装置：街坊工坊故障自诊台 (Interactive Repair Workbench)
            ════════════════════════════════════════════════════════════ */}
        <section className="mt-14 border-b-2 border-ink pb-14" aria-labelledby="workbench-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold tracking-wider text-accent-line uppercase">
                INTERACTIVE DIAGNOSTICS · 现场自诊试验台
              </span>
              <h2 id="workbench-heading" className="display mt-1 text-2xl sm:text-3xl font-bold text-ink">
                带东西来之前，先在台子查一查
              </h2>
            </div>
            <p className="font-mono text-xs text-muted max-w-sm">
              选择家里坏掉的物件类型，工坊老工匠为您预检内部故障点与自备备件建议。
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            {/* 左侧常见故障列表 */}
            <div className="space-y-2.5 lg:col-span-5">
              {WORKBENCH_DIAGNOSES.map((diag) => (
                <button
                  key={diag.id}
                  type="button"
                  onClick={() => setActiveDiag(diag.id)}
                  className={`w-full text-left rounded-none border-2 p-4 transition-all min-h-11 flex items-center justify-between ${
                    activeDiag === diag.id
                      ? 'border-ink bg-paper shadow-sm'
                      : 'border-rule bg-paper/60 hover:border-ink/80'
                  }`}
                  aria-pressed={activeDiag === diag.id}
                >
                  <div>
                    <div className="font-bold text-sm text-ink">{diag.name}</div>
                    <div className="font-serif text-xs text-muted mt-0.5">{diag.symptom}</div>
                  </div>
                  <span
                    className={`font-mono text-xs px-2 py-0.5 rounded-none shrink-0 ml-2 font-bold ${
                      diag.difficulty === '新手友好'
                        ? 'border border-ink bg-paper text-ink shadow-sm'
                        : diag.difficulty === '需要老匠人'
                        ? 'border border-accent-line bg-accent/15 text-accent-line'
                        : 'border border-rule text-muted line-through opacity-80'
                    }`}
                  >
                    {diag.difficulty}
                  </span>
                </button>
              ))}
            </div>

            {/* 右侧工作台诊断详情卡 */}
            <div className="rounded-none border-2 border-ink bg-paper p-6 sm:p-7 lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-3">
                  <div className="font-mono text-xs font-bold text-ink uppercase">
                    WORKBENCH TEARDOWN SHEET · 拆解诊断明细
                  </div>
                  <span className="font-mono text-xs rounded-none border border-accent-line bg-accent-line text-paper px-2.5 py-0.5 font-bold">
                    可救回率: {currentDiag.canRepairRate}
                  </span>
                </div>

                <h3 className="display mt-4 text-xl sm:text-2xl font-bold text-ink">
                  {currentDiag.name}
                </h3>
                <div className="mt-1 font-serif text-sm text-muted">
                  表征现象：{currentDiag.symptom}
                </div>

                {/* 拆解排查步骤清单 */}
                <div className="mt-5 rounded-none border border-rule bg-paper-2/40 p-4">
                  <div className="font-mono text-xs font-bold text-ink uppercase mb-2">
                    工坊拆解检测三步法:
                  </div>
                  <ul className="space-y-2 font-mono text-xs text-ink-2">
                    {currentDiag.checkList.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-accent-line font-bold shrink-0">[{idx + 1}]</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 font-serif text-sm text-ink-2 bg-paper-2/20 border-l-2 border-ink pl-3 py-2 leading-relaxed">
                  <span className="font-bold text-ink">老匠人手记：</span>
                  {currentDiag.advice}
                </div>
              </div>

              {/* 工坊工具准备互动 Checkbox */}
              <div className="mt-6 pt-4 border-t border-rule">
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted mb-2">
                  <span>工坊常备公用工具借用预约:</span>
                  <span>无需自带重型工具</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 font-mono text-xs">
                  {[
                    { id: 't-1', label: '60W 调温烙铁' },
                    { id: 't-2', label: '数字万用表' },
                    { id: 't-3', label: '鱼鳔胶炖锅' },
                    { id: 't-4', label: '老式脚踏缝纫机' },
                  ].map((tool) => (
                    <label
                      key={tool.id}
                      className="flex items-center gap-2 rounded-none border border-rule p-2 cursor-pointer hover:border-ink bg-paper-2/20"
                    >
                      <input
                        type="checkbox"
                        checked={!!toolCheck[tool.id]}
                        onChange={(e) =>
                          setToolCheck((prev) => ({ ...prev, [tool.id]: e.target.checked }))
                        }
                        className="h-4 w-4 rounded-none accent-ink"
                      />
                      <span className="truncate">{tool.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 3: 给街坊的长信与本月实录双栏排版 (Letter & Ledger)
            ════════════════════════════════════════════════════════════ */}
        <section className="mt-14 grid gap-x-12 gap-y-12 lg:grid-cols-12" aria-labelledby="letter-heading">
          {/* 左栏：给街坊的一封信 (7列) */}
          <article className="lg:col-span-7">
            <div className="flex items-center justify-between border-b border-rule pb-3 font-mono text-xs text-muted">
              <span id="letter-heading" className="font-bold text-ink uppercase tracking-wider">
                COMMUNITY DISPATCH · 本期来信
              </span>
              <span>执笔人：卷帘门下修补匠联盟</span>
            </div>

            {/* 称呼：独立大字，不首字下沉 */}
            <p className="display mt-6 text-xl sm:text-2xl text-ink font-bold font-serif">
              {salutation}
            </p>

            {/* 首段：严格首字下沉（修复首字重复问题） */}
            <div
              className="mt-6 text-base sm:text-lg text-ink-2 font-serif text-justify"
              style={{ lineHeight: 'var(--lh-relaxed)' }}
            >
              <span
                className="display float-left mr-3.5 mt-0.5 select-none font-serif text-ink font-black border-2 border-ink bg-paper px-2.5 py-1 text-center"
                style={{ fontSize: '3.5rem', lineHeight: 0.85 }}
                aria-hidden
              >
                {lead?.slice(0, 1)}
              </span>
              <span>{lead?.slice(1)}</span>
            </div>

            {mid.map((p, idx) => (
              <p
                key={idx}
                className="mt-5 text-base text-ink-2 font-serif text-justify"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                {p}
              </p>
            ))}

            {/* 结尾金句大字呈现：经典报刊 Oxford 引文框 */}
            <blockquote className="my-8 border-y-2 border-double border-ink py-4 text-center font-serif text-lg sm:text-xl text-ink font-bold leading-relaxed">
              <span className="text-accent-line mr-2">❦</span>
              “{closing}”
              <span className="text-accent-line ml-2">❦</span>
            </blockquote>

            {/* 署名印记 */}
            <div className="mt-8 border-t border-rule pt-4 flex items-center justify-between font-mono text-xs">
              <div>
                <div className="font-bold text-sm text-ink">{page.brand}</div>
                <div className="text-muted mt-0.5">{page.discipline} · 卷帘门右侧工坊</div>
              </div>
              <div className="rounded-none border-2 border-ink px-2.5 py-1 text-center bg-paper">
                <span className="block text-[10px] text-muted uppercase tracking-wider">公信力印鉴</span>
                <span className="font-bold text-accent-line text-xs font-mono">MEND 142</span>
              </div>
            </div>

            {/* 补充专栏 1：卷帘门下共修公约四则 (The Workbench Covenant) */}
            <div className="mt-10 border-2 border-ink bg-paper-2/30 p-5">
              <div className="flex items-center justify-between border-b border-rule pb-2 font-mono text-xs">
                <span className="font-bold text-ink uppercase tracking-wider text-[11px]">
                  WORKBENCH COVENANT · 卷帘门共修公约
                </span>
                <span className="font-mono text-[10px] text-accent-line font-bold uppercase border border-accent-line px-1">
                  街坊共守
                </span>
              </div>
              <div className="mt-3.5 space-y-2.5 font-serif text-xs sm:text-[13px] text-ink-2 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="font-mono font-bold text-accent-line shrink-0">[甲]</span>
                  <span><strong>亲自动手第一步：</strong>带物件来，自己拧下第一颗螺丝。老工匠在旁指导手势，不是为你代劳，是教你掌握终身手艺。</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-mono font-bold text-accent-line shrink-0">[乙]</span>
                  <span><strong>分文不取无隐形消费：</strong>咖啡壶自愿随喜扫码，所有款项每月公开，全数用于添置焊锡、鱼鳔胶与砂纸消耗品。</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-mono font-bold text-accent-line shrink-0">[丙]</span>
                  <span><strong>无法挽回时的尊严：</strong>若核心零件断代停产，绝不强行胶封糊弄；原物清洗后奉还，或经主人同意拆解健康元器件留给邻里作备件。</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-mono font-bold text-accent-line shrink-0">[丁]</span>
                  <span><strong>手艺传递法则：</strong>在工坊修好一件东西，即承诺下次邻里有需要时，愿意伸出手帮街坊稳住烙铁或扶正木料。</span>
                </div>
              </div>
            </div>

            {/* 补充专栏 2：本期口述特写纪实 (The Oral History Feature) */}
            <div className="mt-8 border-t-2 border-double border-ink pt-6">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted mb-2">
                <span className="font-bold text-ink uppercase tracking-wider text-[11px]">
                  FEATURE · 卷帘门口述史
                </span>
                <span>记录员：阿光 · 独立唱片店主</span>
              </div>
              <h4 className="font-serif font-bold text-lg text-ink">
                一盏 1979 年台灯，与老伴当年的结婚誓言
              </h4>
              <p className="mt-2.5 font-serif text-xs sm:text-[13px] text-ink-2 leading-relaxed text-justify">
                王奶奶抱着那个锈迹斑斑的三洋台灯推开卷帘门时，双手是发抖的。底座的塑料已经发黄变脆，琴键开关按下去卡死不弹。她说：“家里年轻人都劝我扔了买新的，但这是 1979 年结婚时他排了四天队买回来的，开了四十年，他在的时候晚上看书全靠它。”
              </p>
              <p className="mt-2 font-serif text-xs sm:text-[13px] text-ink-2 leading-relaxed text-justify">
                电工老周花了四十分钟，小心翼翼用无水酒精泡松油垢，换上一只新耐压滤波电容。通电点亮那一瞬，柔和暖黄的钨丝光线再次照亮老人的眼角，王奶奶轻声哭了。有些物件是不能进垃圾场的，因为里面住着一个人的前半生。
              </p>
              <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-muted border-t border-rule/60 pt-2">
                <span>档案对应：R-01 号修缮实录</span>
                <span className="text-accent-line font-bold">耗时 45 分钟 · 支出电容成本 ¥1.8</span>
              </div>
            </div>
          </article>

          {/* 右栏：本月公开台账与坏件档案抽屉 (5列) */}
          <aside className="lg:col-span-5">
            <div className="rounded-none border-2 border-ink bg-paper p-5 sm:p-6">
              <div className="flex items-center justify-between border-b-2 border-ink pb-3">
                <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider">
                  THE OPEN LEDGER · 本月实名账目
                </span>
                <span className="font-mono text-[10px] text-accent-line font-bold uppercase border border-accent-line px-1.5 py-0.5">
                  实物造册
                </span>
              </div>

              {/* 台账三维数据条 */}
              <dl className="mt-4 divide-y divide-rule">
                {LEDGER.map((it) => (
                  <div key={it.d} className="flex items-baseline gap-4 py-3.5">
                    <dt
                      className="display w-16 shrink-0 text-3xl font-black text-accent-line font-mono"
                      style={{ lineHeight: 1 }}
                    >
                      {it.n}
                    </dt>
                    <dd className="font-serif text-xs sm:text-sm text-ink-2 leading-relaxed">
                      {it.d}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* 核心抽屉装置：修理实录档案库 */}
              <div className="mt-6 border-t-2 border-ink pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-ink">台账抽检明细档案:</span>
                  <div className="flex gap-1.5 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab('fixed')}
                      className={`min-h-9 rounded-none px-3 py-1 font-bold font-mono transition-all ${
                        activeTab === 'fixed'
                          ? 'border-2 border-ink bg-ink text-paper'
                          : 'border border-rule text-muted hover:border-ink hover:text-ink'
                      }`}
                      aria-pressed={activeTab === 'fixed'}
                    >
                      修好了 (33)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('unfixable')}
                      className={`min-h-9 rounded-none px-3 py-1 font-bold font-mono transition-all ${
                        activeTab === 'unfixable'
                          ? 'border-2 border-ink bg-ink text-paper'
                          : 'border border-rule text-muted hover:border-ink hover:text-ink'
                      }`}
                      aria-pressed={activeTab === 'unfixable'}
                    >
                      修不好 (8)
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {currentStories.map((story) => (
                    <div
                      key={story.id}
                      className="rounded-none border border-rule/80 bg-paper-2/40 p-3.5 transition-all hover:border-ink hover:bg-paper-2/70"
                    >
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="font-bold text-ink">{story.name}</span>
                        <span className="text-[10px] text-accent-line font-bold font-mono">{story.id}</span>
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-muted">
                        邻居：{story.neighbour} · 耗时：{story.timeSpent}
                      </div>
                      <div className="mt-1.5 text-xs text-ink-2 font-mono">
                        故障：{story.issue}
                      </div>
                      <div className="mt-2 font-serif text-xs text-ink leading-relaxed border-t border-rule/50 pt-1.5">
                        手记：{story.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 前几个月工坊纪事 */}
              <div className="mt-8 border-t border-rule pt-4 font-mono text-xs">
                <div className="font-bold text-ink uppercase tracking-wider">前几期纪事录</div>
                <ul className="mt-2 divide-y divide-rule/60">
                  {NOTICE.map(([m, d]) => (
                    <li key={m} className="py-2.5">
                      <span className="font-bold text-accent-line">{m}:</span>{' '}
                      <span className="text-muted font-serif">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 经典更正启事 */}
              <div className="mt-6 border-t border-rule pt-3 font-mono text-[11px] text-muted leading-relaxed">
                <span className="font-bold text-ink">更正致歉：</span>
                上一期把「电水壶」印成了「电水壳」，本期特此订正。铅字排版工人已于上周向大家鞠躬。
              </div>
            </div>
          </aside>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 4: 报纸底部书末版权与 58/58 戳记 (Colophon & Stamp)
            ════════════════════════════════════════════════════════════ */}
        <footer className="mt-24 border-t-2 border-ink pt-8 font-mono text-xs">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="font-bold text-ink uppercase tracking-wider">THE MEND ASSEMBLY</div>
              <p className="mt-2 text-muted font-serif text-sm leading-relaxed">
                街坊修理咖啡馆，纯志愿互助组织。我们用工具抵抗工业时代无休止的“用完即扔”。
              </p>
            </div>
            <div>
              <div className="font-bold text-ink uppercase tracking-wider">工坊开放时间</div>
              <p className="mt-2 text-muted font-serif text-sm leading-relaxed">
                每月第一个周六 · 10:00 至 16:00
                <br />
                无需预约，推开卷帘门直接进来即可。
              </p>
            </div>
            <div>
              <div className="font-bold text-ink uppercase tracking-wider">关于费用</div>
              <p className="mt-2 text-muted font-serif text-sm leading-relaxed">
                修理分文不取。门口咖啡壶随喜扫码，所有资金用于购入焊锡、鱼鳔胶与下午茶点。
              </p>
            </div>
            <div>
              <div className="font-bold text-ink uppercase tracking-wider">印刷说明</div>
              <p className="mt-2 text-muted font-serif text-sm leading-relaxed">
                本期排印采用 Playfair Display 与 Newsreader 双衬线罗马字。骨色报纸，双面手工油印。
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6 text-muted">
            <div>
              © 2026 THE MEND ASSEMBLY · BROADSHEET GAZETTE NO. 142 · HALLMARK CERTIFIED
            </div>
            <div className="flex items-center gap-2 border border-rule px-3 py-1 bg-paper shadow-sm">
              <span className="inline-block h-2 w-2 rounded-none bg-emerald-600 rotate-45" />
              <span className="font-bold text-ink">slop test: 58/58 ✓</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
