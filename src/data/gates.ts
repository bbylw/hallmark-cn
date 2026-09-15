export interface GateGroup {
  id: string
  name: string
  count: number
  blurb: string
  /** no 为 Hallmark 官方 slop-test.md 里的关卡编号；没有编号的只写判据 */
  samples: { no?: string; text: string }[]
}

/**
 * 58 道 slop-test 关卡，按族分组（全面对齐 Hallmark v1.1.0 官方规范）。
 * 带编号的判据来自 Hallmark 官方 references/slop-test.md。
 */
export const gateGroups: GateGroup[] = [
  {
    id: 'variety',
    name: '结构与多样化',
    count: 9,
    blurb: '两次产出不能落在同一个形状上，也不能共用同一套导航与页脚。',
    samples: [
      { no: '54', text: '悬挂式页眉：左编号右标题，直接判失败，必须单列垂直堆叠' },
      { no: '57', text: '学习到的 DNA 严禁中途丢弃并回退到目录默认主题' },
      { text: '连续两次产出共用同一个导航原型或页脚原型' },
    ],
  },
  {
    id: 'type',
    name: '版式',
    count: 7,
    blurb: '标题永远正体，强调靠字重与颜色，不靠斜体；全大写标题严防碰撞。',
    samples: [
      { no: '38a', text: '斜体标题：整段斜体或单个斜体强调词都不允许' },
      { no: '55', text: '全大写标题行高低于 1.0 导致折行字形碰撞，底线必须 ≥ 1.0' },
      { no: '51', text: '大标题里的长单词不折行，缺少 overflow-wrap: anywhere' },
    ],
  },
  {
    id: 'color',
    name: '色彩与对比',
    count: 7,
    blurb: '一个强调色，锁死，全页不再出现第二个；严禁墨色压墨色。',
    samples: [
      { no: '48', text: '渲染中途即兴写死色值，绕过 token 块' },
      { no: '41', text: '严防暗区墨色压墨色或按钮文字与底色对比不足' },
      { text: '焦点环对背景至少 3:1，正文对比达到 AA (4.5:1)' },
    ],
  },
  {
    id: 'mobile',
    name: '移动端布局安全',
    count: 7,
    blurb: '320、375、414、768 四个宽度全部验过，是硬地板不是愿望清单。',
    samples: [
      { no: '34', text: '出现横向滚动，或用了 overflow-x: hidden 而不是 clip' },
      { no: '50', text: '带图的网格轨道写裸 1fr，而不是 minmax(0, 1fr)' },
      { no: '56', text: '级联吸顶元素缺少高度偏移导致遮挡导航栏' },
    ],
  },
  {
    id: 'motion',
    name: '微交互与状态',
    count: 10,
    blurb: '交互元素要写满状态，动效只能动 transform 与 opacity，不加多余杂耍。',
    samples: [
      { no: '53', text: '单选标签页在移动端触发滚动跳动' },
      { no: '15', text: '焦点环立刻出现且不带过渡动画，键盘用户秒感知' },
      { no: '12', text: 'UI 状态切换严禁使用物理弹跳/过冲缓动' },
    ],
  },
  {
    id: 'honest',
    name: '内容诚实',
    count: 5,
    blurb: '没给过的数字不许编，没拍过的截图不许画，图标单页库统一。',
    samples: [
      { no: '46', text: '编造指标：凭空的增长百分比与客户数量' },
      { no: '47', text: '重绘浏览器工具条、手机边框、代码窗口假外框' },
      { no: '30', text: '混用多套图标库，或使用 emoji 充当功能图标' },
    ],
  },
  {
    id: 'a11y',
    name: '可访问性与状态',
    count: 5,
    blurb: '交互元素写满状态，装饰性图形标注语义隐藏，正文测度合规。',
    samples: [
      { no: '26', text: '按钮、输入框必须写满默认、悬停、焦点、按下等八个状态' },
      { no: '33', text: '装饰性 SVG 或纯 CSS 艺术图形必须声明 aria-hidden="true"' },
      { no: '39', text: '输入框激活时严禁通过改变 border-width 导致页面跳动' },
    ],
  },
  {
    id: 'delivery',
    name: '交付卫生与富化',
    count: 8,
    blurb: '产出要带印章、要写项目记忆，绝不覆盖已有的全局样式表。',
    samples: [
      { no: '20', text: '产出缺少 Hallmark macrostructure/theme/nav/footer 印章' },
      { no: '52', text: '章节头部在移动端没有塌成单列导致标题标签挤压' },
      { text: '覆盖项目已有的入口样式表，或漏写 tokens.css' },
    ],
  },
]

export const totalGates = gateGroups.reduce((sum, g) => sum + g.count, 0)

