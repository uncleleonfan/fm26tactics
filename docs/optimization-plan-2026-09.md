# FM26Tactics.com 优化实施计划 v2.1（2026-09）

> **版本**：v2.1 — v2 基础上新增 §2b 多语言策略评估（地理数据驱动），更新 N1/D2/N20
> **基线**：最新代码库复核（HEAD `05e2e9c`，2026-08-29）
> **依据**：`docs/analytics-report-2026-08.md`（P0/P1/P2 + §3.3 地理分布）+ `docs/events-analysis-report-2026-08.md`（E 系列）
> **工作量**：S ≤ 2h ｜ M = 半天~1 天 ｜ L = 2 天+

---

## 1. 复核结论：v1 计划执行情况

### ✅ 已完成（9 项，从计划移除）

| v1 任务 | 证据（最新代码） |
|---|---|
| T2 www 规范化（P0-1） | `metadata.ts`、`sitemap.ts:6`、`layout.tsx:62` 全为 www，全 src 无非 www 残留 |
| T4 埋点系统 | `src/lib/analytics.ts`（trackEvent/trackPageview）+ nav/builder/详情页全覆盖 + 导出停留时长 |
| T5 导出重做（E-1） | `tactic-export.tsx` 全新：SVG/PNG/txt/json 下载 + json 导入 + 完整战术卡（HOW TO REPLICATE）+ 按格式细分埋点 |
| T7 复制→Builder（E-5） | `tactic-detail-page.tsx:147-154` "Open in Tactic Builder" 按钮 + `tactic_open_builder` 埋点 |
| T14 分享闭环（E-4） | `copyShareLink`（`?tactic=` URL）+ `decodeTacticState` 自动载入 + 埋点 |
| T15 Meta 下载（E-6） | `meta-page.tsx` FM-Arena Patch 26.3 排名 + Download 按钮 + `meta_download` 埋点 |
| T19 草稿自动保存（E-9 一版） | `use-tactic-builder.ts:112-121` debounced localStorage |
| T11 内容补齐（P1-5 大部分） | ZAZ 4.5 重写、经理战术 8 篇（Arteta/Guardiola/Alonso/Mourinho/Simeone/Nagelsmann…）、wonderkids 4 篇、双阶段指南 |
| T9 title 优化（2/5 页） | how-to-load-tactics 新 title + 6 条 FAQ；/tactics unique metadata |

**部分完成**：T13 hreflang（页面级有了，但见新问题 N1）、T17 JSON-LD（首页 FAQPage + WebSite + blog Article/FAQ + tactics Article 都有了，缺 guides）、T6 nudge（有 export 提示条，无满员配置引导）。

### 数据窗口修正（影响优先级判断）

8 月事件报告中的 `builder_copy_share_link`(1)、`builder_export_close`(43)、细分 `builder_download` 等**均来自新导出面板**——即 **66 open → 20 download 的 70% 放弃率是新版数据**。SVG/PNG/txt/json 四种格式都给了仍放弃，说明：
- 剩余痛点更集中在 **没有 `.fmf` 游戏导入文件**（玩家"只是看看"没有下载动机）；
- 少数是静默失败 bug（见 N4）。
→ `.fmf` 调研（N15）优先级从"可选"上调。

---

## 2. 新发现的问题（v1 没有的）

### N1. canonical 与 hreflang 信号矛盾 【P0，方案随 §2b 更新为渐进式】

`src/app/[locale]/layout.tsx:102-110`：
```ts
alternates: {
  canonical: "https://www.fm26tactics.com",        // 所有语言页 canonical → 英文版
  languages: { en: "...", de: ".../de", it: ".../it", fr: ".../fr" },  // 却声明独立语言版本
}
```
事实核查：`content/` 只有一份英文 MDX，`messages/` 仅 4 个 UI 翻译文件——**/de /it /fr 页面 = 英文正文 + 当地语言 UI**，与 en 页重复度 95%+。canonical→en 是正确的防重复策略，但 `languages` 声明与之矛盾，向 Google 发送混乱信号（GSC 报告的首页"3 个标题版本"大概率就是 locale 变体被抓）。
**修复方向**：见 §2b 渐进式策略（L0：清信号 + 移除 it；D2 决策）。

### N2. JSON-LD SearchAction 指向 404 【新，S】

`layout.tsx:159` 的 `urlTemplate: ".../search?q={search_term_string}"` —— 项目没有 `/search` 路由（搜索是客户端对话框 `search-dialog.tsx`）。Google 抓取即 404。删除 SearchAction 或实装搜索页。

### N3. dual-phase 内容与功能脱节 【新，需决策】

