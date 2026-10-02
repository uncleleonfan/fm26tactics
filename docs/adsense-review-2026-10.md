# AdSense 二次拒批与经理系列合并记录（2026-10）

> 拒批类型：**Low value content**（第二次）
> 上次拒批：2026-09-07，诊断与整改见 `docs/adsense-review-2026-09.md`
> 执行范围：内容架构合并（12 → 6 URL）+ 5 篇内容重写 + 8 条 301 + 1 处结构化数据合规修复

## 1. 与首次拒批的区别

9 月那次是**技术性**拒批：4 个 locale 的重复价值页 + 首页 `ssr: false` 抓取为空壳。这两项已在 9-04 / 9-07 修掉，GSC「重复网页」类目也已归零。

这一次技术面已无可整改项——首页 SSR 完整、locale 单跳 301、隐私政策含广告条款、`ads.txt` 与验证 meta 就位。问题回到**内容层**：站点内容的"模板化指纹"。

## 2. 诊断（代码与内容实证，非推测）

| 证据 | 实测数据 |
|---|---|
| 经理文发布时间 | 11 篇全部落在 **2026-08-20 ~ 08-23（4 天内）** |
| H2 骨架 | 11 篇共用逐字相同的骨架：`Philosophy → Formation → Team Instructions → Key Player Requirements → Common Mistakes → When X Struggles → Final Word → More Manager Tactics` |
| 字数分布 | 1,036 ~ 1,416 词，全部挤在同一窄带（均值 1,294） |
| 内容矛盾 | 每篇的战术板数组与正文表格互相不符（例：Flick 数组为 `deep-lying-playmaker(D) + box-to-box-midfielder(S)`，正文表格写 `DM(D) + DLP(S)`；Alonso 数组用普通中卫，表格写 BPD） |
| 重复度 | Nagelsmann 与 Flick 两篇的 11 人战术板数组**完全相同** |
| 需求验证 | 8 月 GSC 页面榜中，经理系列唯一进榜的是 `de-zerbi`（20 clicks / 157 impr / 12.7% CTR）；查询榜 `fm26 de zerbi tactics` 5 clicks / 41.67% CTR / 位 7.8 |

判定：**"4 天发 12 篇同骨架同长度"是 scaled content abuse 最好识别的指纹**，AdSense 审核抽样必然命中。站龄（7 月上线）与流量规模是固有减分项，无法用代码绕过，只能靠时间与持续更新摊平。

## 3. 执行内容

### 3.1 架构：经理系列 12 → 6 URL

| URL | 性质 | 来源 | 字数 |
|---|---|---|---|
| `/blog/de-zerbi-tactics-fm26` | 旗舰（保留 slug） | 原篇重写 | 2,906 |
| `/blog/guardiola-tactics-fm26` | 旗舰（保留 slug） | 原篇重写 | 2,950 |
| `/blog/klopp-tactics-fm26` | 旗舰（保留 slug） | 原篇重写 | 2,610 |
| `/blog/fm26-positional-control-managers` | 新建：控球/位置学派对照 | 合并 Arteta + Alonso + Nagelsmann + Emery + Flick | 3,148 |
| `/blog/fm26-low-block-counter-managers` | 新建：低位/防反学派对照 | 合并 Mourinho + Simeone + Ancelotti | 2,902 |
| `/blog/fm26-best-teams-for-coach-tactics` | 保留：选队 hub（重构） | 原篇重写 | 1,434 |

**保留 URL 的取舍依据**：`de-zerbi` 是唯一有实证需求的页面；`guardiola` / `klopp` 分别是控球簇与压迫簇的锚点（下游 `/tactics/4-3-3-tiki-taka` 26 clicks、`/blog/gegenpress-setup-guide` 26 clicks）。其余 8 篇零可见流量，合并成本最低。

### 3.2 删除与 301（`next.config.mjs`）

8 个 URL 删除，全部 308 单跳（无重定向链）：

```
/blog/arteta-tactics-fm26           → /blog/fm26-positional-control-managers
/blog/alonso-tactics-fm26           → /blog/fm26-positional-control-managers
/blog/nagelsmann-tactics-fm26       → /blog/fm26-positional-control-managers
/blog/emery-tactics-fm26            → /blog/fm26-positional-control-managers
/blog/flick-barcelona-tactics-fm26  → /blog/fm26-positional-control-managers
/blog/mourinho-tactics-fm26         → /blog/fm26-low-block-counter-managers
/blog/simeone-tactics-fm26          → /blog/fm26-low-block-counter-managers
/blog/ancelotti-tactics-fm26        → /blog/fm26-low-block-counter-managers
```

删除前已核查：指向这 8 个 URL 的站内链**仅存在于被删文件彼此之间**，无外部断链（`/tactics` 页引用的 `de-zerbi` 属保留项）。

### 3.3 去模板化的具体手法

反模板化不是改修辞，而是改变文章的组织方式：

