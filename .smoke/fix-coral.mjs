import { readFileSync, writeFileSync } from 'node:fs'

const f = 'src/pages/themes/coral.tsx'
const raw = readFileSync(f, 'utf8')
const eol = raw.includes('\r\n') ? '\r\n' : '\n'
let s = raw.replace(/\r\n/g, '\n')

const anchor = `              <div
                className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-3"
                style={{ backgroundColor: 'var(--hm-paper-2)' }}
              >`

if (!s.includes(anchor)) {
  console.log('未找到表头锚点')
  process.exit(1)
}
s = s.replace(
  anchor,
  `              <div className="overflow-x-auto">
                <div className="min-w-[26rem]">
${anchor}`,
)

const tail = `                </span>
              </div>
            </div>

            <p`

if (!s.includes(tail)) {
  console.log('未找到收尾锚点')
  process.exit(1)
}
s = s.replace(
  tail,
  `                </span>
              </div>
                </div>
              </div>
            </div>

            <p`,
)

writeFileSync(f, s.replace(/\n/g, eol))
console.log('coral 账目表已套上横向滚动容器')
