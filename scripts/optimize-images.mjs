// 把 assets/examples 里的原图压成 public/examples 下的 webp + jpg 兜底。
// 用法：bun run images
import { mkdir, readdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = resolve(root, 'assets/examples')
const out = resolve(root, 'public/examples')

await mkdir(out, { recursive: true })

const files = (await readdir(src)).filter((f) => /\.(jpe?g|png)$/i.test(f))
if (files.length === 0) {
  console.log('assets/examples 里没有源图，跳过。')
  process.exit(0)
}

// 页面正文栏最宽 1248px，输出必须 ≥ 这个宽度，否则大图会被拉大而发虚。
const MAX_W = 1440

for (const file of files) {
  const slug = file.replace(/\.(jpe?g|png)$/i, '')
  const buf = await sharp(resolve(src, file))
    .rotate()
    .resize({ width: MAX_W, withoutEnlargement: true })
  await buf
    .clone()
    .webp({ quality: 76, effort: 5 })
    .toFile(resolve(out, `${slug}.webp`))
  await buf
    .clone()
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(resolve(out, `${slug}.jpg`))
  const meta = await buf.clone().metadata()
  console.log(`${slug}: webp + jpg · ${meta.width}×${meta.height}`)
}

console.log(`完成，共 ${files.length} 张。`)