提交记录：`bbda535` 添加双阶段 Builder 功能 → `05e2e9c`（HEAD）revert。但 `guides/dual-phase-tactics-fm26.mdx` 已发布。若指南中承诺了 Builder 支持"进攻/防守双阵型"，即为虚假承诺。见决策点 D3。

### N4. 导出面板三处静默失败（v1 T5 bug 仍在新代码中）

| 位置 | 问题 |
|---|---|
| `tactic-export.tsx:158` | SVG 导出：`buildSvgString` 返回 null 时静默 return（已发 `builder_download` 埋点但无下载发生，**同时污染数据**） |
| `tactic-export.tsx:167-190` | PNG 导出：无 `img.onerror`，跨域/字体问题会卡死无反馈 |
| `tactic-export.tsx:231,240` | `copyToClipboard`/`copyShareLink` 无 try-catch（战术详情页同类代码已修，这里没修） |

### N5. 分享链接载入无埋点（小）

`use-tactic-builder.ts:89-93` URL `?tactic=` 载入成功后无事件——分享闭环的实际效果（别人打开分享链接）无法度量。加 `builder_shared_load` 事件 + 成功 toast。

### N6. blog Article `dateModified` 未用 updatedAt（小）

`blog/[slug]/page.tsx:83`：`dateModified: post.publishedAt`，应同 sitemap 逻辑用 `updatedAt || publishedAt`。

---

## 2b. 多语言策略评估（v2.1 新增，地理数据驱动）

### 数据：GSC 前 10 国家 vs 当前 locales 配置

| 国家 | Clicks | CTR | 排名 | 语言 | 当前 `["en","de","it","fr"]` |
|---|---|---|---|---|---|
| UK | 113 | 5.61% | 9.3 | en | ✅ |
| **印尼** | 51 | 8.06% | 9.5 | id | ❌ 未配置 |
| **土耳其** | 43 | **8.70%（全场最高）** | **15.3（全场最差）** | tr | ❌ 未配置 |
| 德国 | 41 | 6.90% | 8.6 | de | ✅ |
| US | 38 | 3.06% | 8.6 | en | ✅ |
| **葡萄牙** | 29 | 6.44% | 8.4 | pt | ❌ 未配置 |
| 荷兰 | 28 | 4.73% | 7.4 | nl | ❌（英语普及率高，不做） |
| 法国 | 24 | 7.10% | 12.7 | fr | ✅ |
| 印度 | 20 | 5.56% | 24.5 | en | ✅ |
| 韩国 | 15 | 4.41% | 7.5 | ko | ❌（成本高，观察） |
| 意大利 | — | — | — | it | ⚠️ **不在 Top 10，零需求验证** |

### 三个结论

1. **现行配置与需求错配**：`it` 零流量验证；需求最强的 `tr`/`id`/`pt` 未配置。未配置语言合计 166 clicks ≈ 已配置语言（de 41 + fr 24 + it 0 = 65）的 **2.6 倍**。
2. **tr 是最佳本地化标的**：CTR 最高（需求饥渴）× 排名最差 15.3（土语 SERP 竞争小）= 本地化后双升空间最大；土耳其 FM 社区（FM Türkiye、taktik 工坊文化）活跃。
3. **正文英文是根本瓶颈**：locale 页仅 UI 翻译、41 篇 MDX 全英文。策略必须是"先清信号，再选择性真翻译"，而非加语言空壳。

### 策略：渐进式三层

| 层 | 内容 | 时机 | 工作量 |
|---|---|---|---|
| **L0 清信号** | ① 删 `languages` 声明（正文英文期无意义且与 canonical 矛盾）；② 移除 `it` locale（`routing.ts` + `next.config.mjs` 加 `/it/:path*` → `/:path*` 301，it 页零流量，成本≈0）；③ de/fr 保留 UI 壳但无 hreflang，canonical→en 维持；④ sitemap 不输出 locale URL（维持现状） | 并入 Batch 1（N1 更新） | S |
| **L1 tr 试点** | ① 架构：contentlayer 支持按 locale 的内容目录（`content/tr/tactics/*.mdx`），locale 路由只暴露**已翻译页面**（generateStaticParams 过滤），未翻译不生成 tr 路由——per-page hreflang 自然成立；② 翻译范围：首页 + /tactics + /best + /meta + Top 10 流量战术文 + Builder UI（`messages/tr.json`），机翻（DeepL）+ FM 术语人工审校；③ 上线后为 tr 页开启：canonical 自指 + en↔tr hreflang 互指 + x-default=en + sitemap alternates（仅已翻译 URL） | Batch 2（N20） | 架构 M + 翻译 M |
| **L2 数据触发扩展** | `pt-BR`（受众巴西 2.1 亿 ≫ 葡 1000 万）：触发条件 = tr 试点 4 周达标（见看板）或 pt 自然流量 > 40c/月。`id`/`ko`/`nl` 不做：id 用户英语容忍度高（英文页 CTR 已 8.06%）、ko 内容生产成本高、nl 英语普及率欧洲最高 | tr 复盘后 | 每语言 ~1 周 |

