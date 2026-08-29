# FM26Tactics.com 数据分析与优化建议报告

> **报告周期**：GA4 用户行为 2026-08-01 ~ 2026-08-28 ｜ GSC 搜索表现 近 3 个月（数据截至 2026-08-29）
> **数据来源**：Google Analytics 4（User behavior 导出）、Google Search Console（Performance on Search 导出）
> **站点**：fm26tactics.com（Next.js + Contentlayer，部署于 Vercel）

---

## 1. 执行摘要（TL;DR）

### 网站正处于强劲增长期

| 指标 | 数值 | 说明 |
|---|---|---|
| 活跃用户（28 天） | 1,223 | 其中新用户 1,204（98.4%） |
| 日搜索点击 | 1 → **68** | 8 月内增长 ~68 倍 |
| 日搜索曝光 | 21 → **1,019+** | 峰值 1,123（8/24） |
| 平均参与时间 | 89.9 秒 | 内容站健康水平 |
| 全站搜索 CTR | 5.57% | 708 clicks / 12,708 impressions（8 月 25 天合计） |
| AI 助手引流 | **128 活跃用户（10.5%）** | ChatGPT 单独占 9.8%，已是第 3 大流量来源 |

### 五个最需要优先解决的问题

1. **站内规范化信号与权威域不一致**：Vercel 已配置非 www → www 301，但 `sitemap` 与全站 `canonical` 仍指向非 www（经 301 跳转），GSC 中 www / 非 www 双版本数据并存、信号被稀释（详见发现 ②）。
2. **至少 6 组重复内容自竞争**：同一主题双版本文章互相分流，典型如 4-2-3-1 Gegenpress（588 views vs 10 views 两个版本）（发现 ③）。
3. **高曝光低点击（CTR）浪费**：仅 5 个页面/查询组的 CTR 缺口就相当于约 **+290 clicks/季** 的免费流量（见 P0-2）。
4. **首页跳出率 74.2%**：是全站内容页均值（约 15%）的 5 倍，首屏与搜索意图不匹配（发现 ④）。
5. **回访率仅 1.6%**：28 天 1,204 新用户只产生 240 回访人次，增长完全依赖拉新（发现 ⑤）。

### 三个最大的机会

1. **Tactic Builder 是核心资产**：963 views、跳出率 12.8%、GSC CTR 33%、排名 4-6 位，值得全站交叉引流放大。
2. **ZAZ 战术内容缺口**：ZAZ Autumn 系列查询合计 84+ 曝光仅换来 1 次点击，需求已验证、供给缺位。
3. **AI 流量红利**：ChatGPT/Copilot/Perplexity 合计 10.5%，结构化、机器可读的内容可进一步放大这一渠道。

---

## 2. 数据概览与趋势

### 2.1 GA4 汇总（2026-08-01 ~ 08-28）

| 指标 | 数值 |
|---|---|
| Active users | 1,223 |
| New users | 1,204（98.4%） |
| Returning 活跃用户（8 月前已访问） | 19（1.6%） |
| Average engagement time / active user | 89.9 秒 |
| Event count | 17,755 |

### 2.2 每日新增与回访（GA4 Nth day 采样，Day 00 = 8 月 1 日）

| Day | 新用户 | 回访人次 | Day | 新用户 | 回访人次 |
|---|---|---|---|---|---|
| 02 | 42 | 2 | 16 | 48 | 2 |
| 05 | 7 | 2 | 19 | 73 | 10 |
| 09 | 25 | 4 | 20 | 96 | 18 |
| 12 | 34 | 6 | 23 | 102 | 24 |
| 13 | 32 | 5 | 25 | 112 | 26 |
| 15 | 36 | 4 | 27 | 67 | 12 |

**解读**：新用户 4 周内从 ~40/天增长到 ~100+/天（约 2.5 倍）；回访人次从 0-2/天升至 20-27/天，说明二次访问习惯正在形成，但绝对比例仍很低（见发现 ⑤）。

### 2.3 GSC 日趋势（近 3 个月导出中的 8 月段）

