#!/usr/bin/env node
/**
 * 部署到 GitHub Pages（gh-pages 分支），自定义域 hallmark.ndjp.net。
 *
 * 流程：
 *   1. bun run build
 *   2. 把 index.html 复制成 404.html —— 路由是 BrowserRouter，
 *      GitHub Pages 没有服务端回退，找不到的路径靠 404.html 交还给前端路由
 *   3. 写入 CNAME（public/CNAME 会随构建进 dist，这里再兜底写一次）
 *   4. 在 dist 里初始化独立 git 仓库，强推到 origin 的 gh-pages 分支
 *
 * 用法：bun run deploy
 */
import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const REPO = 'https://github.com/bbylw/hallmark-cn.git'
const DOMAIN = 'hallmark.ndjp.net'
const run = (cmd, cwd = process.cwd()) =>
  execSync(cmd, { cwd, stdio: 'inherit' })

run('bun run build')

const dist = resolve('dist')
if (!existsSync(resolve(dist, 'index.html'))) {
  console.error('构建产物缺失，中止')
  process.exit(1)
}
copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
writeFileSync(resolve(dist, 'CNAME'), `${DOMAIN}\n`)

const git = (cmd) => run(cmd, dist)
git('git init -b gh-pages')
git('git add -A')
git(`git commit -m "deploy: ${new Date().toISOString()}"`)
git(`git remote add origin ${REPO} || git remote set-url origin ${REPO}`)
git('git push -f origin gh-pages')

console.log('\n已推送 gh-pages 分支。Pages 状态：')
run('gh api repos/bbylw/hallmark-cn/pages --jq "{url: .html_url, status: .status, cname: .cname}"')
