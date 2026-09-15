// 用 agnes-text-to-image skill 生成主题页需要的摄影/配图。
// 输出落到 assets/examples/，再跑 `bun run images` 压成 webp + jpg。
//
// 用法：bun run photos            生成全部
//       bun run photos atelier   只生成带这个前缀的
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SKILL =
  process.env.AGNES_SKILL ??
  'C:/Users/bbylw/.agents/skills/agnes-text-to-image/scripts/generate.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** 每一项：[文件名, 尺寸档+比例, 提示词] */
const JOBS = [
  [
    'atelier-hero',
    '2K 3:2',
    '时装编辑摄影，横向广角构图。两位模特身着廓形羊毛大衣，站在一座十九世纪玻璃温室里，清晨七点。北向自然光穿过结着水汽的玻璃，只用环境光，没有补光，没有反光板。低饱和配色：灰、煤、砖红、米色。主体位于画面左侧三分之一，右侧留出大面积玻璃、藤架与盆栽。35mm 胶片质感，细颗粒，浅景深，纪实而非广告感。无文字，无 logo，无水印，无边框。',
  ],
  [
    'atelier-look-01',
    '2K 2:3',
    '时装编辑摄影，竖构图，全身像。一位模特身着米色羊毛大衣，肩线手工绷过，四分之三侧身站在石灰墙面之前。左侧自然窗光，深而柔的阴影，无补光。低饱和灰与米色。35mm 胶片质感，细颗粒，安静克制。人物居中偏下，上方留白。无文字，无 logo，无水印，无边框。',
  ],
  [
    'atelier-look-02',
    '2K 2:3',
    '时装编辑摄影，竖构图，全身像。一位模特身着煤灰色羊绒长外套，站在旧玻璃房的锈蚀钢架前，回头看向画面之外。侧逆光，清晨冷调。低饱和灰与砖色调。35mm 胶片质感，细颗粒。人物居中偏下，上方留白。无文字，无 logo，无水印，无边框。',
  ],
  [
    'atelier-detail',
    '2K 3:2',
    '静物特写摄影，横向构图。叠加的羊毛与羊绒面料局部，能看到手工缝线与绷过的肩线，放在旧木工作台上。自然侧窗光，深阴影。低饱和灰、米、砖色。35mm 胶片质感，细颗粒，浅景深。无文字，无 logo，无水印，无边框。',
  ],
]

const only = process.argv[2]

if (!existsSync(SKILL)) {
  console.error(`找不到 skill 脚本：${SKILL}`)
  process.exit(1)
}

const picked = JOBS.filter(([name]) => !only || name.includes(only))
if (picked.length === 0) {
  console.error(`没有匹配 "${only}" 的任务`)
  process.exit(1)
}

console.log(`准备生成 ${picked.length} 张，输出到 assets/examples/`)
console.log('（每张走 2K 档，提示词优化 + 生成可能要几分钟）\n')

const children = picked.map(
  ([name, size, prompt]) =>
    new Promise((done) => {
      const child = spawn(
        process.execPath,
        [
          SKILL,
          prompt,
          size,
          '--model=2.5',
          `--out=${resolve(root, 'assets/examples', `${name}.png`)}`,
        ],
        { stdio: ['ignore', 'pipe', 'pipe'] },
      )
      let out = ''
      child.stdout.on('data', (d) => (out += d))
      child.stderr.on('data', (d) => (out += d))
      child.on('exit', (code) => {
        const saved = [...out.matchAll(/"saved_to":\s*"([^"]+)"/g)].map(
          (m) => m[1],
        )
        const actual = [...out.matchAll(/"actual_size":\s*"([^"]+)"/g)].map(
          (m) => m[1],
        )
        console.log(
          `${code === 0 ? '完成' : '失败'} ${name} · ${actual[0] ?? '未知尺寸'} · ${saved[0] ?? '(无输出)'}`,
        )
        if (code !== 0) console.log(out.slice(-1200))
        done()
      })
    }),
)

await Promise.all(children)
console.log('\n全部结束。接着跑 bun run images 压图。')