| 日期 | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| 08-03 | 1 | 21 | 4.76% | 7.1 |
| 08-08 | 8 | 105 | 7.62% | 11.0 |
| 08-13 | 15 | 429 | 3.50% | 10.2 |
| 08-17 | 34 | 672 | 5.06% | 10.3 |
| 08-21 | **69** | 873 | **7.90%** | 10.8 |
| 08-24 | 61 | **1,123** | 5.43% | 9.5 |
| 08-26 | 68 | 1,019 | 6.67% | 10.2 |

**解读**：25 天累计 708 clicks / 12,708 impressions（CTR 5.57%），日均点击由月初个位数升至 60+。平均排名稳定在 9.5-11，说明增长主要来自**曝光量扩张**（收录与长尾覆盖），排名仍有整体上移空间。

> 注：GSC 导出范围虽为"近 3 个月"，但 Chart 数据实际从 08-02 才开始出现曝光，说明站点约在 8 月初才上线/获得收录，以上即全量数据。

---

## 3. 流量来源分析

### 3.1 渠道分布（First user source / medium，活跃用户）

| 排名 | 来源 / 媒介 | 活跃用户 | 占比 | 会话数 |
|---|---|---|---|---|
| 1 | google / organic | 652 | 53.3% | 925 |
| 2 | (direct) / (none) | 308 | 25.2% | 337 |
| 3 | **chatgpt.com / ai-assistant** | **120** | **9.8%** | 146 |
| 4 | bing / organic | 72 | 5.9% | 85 |
| 5 | community.sports-interactive.com / referral | 20 | 1.6% | 29 |
| 6 | duckduckgo / organic | 11 | 0.9% | 14 |
| 7 | copilot.com（ai-assistant + not set） | 6 | 0.5% | 18 |
| 8 | fmscout.com / referral | 3 | 0.2% | 4 |
| 8 | vercel.com / referral | 3 | 0.2% | 15 |
| 9 | perplexity.ai / ai-assistant | 2 | 0.2% | 6 |
| — | 其他（yahoo/ecosia 等） | 9 | 0.7% | 8 |

### 3.2 AI 流量专项（重点）

**AI 助手合计带来 128 活跃用户 / 174 会话，占全站约 10.5%，已超过 Bing，成为仅次于 Google 与 Direct 的第三大来源。**

| AI 来源 | 活跃用户 | 会话 |
|---|---|---|
| chatgpt.com | 120 | 150（含 4 次 not set） |
| copilot.com | 6 | 18 |
| perplexity.ai | 2 | 6 |

**含义与建议方向**（详见 P2-11）：

- FM 玩家大量向 AI 询问"best FM26 tactics"类问题，站内结构化内容（表格、FAQ、清晰的 H2/H3 层级）正在被 AI 引用并带量。
- 应当把 AI 视作一级渠道运营：保证每篇战术文有"一句话结论 + 关键参数表 + FAQ"，便于 LLM 抽取；可增加 `llms.txt` 与稳定的 AI 可读内容结构。
- SI 官方社区（community.sports-interactive.com，20 用户/29 会话）+ fmscout（3）说明社区背书已启动，可继续在相关板块做合规的内容分发。

### 3.3 地理分布（GSC 点击 Top 与 GA 城市交叉）

| 国家 | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| United Kingdom | 113 | 2,016 | 5.61% | 9.3 |
| Indonesia | 51 | 633 | 8.06% | 9.5 |
| Turkey | 43 | 494 | 8.70% | 15.3 |
| Germany | 41 | 594 | 6.90% | 8.6 |
| **United States** | 38 | **1,242** | **3.06%** ⚠️ | 8.6 |
| Portugal | 29 | 450 | 6.44% | 8.4 |
| Netherlands | 28 | 592 | 4.73% | 7.4 |
| France | 24 | 338 | 7.10% | 12.7 |
| India | 20 | 360 | 5.56% | **24.5** ⚠️ |
| South Korea | 15 | 340 | 4.41% | 7.5 |

- 美国曝光量第 2 大（1,242）但 CTR 仅 3.06%，显著低于全球均值 5.57%（发现 ⑨）。
- 印度平均排名 24.5，处于第二页，暂无点击效率可言。
- GA 城市榜中 Council Bluffs / Ashburn / Boardman（美国数据中心 IP 特征城市）合计 90 活跃用户，实际美国人类用户占比可能低于表观值。

---

## 4. 搜索表现分析

### 4.1 Top 查询（按点击）

