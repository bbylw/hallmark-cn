export interface Example {
  slug: string
  name: string
  category: string
  theme?: string
  url: string
}

/** 全部案例都来自不同需求，截图取自 Hallmark 官方仓库。 */
export const examples: Example[] = [
  {
    slug: 'hero-hum-07',
    name: 'Bubble',
    category: '酸面团 App',
    theme: 'Hum',
    url: 'https://www.usehallmark.com/examples/hum-07/',
  },
  {
    slug: 'hero-cobalt-01',
    name: 'Distil',
    category: '内容提取 API',
    theme: 'Cobalt',
    url: 'https://www.usehallmark.com/examples/cobalt-01/',
  },
  {
    slug: 'hero-carnival-01',
    name: 'Cold Snap',
    category: '唱片厂牌 EP',
    theme: 'Carnival',
    url: 'https://www.usehallmark.com/examples/carnival-01/',
  },
  {
    slug: 'hero-lumen-01',
    name: 'Cinder',
    category: 'AI 推理工具',
    theme: 'Lumen',
    url: 'https://www.usehallmark.com/examples/lumen-01/',
  },
  {
    slug: 'hero-custom-03',
    name: 'Ferns and Fathom',
    category: '茶饮菜单',
    theme: 'Custom',
    url: 'https://www.usehallmark.com/examples/custom-03/',
  },
  {
    slug: 'hero-garden-01',
    name: 'Hollowback Apiary',
    category: '蜂蜜农场',
    theme: 'Garden',
    url: 'https://www.usehallmark.com/examples/garden-01/',
  },
  {
    slug: 'hero-riso-01',
    name: 'Off-Register',
    category: '孔版印刷展',
    theme: 'Riso',
    url: 'https://www.usehallmark.com/examples/riso-01/',
  },
  {
    slug: 'hero-press-01',
    name: 'Press Quaternary',
    category: '字体工作室',
    theme: 'Custom',
    url: 'https://www.usehallmark.com/examples/press-01/',
  },
  {
    slug: 'hero-tally',
    name: 'Tally',
    category: 'SaaS',
    theme: '现代极简',
    url: 'https://www.usehallmark.com/examples/tally/',
  },
  {
    slug: 'hero-wayfare',
    name: 'Wayfare',
    category: '旅行预订',
    theme: '氛围感',
    url: 'https://www.usehallmark.com/examples/wayfare/',
  },
  {
    slug: 'hero-najm',
    name: 'NAJM',
    category: '摩洛哥时尚品牌',
    url: 'https://www.usehallmark.com/examples/najm/',
  },
  {
    slug: 'hero-hyperlane',
    name: 'Hyperlane',
    category: '开发者基础设施',
    url: 'https://www.usehallmark.com/examples/hyperlane/',
  },
  {
    slug: 'hero-custom-02',
    name: 'The Cascadia Nightjar',
    category: '卧铺火车票',
    theme: 'Custom',
    url: 'https://www.usehallmark.com/examples/custom-02/',
  },
  {
    slug: 'hero-custom-04',
    name: 'The Mend Assembly',
    category: '修理咖啡馆大报',
    theme: 'Custom',
    url: 'https://www.usehallmark.com/examples/custom-04/',
  },
]