- **对照长文按"决策"组织，不按"人物"组织**：开篇给选择器，中段给横向对比矩阵（出球结构 / 压迫触发 / 宽度来源 / 边后卫职责 / 风险 / 需求），每个体系只写"与其他体系的差异点"，通用教学不重复。
- **每篇旗舰的骨架互不相同**：De Zerbi 文按"读者会撞上的问题"组织；Guardiola 文按结构职责与验收标准组织；Klopp 文按压迫触发器与比赛状态管理组织。
- **指令呈现方式刻意打散**：一篇用清单、一篇用表格、一篇用正文论证、一篇用要点，避免"每节三张表"的机械感。
- **删除全站统一的收尾模板**：`More Manager Tactics in FM26` 三连互链块全部移除，改为语境化的延伸阅读。

### 3.4 一并修复的问题

| 问题 | 处理 |
|---|---|
| 编造的测试数据 | De Zerbi 原篇 `Results You Can Expect`（"Possession 58-65%"、"xG 1.8-2.3"、"~70% goals from open play"）为纯虚构，**整段删除且不做数字替换**——虚构数据正是本次拒批要规避的类型 |
| 战术板与正文矛盾 | 5 篇新稿的 `TacticBoardCta` 数组与正文表格**逐项一致**；角色全部使用 FM26 真实角色（逐个校验 `availableDuties`） |
| 结构化数据无可见内容 | 博客页一直输出 `FAQPage` JSON-LD，但 `BlogDetail` 未渲染可见 FAQ（指南页有）→ 已补可见 FAQ 区块（`blog-detail.tsx`）+ `messages/en.json` 的 `blog.faqTitle`。**此修复覆盖所有带 faq 的博客页** |

### 3.5 新增的独立价值章节（原独立页没有的内容）

- 控球对照文：`对手匹配` 表（对高压 / 对低位 / 对长传 / 对控球强队分别该用五套里的哪套，以及两个具体陷阱）
- 防反对照文：`如何打赢这三种体系`（分别给出破 5-4-1、破侵略性 4-4-2、破中场块的打法）+ `首个赛季的预期曲线`
- Guardiola 文：`两场比赛判断体系是否成立` + `本体系不是什么的三种界线`（tiki-taka / De Zerbi / 压迫系）
- Klopp 文：`在比赛中读取压迫是否成立`（四个观察信号）+ `比分状态下的关闭时机`

## 4. 量化对比

| 指标 | 改前 | 改后 |
|---|---|---|
| 博客总篇数 | 25 | 17 |
| 经理簇 URL 数 | 12 | 6 |
| 共用同一 H2 骨架的文章 | 11 | 0 |
| 经理簇平均字数 | 1,294 | 2,903 |
| 含编造测试数据的文章 | 1 | 0 |
| 战术板与正文不符的文章 | 11 | 0 |

## 5. 验证记录（全部实测）

| 检查 | 结果 |
|---|---|
| `npx contentlayer build` | Generated 46 documents，0 报错 |
| `npx next build` | 67 pages，exit 0 |
| 6 个存活 URL | 全部 200 |
| 8 个旧 URL | 全部 308，Location 指向正确 hub（单跳） |
| 8 个战术板 param 解码 | 角色/职责全部合法，且与正文表格逐项一致 |
| 博客 FAQ | 可见区块与 `FAQPage` JSON-LD 同时在页 |
| `/blog` 列表 | 17 篇（原 25 篇） |

### 踩坑记录（后续新增 mdx 需注意）

`write_to_file` 生成的两个新文件为 **CRLF** 行尾，而既有内容文件均为 LF。`gray-matter` 在 CRLF 下提取 frontmatter 会多带 `\r`，导致 `yaml` 解析在 frontmatter 最后一行报 `Unexpected scalar at node end`，该文档静默不生成（构建仍显示成功，只有 contentlayer 的 "Found N problems" 提示）。**新增内容文件后必须确认行尾为 LF**。

## 6. 待办

1. **部署**本批次（含 8 条 301）。
2. **GSC 请求编入索引**：优先 5 个存活 URL（`/blog/fm26-positional-control-managers`、`/blog/fm26-low-block-counter-managers`、3 篇旗舰）。
3. **观察 8 个旧 URL 的 301 收敛**：GSC → 页面索引 → "Page with redirect"，确认爬虫已在重抓。
4. **等待期 ≥3~4 周**，期间保持每周 1~2 篇新增内容（新 URL 从零开始，需要被爬取与索引）。
5. **重提 AdSense**：待索引量企稳后再提，避免短期内反复提交。
6. **第二阶段（本批未动，先记账）**：
   - 19 篇战术页存在明显的厚薄落差（4 篇 4,600~5,700 词的厚页 vs 9 篇 970~1,380 词的薄页），同簇内落差本身就是质量信号；
   - wonderkids 三篇（by-role / by-formation / 4-2-3-1）角度重叠，评估合并或差异化。

## 7. 风险与说明

- **合并会损失 8 个 URL 的历史权重**，但它们本就零可见流量；301 用于信号合并而非丢弃，符合 Google 的页面整合建议。
- **新 URL 从零开始**，预期 2~4 周进入索引；短期总曝光可能持平或略降，属预期。
- **无编造数据**：本轮新增的所有机制描述均可从游戏内角色语义（本站 FM26 角色库）与指令语义核验；未使用任何测试统计数字。
- **作者署名未改**：全站仍为 `FM26 Tactics Team`。E-E-A-T 层面建议后续上至少一个具名作者与简介页，本批未处理。
