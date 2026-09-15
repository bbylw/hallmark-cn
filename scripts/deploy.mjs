#!/usr/bin/env node
/**
 * 部署：触发 GitHub Actions（Actions 里用 Bun 构建），并盯到跑完。
 * Pages 的源是 GitHub Actions 工作流，不是 gh-pages 分支；
 * 自定义域 hallmark.ndjp.net 由 public/CNAME 声明，随构建产物一起上传。
 *
 * 日常更新其实不用这条命令：git push 到 main 就会自动构建部署。
 * `bun run deploy` 用于手动重跑（比如 Pages 出了状况）。
 *
 * 用法：bun run deploy
 */
import { execSync } from 'node:child_process'

const REPO = 'bbylw/hallmark-cn'
const run = (cmd) => execSync(cmd, { stdio: 'pipe' }).toString().trim()

console.log('触发 workflow…')
run(`gh workflow run deploy -R ${REPO}`)

// 等这条 run 出现
await new Promise((r) => setTimeout(r, 4000))
const getRun = () =>
  JSON.parse(
    run(
      `gh run list -R ${REPO} --workflow=deploy --limit 1 --json databaseId,status,conclusion`,
    ),
  )[0]

let cur = getRun()
while (cur.status === 'queued' || cur.status === 'in_progress') {
  console.log(`run #${cur.databaseId} ${cur.status}…`)
  await new Promise((r) => setTimeout(r, 10000))
  cur = getRun()
}

if (cur.conclusion === 'success') {
  console.log(`\n✓ run #${cur.databaseId} 部署成功`)
  console.log(
    run(
      `gh api repos/${REPO}/pages --jq "{url: .html_url, cname: .cname, status: .status}"`,
    ),
  )
} else {
  console.error(`\n✗ run #${cur.databaseId} 失败（${cur.conclusion}），日志：`)
  execSync(`gh run view ${cur.databaseId} --log-failed -R ${REPO}`, {
    stdio: 'inherit',
  })
  process.exit(1)
}