| 查询 | Clicks | Impr. | CTR | Pos. |
|---|---|---|---|---|
| fm26 tactics | 58 | 474 | 12.24% | 13.7 |
| fm26 tactic builder | 54 | 138 | 39.13% | **4.1** |
| fm 26 tactics | 15 | 140 | 10.71% | 13.5 |
| fm26 tactics builder | 11 | 23 | 47.83% | 5.5 |
| fm tactic builder | 10 | 24 | 41.67% | 4.5 |
| fm26 best tactics | 9 | 80 | 11.25% | 13.8 |
| fm 26 tactic builder | 7 | 14 | 50.00% | 2.6 |
| fm26 formation builder | 7 | 12 | 58.33% | 3.4 |
| fm26 de zerbi tactics | 5 | 12 | 41.67% | 7.8 |

**解读**：`builder` 类查询占据 Top 10 中的 5 席、CTR 39-58%、排名 3-8——这是站点的搜索护城河。`fm26 tactics`（核心大词，474 曝光）排名 13.7，处在第二页边缘，是排名突破的首要目标。

### 4.2 高曝光零/低点击机会清单（内容与 CTR 缺口）

| 查询 / 查询组 | Impr. | Clicks | Pos. | 问题定性 |
|---|---|---|---|---|
| how to load/import/install tactics fm26（含 mac/folder/where to put 变体） | **~140** | 0 | 6-10 | CTR 缺口：排名好但标题不吸引 |
| zaz autumn 4.5 / zaz - autumn 3.39 st（ZAZ 系列合计） | **84** | 1 | 6.4-8.9 | 内容缺口：仅有 1 篇旧评测且表现差 |
| ball playing defender | 43（含 fm26 变体） | 0 | **6.2** | CTR 缺口：排名第一页却零点击 |
| fm26 box to box（midfielders/playmaker 变体） | ~43 | 1 | 6-9 | CTR 缺口 |
| fm26 shouts（guide/when to use 变体） | ~59 | 0 | 5-9 | CTR 缺口 |
| fm26 training schedule(s) | ~38 | 1 | 6-11 | CTR 缺口 |
| fm26 set piece tactics / best set piece | ~45 | 2 | 7.8-17.5 | CTR 缺口 |
| fm tactics（无 26） | 54 | 0 | 26.1 | 排名缺口 |
| best football manager tactics（无 26） | 31 | 0 | 27.8 | 排名缺口 |
| chm fm26（FM 名人战术） | 16 | 0 | 6.4 | 内容缺口 |

### 4.3 页面表现（合并 www / 非 www 双 URL 后的口径，标注 ✚）

| 页面 | Clicks | Impr. | CTR | Pos. |
|---|---|---|---|---|
| / （首页 www 168 + http 2） | 170 | 2,821 | 6.03% | 12.3 |
| /builder | 134 | 406 | **33.0%** | 6.6 |
| /tactics | 70 | 1,165 | 6.01% | 14.0 |
| /blog/player-roles-explained ✚ | 59 | 1,175 | 5.02% | 8.7 |
| /blog/gegenpress-setup-guide | 26 | 493 | 5.27% | 7.9 |
| /tactics/4-3-3-tiki-taka | 26 | 407 | 6.39% | 8.0 |
| /best | 24 | 341 | 7.04% | 14.3 |
| /guides/training-schedule-guide | 22 | 445 | 4.94% | 9.6 |
| **/blog/how-to-load-tactics-fm26 ✚** | 16 | **1,075** | **1.49%** ⚠️ | 8.1 |
| /blog/best-set-piece-tactics-fm26 ✚ | 23 | 676 | 3.40% | 8.9 |
| /blog/de-zerbi-tactics-fm26 ✚ | 20 | 157 | 12.7% | 7.6 |
| **/guides/match-day-shouts-guide ✚** | 11 | 523 | **2.10%** ⚠️ | **5.8** |
| /meta ✚ | 14 | 462 | 3.03% | 12.0 |
| /guides/fm26-tactics-beginner-guide | 9 | 181 | 4.42% | 10.4 |
| /roles ✚ | 11 | 402 | 2.74% | 14.7 |
| **/guides/youth-development-guide ✚** | 2 | 311 | **0.64%** ⚠️ | 8.7 |
| /roles/ball-playing-defender ✚ | 0 | 100 | **0%** ⚠️ | 6.2 |
| /guides ✚ | 11 | 178 | 6.18% | **39.6** ⚠️ |
| /tactics/4-2-3-1-gegenpress | 0 | 5 | 0% | 7.6 ⚠️ |

