export interface GateGroup {
  id: string
  name: string
  count: number
  blurb: string
  /** no 为 Hallmark 官方 slop-test.md 里的关卡编号；没有编号的只写判据 */
  samples: { no?: string; text: string }[]
}

/**
 * 57 道 slop-test 关卡，按族分组。
 * 带编号的判据来自 Hallmark 官方 references/slop-test.md。
 */
export const gateGroups: GateGroup[] = [
  {
    id: 'variety',
    name: '结构与多样化',
    count: 8,
    blurb: '两次产出不能落在同一个形状上，也不能共用同一套导航与页脚。',
    samples: [
      { no: '54', text: '悬挂式页眉：左编号右标题，直接判失败' },
      { text: '连续两次产出共用同一个导航原型或页脚原型' },
    ],
  },
  {
    id: 'type',
    name: '版式',
    count: 7,
    blurb: '标题永远正体，强调靠字重与颜色，不靠斜体。',
    samples: [
      { no: '38a', text: '斜体标题：整段斜体或单个斜体强调词都不允许' },
      { text: '标题字号按字数分档，超过 90 字符必须改写而不是调小' },
    ],
  },
  {
    id: 'color',
    name: '色彩与对比',
    count: 6,
    blurb: '一个强调色，锁死，全页不再出现第二个。',
    samples: [
      { no: '48', text: '渲染中途即兴写死色值，绕过 token 块' },
      { text: '焦点环对背景至少 3:1，正文对比达到 AA' },
    ],
  },
  {
    id: 'mobile',
    name: '移动端布局安全',
    count: 8,
    blurb: '320、375、414、768 四个宽度全部验过，是硬地板不是愿望清单。',
    samples: [
      { no: '34', text: '出现横向滚动，或用了 overflow-x: hidden 而不是 clip' },
      { no: '50', text: '带图的网格轨道写裸 1fr，而不是 minmax(0, 1fr)' },
    ],
  },
  {
    id: 'motion',
    name: '微交互与状态',
    count: 7,
    blurb: '交互元素要写满八个状态，动效只能动 transform 与 opacity。',
    samples: [
      { no: '53', text: '单选标签页在移动端触发滚动跳动' },
      { text: '按钮、输入框没写满默认、悬停、焦点、按下等八个状态' },
    ],
  },
  {
    id: 'honest',
    name: '内容诚实',
    count: 6,
    blurb: '没给过的数字不许编，没拍过的截图不许画。',
    samples: [
      { no: '46', text: '编造指标：凭空的增长百分比与客户数量' },
      { no: '47', text: '重绘浏览器工具条、手机边框、代码窗口假外框' },
    ],
  },
  {
    id: 'a11y',
    name: '可访问性',
    count: 6,
    blurb: '焦点环立刻出现且不带过渡动画，语义与对比一起过。',
    samples: [
      { no: '19', text: '占位人物用了 Jane Doe 这类通用名' },
      { text: '焦点环要立刻出现，不允许给它的出现加动画' },
    ],
  },
  {
    id: 'delivery',
    name: '交付卫生',
    count: 9,
    blurb: '产出要带印章、要写项目记忆，绝不覆盖已有的全局样式表。',
    samples: [
      { no: '51', text: '大标题里的长单词不折行，缺少 overflow-wrap' },
      { no: '52', text: '章节头部在移动端没有塌成一列' },
      { text: '覆盖项目已有的入口样式表，或漏写 tokens.css' },
    ],
  },
]

export const totalGates = gateGroups.reduce((sum, g) => sum + g.count, 0)
