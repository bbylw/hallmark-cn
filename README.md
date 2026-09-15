# Hallmark

**一个专为 Claude Code、Cursor 和 Codex 打造的设计 skill，拒绝生成看起来像 AI 产物的界面。**

[在线演示 →](https://www.usehallmark.com) &nbsp;·&nbsp; 二十一种主题 &nbsp;·&nbsp; 四个动词 &nbsp;·&nbsp; 按 `T` 键切换。

由 Together AI 打造。

<p align="center">
  <img src="https://raw.githubusercontent.com/Nutlope/hallmark/main/site/OG-hallmark.png" alt="Hallmark，一个拒绝看起来像 AI 产物的设计 skill" />
</p>

Hallmark 会为需求（brief）挑选一个宏观结构（macrostructure），套上二十一种主题中的一种，运行五十八道 slop-test 检验关卡，再加一次发布前的自我批判，并拒绝每个 LLM 都被训练出的「分布内」默认套路。同一个 Hallmark 为两个不同需求生成的两页，看起来像两个完全不同的站点，而不是同一套模板换了个配色。

---

## 四个动词

| 动词 | 作用 |
| --- | --- |
| *(默认)* | 构建全新 UI。挑选宏观结构、套用规则集，在交付前跑一遍 slop 测试。 |
| `hallmark audit <target>` | 对照反模式（anti-patterns）给现有代码打分。只出整改清单，不做修改。 |
| `hallmark redesign <target>` | 推翻原有结构，保留文案 + 信息架构（IA）+ 品牌，用另一种「指纹」重建。 |
| `hallmark study <screenshot \| URL>` | 从你欣赏的设计中提取「DNA」：宏观结构、字体搭配、色彩锚点。拒绝像素级克隆和付费模板。可选地输出一份可移植的 `design.md`，交给其他 AI 工具接力。 |

---

## 不同需求，不同形态

每一页都源自不同的需求。该 skill 会为每个需求挑选契合的主题、结构与工艺，而不是套模板。

<table>
  <tr>
    <td width="25%"><a href="https://www.usehallmark.com/examples/hum-07/"><img src="https://raw.githubusercontent.com/Nutlope/hallmark/main/docs/screenshots/hero-hum-07.jpg" alt="Bubble 引导式酸面团 App 首页" /></a></td>
    <td width="25%"><a href="https://www.usehallmark.com/examples/cobalt-01/"><img src="https://raw.githubusercontent.com/Nutlope/hallmark/main/docs/screenshots/hero-cobalt-01.jpg" alt="Distil 内容提取 API 首页" /></a></td>
    <td width="25%"><a href="https://www.usehallmark.com/examples/carnival-01/"><img src="https://raw.githubusercontent.com/Nutlope/hallmark/main/docs/screenshots/hero-carnival-01.jpg" alt="Cold Snap 唱片厂牌 EP 首页" /></a></td>
    <td width="25%"><a href="https://www.usehallmark.com/examples/lumen-01/"><img src="https://raw.githubusercontent.com/Nutlope/hallmark/main/docs/screenshots/hero-lumen-01.jpg" alt="Cinder AI 推理工具首页" /></a></td>
  </tr>
  <tr>
    <td><b>Bubble</b><br/><sub>酸面团 App · Hum</sub></td>
    <td><b>Distil</b><br/><sub>内容提取 API · Cobalt</sub></td>
    <td><b>Cold Snap</b><br/><sub>唱片厂牌 · Carnival</sub></td>
    <td><b>Cinder</b><br/><sub>AI 工具 · Lumen</sub></td>
  </tr>
  <tr>
    <td><a href="https://www.usehallmark.com/examples/custom-03/"><img src="https://raw.githubusercontent.com/Nutlope/hallmark/main/docs/screenshots/hero-custom-03.jpg" alt="Ferns and Fathom 茶饮菜单首页" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/garden-01/"><img src="https://raw.githubusercontent.com/Nutlope/hallmark/main/docs/screenshots/hero-garden-01.jpg" alt="Hollowback Apiary 蜂蜜农场首页" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/riso-01/"><img src="https://raw.githubusercontent.com/Nutlope/hallmark/main/docs/screenshots/hero-riso-01.jpg" alt="Off-Register 孔版印刷展首页" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/press-01/"><img src="https://raw.githubusercontent.com/Nutlope/hallmark/main/docs/screenshots/hero-press-01.jpg" alt="Press Quaternary 字体工作室首页" /></a></td>
  </tr>
  <tr>
    <td><b>Ferns &amp; Fathom</b><br/><sub>茶饮菜单 · Custom</sub></td>
    <td><b>Hollowback Apiary</b><br/><sub>蜂蜜农场 · Garden</sub></td>
    <td><b>Off-Register</b><br/><sub>印刷展 · Riso</sub></td>
    <td><b>Press Quaternary</b><br/><sub>字体工作室 · Custom</sub></td>
  </tr>
  <tr>
    <td><a href="https://www.usehallmark.com/examples/tally/"><img src="https://raw.githubusercontent.com/Nutlope/hallmark/main/docs/screenshots/hero-tally.jpg" alt="Tally SaaS 产品页首页" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/wayfare/"><img src="https://raw.githubusercontent.com/Nutlope/hallmark/main/docs/screenshots/hero-wayfare.jpg" alt="Wayfare 旅行预订首页" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/najm/"><img src="https://raw.githubusercontent.com/Nutlope/hallmark/main/docs/screenshots/hero-najm.jpg" alt="NAJM 摩洛哥时尚品牌首页" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/hyperlane/"><img src="https://raw.githubusercontent.com/Nutlope/hallmark/main/docs/screenshots/hero-hyperlane.jpg" alt="Hyperlane 开发者基础设施首页" /></a></td>
  </tr>
  <tr>
    <td><b>Tally</b><br/><sub>SaaS · 现代极简</sub></td>
    <td><b>Wayfare</b><br/><sub>旅行 · 氛围感</sub></td>
    <td><b>NAJM</b><br/><sub>时尚品牌</sub></td>
    <td><b>Hyperlane</b><br/><sub>开发者基础设施</sub></td>
  </tr>
</table>

每一页都是自包含的 HTML + CSS，并在 CSS 注释里标注了自己的宏观结构。完整集合可在 [usehallmark.com](https://www.usehallmark.com) 或 [`site/_tests/`](https://github.com/Nutlope/hallmark/tree/main/site/_tests/) 目录下浏览。

---

## Custom（自定义） <sup>NEW</sup>

当某个需求带有现有目录主题都无法匹配的创意意图时，Hallmark 会切换到 **Custom**，从零设计页面：量身定制的调色板、字体与版式。同样经过 58 道 slop-test 关卡，底下没有任何模板。

<table>
  <tr>
    <td width="50%"><a href="https://www.usehallmark.com/examples/custom-02/"><img src="https://raw.githubusercontent.com/Nutlope/hallmark/main/docs/screenshots/hero-custom-02.jpg" alt="The Cascadia Nightjar 卧铺火车票首页" /></a></td>
    <td width="50%"><a href="https://www.usehallmark.com/examples/custom-04/"><img src="https://raw.githubusercontent.com/Nutlope/hallmark/main/docs/screenshots/hero-custom-04.jpg" alt="The Mend Assembly 修理咖啡馆大报首页" /></a></td>
  </tr>
  <tr>
    <td><b>The Cascadia Nightjar</b><br/><sub>卧铺火车票 · Custom</sub></td>
    <td><b>The Mend Assembly</b><br/><sub>修理咖啡馆大报 · Custom</sub></td>
  </tr>
</table>

它是一条低调的分支；常规需求永远不会触发它。相关协议见 [`custom-theme.md`](https://github.com/Nutlope/hallmark/blob/main/skills/hallmark/references/custom-theme.md)。

---

## 安装

```
npx skills add nutlope/hallmark
```

随时可重新运行以更新。或者把 [`SKILL.md`](https://github.com/Nutlope/hallmark/blob/main/skills/hallmark/SKILL.md) + [`references/`](https://github.com/Nutlope/hallmark/tree/main/skills/hallmark/references/) 复制到：

- **Claude Code**：`~/.claude/skills/hallmark/`
- **Cursor**：`.cursor/rules/hallmark.mdc`（`SKILL.md` 的正文部分，去掉 frontmatter）
- **Codex**：`~/.codex/skills/hallmark/`（个人）或 `.codex/skills/hallmark/`（项目级）

规则集位于 [`SKILL.md`](https://github.com/Nutlope/hallmark/blob/main/skills/hallmark/SKILL.md) 与 [`references/`](https://github.com/Nutlope/hallmark/tree/main/skills/hallmark/references/)。实战示例见 [`docs/recipes.md`](https://github.com/Nutlope/hallmark/blob/main/docs/recipes.md) 与 [`docs/study-examples.md`](https://github.com/Nutlope/hallmark/blob/main/docs/study-examples.md)。

---

## 许可协议

MIT。随意使用、fork、发布。
