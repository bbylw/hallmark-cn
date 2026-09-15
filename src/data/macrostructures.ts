export interface Macrostructure {
  no: number
  name: string
  zh: string
  desc: string
}

/** 21 种宏观结构。Hallmark 先定结构，再挑主题皮肤。 */
export const macrostructures: Macrostructure[] = [
  {
    no: 1,
    name: 'Bento Grid',
    zh: '便当网格',
    desc: '大小不一的模块拼成不规则网格，节奏来自尺寸变化，而不是卡片的一致性。',
  },
  {
    no: 2,
    name: 'Long Document',
    zh: '长文',
    desc: '读起来像备忘录、信件或日志。没有营销结构，只有连续散文与内联小标题。',
  },
  {
    no: 3,
    name: 'Marquee Hero',
    zh: '通栏宣言',
    desc: '首屏就是首屏。一整屏只放一句主张，没有副标题也没有按钮。',
  },
  {
    no: 4,
    name: 'Stat-Led',
    zh: '数字领衔',
    desc: '首屏是一个巨大的数字。后面所有内容都在为它做注脚。',
  },
  {
    no: 5,
    name: 'Workbench',
    zh: '工作台',
    desc: '带框的产品截图是主体。页面是一次应用导览，少营销文案，多「你拿它能干什么」。',
  },
  {
    no: 6,
    name: 'Conversational FAQ',
    zh: '问答体',
    desc: '问题写得直接，答案写得简短。整页读起来像一次诚实的采访。',
  },
  {
    no: 7,
    name: 'Manifesto',
    zh: '宣言',
    desc: '论战式的大字。页面先告诉读者该相信什么，再告诉他们该买什么。',
  },
  {
    no: 8,
    name: 'Photographic',
    zh: '影像主导',
    desc: '每一屏由一张巨幅图片统治。文字是注解，不是标题。先看，再读。',
  },
  {
    no: 9,
    name: 'Quote-Led',
    zh: '引言领衔',
    desc: '首屏是一句带出处的引用。标题借的是别人的信誉，不是品牌自己的嗓门。',
  },
  {
    no: 10,
    name: 'Specimen',
    zh: '字样样本',
    desc: '左侧编号标注、巨型衬线、不对称分栏、发丝线，纯排版式的行动号召。',
  },
  {
    no: 11,
    name: 'Catalogue',
    zh: '目录',
    desc: '同一样东西的变体排成均匀网格：字体、配色、SKU。页面是一份视觉库存索引。',
  },
  {
    no: 12,
    name: 'Letter',
    zh: '书信',
    desc: '第一人称、手写感、亲密。以称呼开头，首屏不放任何按钮。',
  },
  {
    no: 13,
    name: 'Index-First',
    zh: '索引优先',
    desc: '页面本身就是一串链接。没有主图，没有叙事流，导航即设计。',
  },
  {
    no: 14,
    name: 'Narrative Workflow',
    zh: '叙事流程',
    desc: '编号的阶段讲出用户随着时间如何使用产品。整页是一条流程时间轴。',
  },
  {
    no: 15,
    name: 'Split Studio',
    zh: '对开工作室',
    desc: '双联画。每个内容块都把屏幕一分为二，一侧文字一侧证据，方向交替向下。',
  },
  {
    no: 16,
    name: 'Feature Stack',
    zh: '特性堆叠',
    desc: '左侧粘住说明，右侧随滚动切换截图。电影般的节奏。',
  },
  {
    no: 17,
    name: 'Type Specimen',
    zh: '字体样本',
    desc: '字体本身就是设计。适合铸造厂主页或以定制字体为卖点的设计系统。',
  },
  {
    no: 18,
    name: 'Portfolio Grid',
    zh: '作品网格',
    desc: '可筛选的项目卡片。工作室或设计师主页，作品即产品。',
  },
  {
    no: 19,
    name: 'Map / Diagram',
    zh: '图示',
    desc: '一张大的空间示意图组织整页：流程图、平面图、网络图、系统图。',
  },
  {
    no: 20,
    name: 'Ecosystem Index',
    zh: '生态索引',
    desc: '多个发现入口并存：精选、最新、按分类、按人。价值来自涌现与浏览。',
  },
  {
    no: 21,
    name: 'Component Playground',
    zh: '组件试验场',
    desc: '可交互的代码加预览块是主体。每个块先演示，再给你可复制的那段。',
  },
]