**CTR 缺口估算**（假设通过 title/meta 优化将 CTR 提升至同排名基准 10-15%）：

| 页面 | 现状 | 优化后预估 | 增量点击/季 |
|---|---|---|---|
| /blog/how-to-load-tactics-fm26 | 1,075i × 1.49% | 15% | **+145** |
| /blog/best-set-piece-tactics-fm26 | 676i × 3.40% | 10% | +45 |
| /guides/match-day-shouts-guide | 523i × 2.10% | 10% | +41 |
| /guides/youth-development-guide | 311i × 0.64% | 15% | +45 |
| /roles/ball-playing-defender 等 roles 页 | ~100i × 0% | 15% | +15 |
| **合计** | | | **约 +290/季（+23/月）** |

### 4.4 设备对比

| 设备 | Clicks | Impr. | CTR | Position |
|---|---|---|---|---|
| Desktop | 401 | 8,319 | 4.82% | **11.9** |
| Mobile | 301 | 4,343 | 6.93% | **8.2** |
| Tablet | 6 | 46 | 13.04% | 7.7 |

桌面端排名比移动端差 3.7 位、CTR 低 2.1 个百分点（发现 ⑧）。FM 是重桌面游戏，桌面搜索量占 2/3，这是最值得投入的排名缺口。

### 4.5 搜索外观（Search Appearance）

GSC 的 Search appearance 报告**为空**——站点当前没有任何富媒体摘要（Rich Result）曝光，结构化数据存在明显提升空间（P2-12）。

---

## 5. 九大关键发现

### ① 增长强劲，但完全由拉新驱动

28 天 1,223 活跃用户、日均搜索点击从 1 涨到 68，增长曲线健康。但 98.4% 为新用户，增长模型是"漏桶注水"——一旦 FM26 热度回落或竞品追赶，没有留存底盘承接。

### ② 站内规范化信号与实际权威域（www）不一致

- **已确认**：Vercel 已配置非 www → www 的 301 重定向，访问层不存在分裂。
- **仍存在的问题**：`src/app/sitemap.ts`（`const base = "https://fm26tactics.com"`）与全站 canonical（`src/lib/metadata.ts:33`、`src/app/[locale]/layout.tsx:103`、`src/app/[locale]/page.tsx:47`、`src/app/[locale]/blog/page.tsx:16`、`src/app/[locale]/best/page.tsx:17`、`src/app/[locale]/blog/[slug]/page.tsx:26`）**全部指向非 www**——这些 URL 全部需要经 301 跳转才能到达权威页。
- **数据证据**：GSC 中 www 与非 www 双版本 URL 并存（如 `/blog/how-to-load-tactics-fm26` www 版 647i + 非 www 版 428i；首页 www 2,743i + 非 www 10i + http 68i），同一页面的外链信号与抓取预算被拆分。Google 官方建议 sitemap 与 canonical 直接指向返回 200 的最终 URL。
- **次要问题**：`src/app/sitemap.ts:47` 中 roles 路由的 `lastModified: new Date(now)` 导致每次构建全部 roles URL 时间戳变化，sitemap 噪声大、抓取预算浪费。

### ③ 重复内容自竞争（至少 6 组）

| 主题 | 版本 A（views/跳出率） | 版本 B（views/跳出率） |
|---|---|---|
| 4-2-3-1 Gegenpress | "The Complete FM26 High-Pressure System"：588 / 14.3% | "The Modern High-Pressure Blueprint"：10 / 0% |
| Tactics Library | "Best FM26 Tactics & Formations"：514 / 11.3% | "Best Formations & Strategies"：151 / 4.2% |
| 首页 | "Best Football Manager 2026 Tactics"：187 / **74.2%** | "Best Tactics & Formations for FM 2026"：124 / 41.3%（第 3 版本 27 views） |
| How to Load Tactics | "Folder Location & Import"：29 / 20% | "Install, Import & Subscribe"：28 / **64.3%** |
| 4-3-3 Tiki-Taka | "Possession & Positional Play Guide"：325 / 16.2% | "Possession Domination"：20 / 0% |
| Meta Tactics | "What's Actually Good"：190 / 25.4% | "2,700+ Simulated Matches"：113 / 8.3% |

