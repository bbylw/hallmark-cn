import fs from 'fs'
import path from 'path'

function walk(dir) {
  let files = []
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item)
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full))
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(full)
    }
  }
  return files
}

const files = walk('src')
let changedCount = 0

const replacements = [
  ['px-[var(--page-gutter)]', 'px-(--page-gutter)'],
  ['max-w-[var(--page-max)]', 'max-w-(--page-max)'],
  ['min-h-[100dvh]', 'min-h-dvh'],
  ['aspect-[16/10]', 'aspect-16/10'],
  ['aspect-[16/9]', 'aspect-video'],
  ['aspect-[1/1]', 'aspect-square'],
  ['focus-visible:outline-(--hm-focus)', 'focus-visible:outline-focus'],
  ['focus-visible:outline-[var(--hm-focus)]', 'focus-visible:outline-focus'],
  ['bg-[var(--hm-paper)]', 'bg-(--hm-paper)'],
  // Spacing mappings for standard pixel multiples
  ['min-h-[44px]', 'min-h-11'],
  ['min-h-[36px]', 'min-h-9'],
  ['min-h-[32px]', 'min-h-8'],
  ['min-h-[40px]', 'min-h-10'],
  ['min-h-[48px]', 'min-h-12'],
  ['min-h-[52px]', 'min-h-13'],
  ['min-h-[56px]', 'min-h-14'],
  ['min-w-[44px]', 'min-w-11'],
  ['min-w-[56px]', 'min-w-14'],
  ['min-w-[36px]', 'min-w-9'],
  ['min-w-[32px]', 'min-w-8'],
]

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8')
  const original = content

  for (const [from, to] of replacements) {
    content = content.replaceAll(from, to)
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8')
    changedCount++
    console.log(`Updated: ${file}`)
  }
}

console.log(`Finished updating ${changedCount} files.`)
