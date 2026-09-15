import { readFileSync, writeFileSync } from 'node:fs'

const f = 'src/pages/themes/cobalt.tsx'
const raw = readFileSync(f, 'utf8')
const eol = raw.includes('\r\n') ? '\r\n' : '\n'
const lines = raw.replace(/\r\n/g, '\n').split('\n')

const start = lines.findIndex((l) => l.includes('── 四个阶段'))
if (start < 0) {
  console.log('未找到四阶段锚点')
  process.exit(1)
}

const tail = `        {/* ── 四个阶段 ───────────────────────────────────── */}
        <div className="mt-16 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {(page.planes ?? []).map((pl, i) => (
            <div
              key={pl.t}
              className="pt-3"
              style={{ borderTop: '2px solid var(--hm-ink)' }}
            >
              <span className="font-mono text-xs text-accent-line">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="display mt-1 text-md text-ink">{pl.t}</div>
              <p className="mt-1 text-sm text-muted">{pl.d}</p>
            </div>
          ))}
        </div>

        {/* ── 官方示例：这是 Hallmark 自己生成的页，不是本站的界面，
               图注必须说清楚，不能拿它冒充本页的产品截图 ───────── */}
        {page.images?.length ? (
          <figure className="mt-16 grid gap-x-12 gap-y-6 lg:grid-cols-[18rem_1fr]">
            <figcaption>
              <span className="meta text-muted">官方示例</span>
              <p
                className="mt-3 text-sm text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                Hallmark 用同一套主题给 Distil 生成的示例页。同一个接口换了个用法：传一个网址，拿回干净的
                Markdown。
              </p>
            </figcaption>
            <div
              className="overflow-hidden"
              style={{
                border: '1px solid var(--hm-rule-2)',
                borderRadius: 'var(--hm-radius-card)',
              }}
            >
              <Img slug={page.images[0]} alt="Hallmark 为 Distil 生成的官方示例页" />
            </div>
          </figure>
        ) : null}

        {/* ── 接口 ───────────────────────────────────────── */}
        <div
          className="mt-16 grid gap-px lg:grid-cols-2"
          style={{ backgroundColor: 'var(--hm-rule-2)' }}
        >
          {[
            { t: '请求', p: reqPane },
            { t: '响应', p: resPane },
          ].map((b) => (
            <div
              key={b.t}
              className="p-6"
              style={{ backgroundColor: 'var(--hm-paper)' }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="meta text-muted">{b.t}</span>
                <span
                  className="font-mono text-xs"
                  style={{ color: 'var(--hm-accent-line)' }}
                >
                  {b.p.head}
                </span>
              </div>
              <pre className="mt-4 overflow-x-auto font-mono text-xs text-ink-2">
                {b.p.body}
              </pre>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted" style={{ maxWidth: '52ch' }}>
          {page.code?.out}
        </p>

        <div className="mt-12">
          <Cta label={page.cta} done="key 已发邮箱" />
        </div>
      </div>
    </main>
  )
}
`

writeFileSync(
  f,
  [...lines.slice(0, start), tail].join(eol),
)
console.log(`已重排第 ${start + 1} 行之后的底部：四阶段 → 官方示例 → 接口 → 行动`)