### 原则

- **翻译完成一个语言，开启一个语言的 hreflang**——杜绝"声明了独立版本但内容是英文"的矛盾信号再现；
- 每语言最小可索引集 = 首页 + 列表页 + Top 10 文章，不求全站；
- GSC 中 tr/id/kr/pt 历史流量来自英文页，翻译上线后为增量而非迁移。

---

## 3. 更新后的任务清单

### Batch 1：快修批（第 1 周，全部 S，无产品决策阻塞）

| # | 任务 | 改动 | 工作量 |
|---|---|---|---|
| N1 | 多语言信号清理（L0，见 §2b） | ① `layout.tsx` 删 `languages` 声明；② `routing.ts` 移除 `it` + `next.config.mjs` 加 `/it/:path*`→`/:path*` 301；③ canonical→en 维持；④ sitemap 维持不输出 locale URL | S |
| N2 | 移除 SearchAction | `layout.tsx:155-162` 删 potentialAction 块 | S |
| N3b | sitemap 时间戳（原 P0-4） | `sitemap.ts:47` roles 用固定日期；`:10-21` static 路由低频页改固定日期 | S |
| N4 | 导出面板静默失败修复 | 三处加错误提示 + 失败时不发 download 埋点（改为 `builder_download_fail`） | S |
| N5 | 分享载入埋点 | `builder_shared_load` + toast | S |
| N6 | blog dateModified | 一行改动 | S |
| N7 | GA4 Key events 标记（原 E-2） | 后台操作：`builder_download`、`tactic_copy_setup`、`meta_download`、`builder_apply_template`、`builder_copy_share_link`、`builder_shared_load` → Key event | 你操作 5 分钟 |

### Batch 2：转化与内容收尾（第 2-3 周）

> **状态（2026-08-29）**：N8 ✓（4 处 title 已重写）｜N9 ✓（Guide 类型 + faq 字段、Article 补 dateModified/image/keywords、FAQPage JSON-LD + 页面可见 FAQ 区块、10 篇指南全量 faq frontmatter）｜N10 ✓（因 Builder 阵型自动满员，触发信号改为"pristine 默认配置"（balanced + 零指令）时一次性引导，埋点 `builder_config_nudge_*`）｜N11 → **跳过**（FM-Arena 26.3.0 榜单前 100 无 CHM 系战术，按规则不补文）｜N12 → 观察（N1 部署后 4 周复查 GSC）｜N20 ✓（架构 + 8 篇 tr 战术 + `messages/tr.json` 213 键全量 + 首页//tactics//best//meta locale 感知 metadata（en↔tr hreflang + tr 自指 canonical）+ sitemap alternates，已本地验证）

| # | 任务 | 说明 | 工作量 |
|---|---|---|---|
| N8 | 剩余 3 页 title 重写（原 P0-2 余量） | best-set-piece（676i×3.4%）、match-day-shouts（523i×2.1%）、youth-development（311i×0.64%）+ roles 模板 title（~100i×0%） | M |
| N9 | guides 页 JSON-LD 补齐 | `guides/[slug]/page.tsx` 对齐 blog 的 Article/FAQPage（指南 MDX 多有 FAQ） | S~M |
| N10 | 满员配置引导（原 E-7） | Builder 11 人摆满后一次性气泡引导设置角色/心态（现有 nudge 只指向 Export） | M |
| N11 | CHM 战术评测（原 P1-5 余量） | 若 FM-Arena 榜单有 CHM 系战术则补文，否则跳过 | M |
| N12 | 重复内容复查（原 P0-3，降级） | locale 仅 4 种且内容为英文，GSC 中 tr/id/kr/pt 流量为历史索引，观察自然消退即可；部署 N1 后 4 周复查 GSC 覆盖率 | 观察 |
| **N20** | **土耳其语本地化试点（L1，见 §2b）** | ① contentlayer locale 内容目录架构（tr 路由只暴露已翻译页）；② 首页/列表页/Top 10 战术文 + Builder UI 翻译（机翻+术语审校）；③ tr 页自指 canonical + en↔tr hreflang + sitemap alternates | 架构 M + 翻译 M |

### Batch 3：增长与后续（第 2 月起，按数据排序）