每组都在互相稀释排名与外链；"How to Load" 双版本还直接对应该站最大 CTR 缺口页（1,075i × 1.49%）。首页出现 3 个标题版本，疑似 `[locale]` 多语言路由与默认路由的 metadata 未统一，需要核对 `src/app/[locale]/page.tsx` 与根路由的 title 生成逻辑。

### ④ 首页跳出率 74.2%，与搜索意图错配

首页 GSC 排名 12.3、贡献 170 clicks，但落地后 74.2% 跳出（vs 内容页均值约 15%）。搜索"fm26 tactics"进首页的用户想立刻看到**战术列表**，而不是通篇介绍文字。这是转化漏斗的最大单一泄漏点。

### ⑤ 回访率仅 1.6%，无留存机制

28 天仅 240 回访人次（对 1,204 新用户）。GA4 中 Key events（转化事件）为空——站点没有定义任何转化目标（订阅、书签、Builder 保存等），也就没有留存抓手。

### ⑥ ZAZ 等社区明星战术存在内容缺口

- ZAZ Autumn 系列（4.5 / 3.39 ST）：84 曝光、排名 6.4-8.9，仅 1 点击。站内虽有 `ZAZ Autumn 4.5 FM26: The Complete Review & Setup Guide`（8 月仅 4 views），但标题/结构未承接该词族。
- "chm fm26"（FM 圈知名战术作者）：16 曝光、排名 6.4、零点击、站内无对应内容。
- "fm26 tactics tester"：有查询需求（含 100% CTR 的零星点击），站内无 tactic tester 工具页。

### ⑦ 多语言页面几乎零流量，且 sitemap 无 hreflang

GA 中土耳其语、韩语、葡萄牙语、德语、印尼语等页面普遍 0-8 views；而 GSC 国家数据显示土耳其 43 clicks、印尼 51 clicks——非英语用户主要在消费**英语页面**，翻译页未被有效索引。`src/app/sitemap.ts` 只输出默认语言 URL、无 `alternates.languages`，多语言版本缺少合法的发现路径（`src/lib/metadata.ts` 中也仅见 canonical、未见 hreflang 输出）。

### ⑧ 桌面排名显著弱于移动

Desktop 排名 11.9 / CTR 4.82%，Mobile 排名 8.2 / CTR 6.93%。FM 玩家以桌面为主（桌面曝光占 65%），却恰恰是排名较弱的一端，需要排查桌面端 Core Web Vitals、页面内容在桌面布局下的信息密度。

### ⑨ 美国市场 CTR 异常低

美国 1,242 曝光（全站第 2）但 CTR 仅 3.06%（全球均值 5.57%）。可能原因：美式表述差异（soccer/FM 在美认知度）、SERP 上被美区大站（fmscout 等）压制、标题缺少美式关键词。结合 GA 城市榜中数据中心 IP 占比，美国真实需求被高估，但 3% 的 CTR 仍有翻倍空间。

---

## 6. 优化建议清单（按优先级）

> 每条含：依据数据 → 具体操作 → 涉及文件。本报告仅提供建议，不改动代码。

### P0 速效（1-2 周内，纯技术/文案改动）

#### P0-1 统一规范化信号到 www 域

- **依据**：发现 ②，GSC 双版本 URL 拆分数据（how-to-load 647i+428i 等）。
- **操作**：
  1. `src/app/sitemap.ts:6` 的 `base` 改为 `https://www.fm26tactics.com`；
  2. 全站 canonical 统一改为 www：`src/lib/metadata.ts:33`、`src/app/[locale]/layout.tsx:103`、`src/app/[locale]/page.tsx:47`、`src/app/[locale]/blog/page.tsx:16`、`src/app/[locale]/best/page.tsx:17`、`src/app/[locale]/blog/[slug]/page.tsx:26`（以及 `src/lib/metadata.ts` 中 metadataBase）；
  3. GSC 中确认资源为 www 域名属性，对迁移后的重点 URL 用"网址检查"请求重新编入索引。
- **预期**：外链与抓取信号集中到单一版本，等效提升整站权重传递效率。

#### P0-2 重写 5 个高曝光低 CTR 页面的 title / description

