export interface Verb {
  id: string
  cmd: string
  zh: string
  summary: string
  detail: string
  points: string[]
  output: string
}

/** 一个默认行为，三个显式动词。 */
export const verbs: Verb[] = [
  {
    id: 'build',
    cmd: 'hallmark',
    zh: '构建',
    summary: '构建全新 UI。',
    detail:
      '用户要做一个新东西时的默认行为。先扫项目既有的字体、配色与动效依赖，再定体裁、挑宏观结构、挑主题，最后跑一遍 slop 测试才交付。',
    points: [
      '预扫描：design.md 优先，其次字体栈、调色板、动效依赖、间距标度、框架',
      '先问三件事：受众、用例、语气；用户说「你看着办」就把推断写在产出里',
      '宏观结构、导航原型、页脚原型、主题四件事一起定，并记进 .hallmark/log.json',
    ],
    output: '一个自包含页面 + tokens.css',
  },
  {
    id: 'audit',
    cmd: 'hallmark audit <target>',
    zh: '审计',
    summary: '给现有代码打分，只出整改清单。',
    detail:
      '读取目标，对照反模式清单逐条评分，返回按优先级排序的整改清单。只报告，不修改任何一行。',
    points: [
      '只出清单，不动手改，方便你自己决定先修哪条',
      '评分维度复用 slop 测试的通用关卡，不改多样化关卡',
      'studied 标记的页面在「是否落回默认」这条上查得更严',
    ],
    output: '一份带排序的整改清单',
  },
  {
    id: 'redesign',
    cmd: 'hallmark redesign <target>',
    zh: '重做',
    summary: '推翻结构，保留文案与信息架构。',
    detail:
      '保留目标的内容、意图、路由、品牌与信息架构，换掉视觉与交互层：新的分块节奏、新的标题位置、新的组件语气。除非你明确确认，否则不会整体重建。',
    points: [
      '默认在原实现边界内改，不删生产文件、不动路由树',
      '可以带 --mood <name> 指定语气',
      '改完可以把锁定的设计系统写进 design.md，供后续页面复用',
    ],
    output: '同一份 IA，另一张脸',
  },
  {
    id: 'study',
    cmd: 'hallmark study <截图 | URL>',
    zh: '提取',
    summary: '从你欣赏的设计里取出 DNA，不克隆像素。',
    detail:
      '你贴一张截图或一个网址。Hallmark 读出宏观结构、原型、字体搭配与色彩锚点，先出一份诊断报告，再问你是照这份 DNA 重建、锁成可移植的 design.md，还是到此为止。',
    points: [
      'URL 模式能报出精确字体名与精确色值，但判断不了节奏，报告里会写明',
      '拒绝像素级克隆，也拒绝模板市场链接',
      '图片模式读的是结构与节奏，字体只能给出角色与候选',
    ],
    output: '诊断报告，或一份 design.md',
  },
]