| # | 任务 | 说明 | 工作量 |
|---|---|---|---|
| N13 | llms.txt + AI 结构（原 P2-11） | 根目录 llms.txt；新内容模板已含"结论前置+FAQ"，维持即可 | S |
| N14 | 首页首屏（原 P1-6，降级观察） | 新首页已把 QuickPicks 提至第二屏位 + 动态加载优化；先看 9 月新跳出率再决定是否重构 | 观察 |
| N15 | `.fmf` 导出调研（原 T5-L3，**上调**） | 数据修正后（见 §1）这是导出漏斗剩余流失的最大嫌疑。调研 SI 格式逆向/预打包模板库可行性，只调研不开发 | M 调研 |
| N16 | dual-phase 处置 | 按 D3 决策：恢复功能 or 内容去除 Builder 承诺 | 见 D3 |
| N17 | 桌面排名诊断（原 P1-9） | CrUX/PageSpeed 桌面指标体检，出结论再立项 | S 诊断 |
| N18 | 死入口复核（原 E-3，降级） | 搜索已有 `nav_search_open` 埋点，9 月数据出来再决定去留 | 观察 |
| N19 | 云端保存/账户（原 E-9 二期） | Q4 数据复盘后再议；若做接 Supabase | L，暂缓 |

### 明确不做（维持 v1）

- 账户体系、邮件订阅完整版（Q4 再议）
- `.fmf` 开发（仅 N15 调研）
- 美国市场专项（CTR 异常与数据中心 IP 相关，先观察）
- 印度市场（第二页排名，无近期价值）
- **id/ko/nl 本地化**（id 英语容忍度高、ko 成本高、nl 英语普及率高——见 §2b L2）
- pt-BR（暂缓至 tr 试点复盘，数据触发）

---

## 4. 决策点汇总（等你评估）

| # | 问题 | 选项 | 推荐 |
|---|---|---|---|
| D1 | GA4 后台操作（N7） | 你自己做 / 我出步骤清单 | 我出清单你点 5 分钟 |
| **D2** | **多语言策略（N1 + N20，详见 §2b）** | **A. 渐进式：L0 清信号（删 languages + 移除 it）→ L1 tr 试点 → L2 数据触发 pt-BR** ｜ B. 一步到位：de/fr/it 全量真翻译 + 完整 hreflang（L 工作量，含零验证的 it）｜ C. 纯收缩：删 languages 且永久不做内容翻译，聚焦英文 | **A**——地理数据证明 it 零验证、tr/id/pt 需求强（166c vs 65c），渐进式每步都有数据验收 |
| D2a | it locale 处置 | 移除 + 301 → en（推荐，零流量零成本）/ 保留 UI 壳观察 | 移除 |
| D2b | tr 试点启动时机 | Batch 2（9 月中，推荐）/ 等 9 月底全量数据再定 | Batch 2 |
| D3 | dual-phase 脱节（N16） | A. 恢复被 revert 的双阶段功能 ｜ B. 指南内容改为纯战术讲解（不提 Builder）｜ C. 保留描述但注明"coming soon" | B（除非 revert 只是有 bug，功能本身要保留——请告知 revert 原因） |
| D4 | Batch 顺序 | 按建议（快修批先行） / 只做 Batch 1 | 按建议 |
| D5 | 剩余 title 重写 | 我直接给 3 页新 title 草案再改 / 先出草案你确认 | 直接改（与 how-to-load 同风格） |

## 5. 9 月验收看板（更新）

| 指标 | 8 月基线 | 9 月目标 | 数据源 |
|---|---|---|---|
| 导出完成率（open→download） | 30%（新版面板） | ≥ 55% | GA4（N4 修复后数据更干净） |
| 月下载 | 20 | ≥ 50 | GA4 key event |
| `builder_shared_load`（分享被打开） | 无埋点 | ≥ 10 | GA4（N5 新增） |
| 全站 CTR | 5.57% | ≥ 6.5% | GSC |
| 3 个重写页合计 CTR | 2.3% | ≥ 8% | GSC |
| GSC 重复标题变体 | 3 组 | 归一 | GSC（N1 后 4 周复查） |
| 首页跳出率 | 74.2% | 观察新基线 | GA4 |
| **土耳其 clicks（N20 上线后 4 周）** | 43/月（英文页） | **≥ 80** | GSC 按国筛选 |
| **土耳其排名（N20 上线后 4 周）** | 15.3 | **≤ 10** | GSC 按国筛选 |
| tr 翻译页参与度 | — | 跳出率 ≤ 英文版 +10pp | GA4 |

## 6. 复盘机制（维持 v1）

- 每批部署后 7 天看对应指标；9 月底同口径拉 GA4+GSC 对表复盘
- Key events 就位后漏斗指标以 GA4 漏斗报告为准

---

*v2.1 更新：2026-08-29（新增 §2b 多语言策略评估，D2 改为渐进式方案）｜ 状态：Batch 1 ✓ + Batch 2 ✓（2026-08-29，N11 按规则跳过、N12 观察中）｜ Batch 3 待启动*