- **依据**：4.3 节 CTR 缺口表，合计约 +290 clicks/季。
- **操作**（示例方向，保留关键词前置）：
  - `/blog/how-to-load-tactics-fm26`（1,075i × 1.49%，位 8.1）：title 改为问题式+平台词，如 `How to Install Tactics in FM26 — PC & Mac Step-by-Step (2026)`；正文补 Mac 小节承接 `how to import tactics fm26 mac`（11i/月）。
  - `/guides/match-day-shouts-guide`（523i × 2.10%，位 5.8）：位次优秀，title 直给答案：`FM26 Touchline Shouts: When to Use Each One (Cheat Sheet)`。
  - `/guides/youth-development-guide`（311i × 0.64%）：标题加入 "FM26 Youth Academy Guide — Develop Wonderkids"。
  - `/blog/best-set-piece-tactics-fm26`（676i × 3.40%）：加入数字承诺："Score 15+ Goals a Season: Best FM26 Set Piece Routines"。
  - `/roles/ball-playing-defender`（100i × 0%，位 6.2）及 roles 模板：role 页 title 模板改为 "Ball-Playing Defender FM26: Best Attributes, Duties & Formations"。
- **涉及文件**：对应 `content/` 下 MDX frontmatter 的 title/description，或各路由 `page.tsx` 的 generateMetadata。

#### P0-3 合并 6 组重复内容

- **依据**：发现 ③。
- **操作**：弱版本 301（或 canonical）指向强版本，并更新站内链接：
  - Gegenpress：10 views 版 → 588 views 版；How to Load：64.3% 跳出版 → 20% 版；Tiki-Taka、Meta Tactics、Tactics Library 同理；
  - 排查首页 3 个标题版本的来源（`src/app/[locale]/page.tsx` 与根 `src/app/page.tsx` 的 title 生成），确保每个路由只产出一个规范标题。
- **预期**：消除关键词蚕食（keyword cannibalization），集中权重后核心词排名上移。

#### P0-4 修复 sitemap 时间戳与收录质量

- **依据**：发现 ② 次要问题（roles `lastModified: new Date(now)`）。
- **操作**：`src/app/sitemap.ts:45-50` roles 路由改用固定更新日期或数据源真实时间；tactics/guides/blog 路由保持现有 `updatedAt || publishedAt` 逻辑不变。
- **预期**：降低 sitemap 噪声，抓取预算集中于真实更新的页面。

### P1 中期（2-6 周，内容与产品）

#### P1-5 补齐 ZAZ / CHM 等明星战术内容

- **依据**：发现 ⑥（ZAZ 84i 仅 1c；chm 16i 0c）。
- **操作**：重写 `ZAZ Autumn 4.5` 评测（标题含 "ZAZ Autumn 4.5 FM26: Setup, Results & Download Guide"），新增 `ZAZ Autumn 3.39 ST` 与 CHM 战术深度评测；结构复用现有 tactic MDX 模板（`content/tactics/`）。
- **预期**：直接承接已验证需求，预计 +30~60 clicks/月。

#### P1-6 首页首屏改造

- **依据**：发现 ④（跳出率 74.2%）。
- **操作**：首屏直接呈现 "Top 8 Meta Tactics 卡片 + Builder CTA"，弱化介绍文案；标题与 H1 对齐 "fm26 tactics" 搜索意图（最佳战术列表）。
- **涉及文件**：`src/app/[locale]/page.tsx` 与 `src/components/` 首页区块组件。

#### P1-7 Builder 全站交叉引流

- **依据**：Builder 是明星页（963 views / 跳出 12.8% / CTR 33% / 位 4-6）。
- **操作**：每篇战术详情页（`src/app/[locale]/tactics/[slug]` 或对应组件）加 "Open this tactic in Builder" 按钮，预填阵型参数；邮件/社区分享也以 Builder 链接为钩子。

#### P1-8 多语言 hreflang 与 sitemap alternates

- **依据**：发现 ⑦。
- **操作**：`src/app/sitemap.ts` 为多语言路由输出 `alternates: { languages: {...} }`；`src/lib/metadata.ts` 的 metadata 中补充 `alternates.languages`（next-intl 路由的 locale 变体）；对土耳其语/韩语/葡萄牙语等已翻译页确保 x-default 指向英语版。
- **预期**：翻译页获得索引资格，承接土/韩/葡市场已验证的搜索需求。

