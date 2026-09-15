// 静态预览服务：node .smoke/serve.mjs  (默认 8199)
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const ROOT = new URL('../dist/', import.meta.url).pathname.replace(/^\//, '')
const PORT = Number(process.env.PORT ?? 8199)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  let p = normalize(decodeURIComponent(url.pathname))
  if (p.endsWith('/')) p += 'index.html'
  try {
    const buf = await readFile(join(ROOT, p))
    res.writeHead(200, {
      'content-type': MIME[extname(p)] ?? 'application/octet-stream',
    })
    res.end(buf)
  } catch {
    try {
      const buf = await readFile(join(ROOT, 'index.html'))
      res.writeHead(200, { 'content-type': MIME['.html'] })
      res.end(buf)
    } catch {
      res.writeHead(404)
      res.end('not found')
    }
  }
}).listen(PORT, () => console.log(`http://127.0.0.1:${PORT}`))