#### P1-9 桌面端排名专项

- **依据**：发现 ⑧（Desktop 位 11.9 vs Mobile 8.2）。
- **操作**：用 PageSpeed Insights / CrUX 检查桌面 LCP/INP；检查桌面布局下首屏信息密度与广告/图片阻塞；战术文章内增加表格类内容（桌面 SERP 特征更吃 rich table）。

### P2 长期（1-3 个月，增长与留存）

#### P2-10 建立留存机制与转化事件

- **依据**：发现 ⑤（回访率 1.6%、Key events 为空）。
- **操作**：GA4 中定义 Key events（Builder 导出、战术收藏、订阅）；上线"每周元分析/新战术"邮件订阅或 RSS 引导；Meta 页每周更新形成回访理由。目标：回访率 1.6% → 8%。

#### P2-11 AI 可见性专项（llms.txt + 结构化抽取）

- **依据**：3.2 节（AI 助手 10.5%，第 3 大渠道）。
- **操作**：根目录增加 `llms.txt`（站点地图式的内容指引）；每篇战术文固定"一句话结论 + 关键参数表 + FAQ"结构，便于 LLM 引用；持续监控 GA4 中 ai-assistant 来源变化。

#### P2-12 结构化数据与富媒体摘要

- **依据**：4.5 节（Search appearance 完全为空）。
- **操作**：为战术/角色/指南页添加 JSON-LD：`Article` + `HowTo`（load/import 类教程）+ `FAQPage`（每篇 3-5 问）+ `BreadcrumbList`；用 Rich Results Test 验证。

#### P2-13 美国市场内容与文案

- **依据**：发现 ⑨（美国 1,242i × 3.06%）。
- **操作**：标题测试美式关键词（"soccer manager"类目除外，FM 场景仍以 FM 为主）；增加 MLS/美国国家队主题战术内容；观察 CTR 是否向 5%+ 回归。

#### P2-14 第二页关键词突破

- **依据**：`fm26 tactics`（474i × 12.24%，位 13.7）、`fm tactics`（54i，位 26.1）、印度市场（位 24.5）。
- **操作**：以 P0-3 合并后的权重集中 + 内链（首页/Best 页指向战术详情）推动 `fm26 tactics` 进入前 10；`fm tactics` 这类无版本号老词由域名权威自然承接，无需专门内容。

---

## 7. 附录：数据口径说明

| 项目 | 口径 |
|---|---|
| GA4 周期 | 2026-08-01 ~ 2026-08-28（导出文件标注） |
| GSC 周期 | Last 3 months，Search type = Web（Filters.csv） |
| 合并 URL 口径（✚） | 同一路径的 www / 非 www / http 版本 clicks 与 impressions 直接相加，CTR 按合并后重算，Position 取按曝光加权近似 |
| CTR 缺口估算 | 优化后 CTR 取同排名段（5-10 位）页面基准值 10-15%，为方向性估算而非承诺 |
| 回访率 | GA4 Nth day 表 returning 人次合计 240 ÷ New users 1,204 ≈ 19.9%（人次口径）；1.6% 为"当月活跃中非新用户"口径（19/1,223） |
| AI 流量占比 | chatgpt(120) + copilot(6) + perplexity(2) = 128 ÷ 1,223 ≈ 10.5% |

### 原始数据摘录

**GSC Top pages（未合并版本，节选）**

```
https://www.fm26tactics.com/,168,2743,6.12%,12.34
https://www.fm26tactics.com/builder,134,406,33%,6.59
https://www.fm26tactics.com/tactics,70,1165,6.01%,14.02
https://www.fm26tactics.com/blog/how-to-load-tactics-fm26,11,647,1.7%,8.44
https://fm26tactics.com/blog/how-to-load-tactics-fm26,5,428,1.17%,7.71
```

**GA4 页面表现（节选）**

```
FM26 Tactic Builder — Create Custom Formations & Export,963,295,6031,0.128
FM26 Tactics — Best Football Manager 2026 Tactics & Formations,187,88,452,0.742
How to Load Tactics in FM26: Install, Import & Subscribe Guide,28,25,93,0.643
```

---

*报告生成：2026-08-29 ｜ 数据快照：GA4 2026-08-28 / GSC 2026-08-29*

