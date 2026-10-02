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

## 8. Adsterra 过渡期方案（2026-10-02 决定）

**决定**：在等待 AdSense 重提窗口（3~4 周）期间接入 Adsterra 变现。AdSense 没有条款禁止同一站点运行其他广告网络，但 Google 把**整个页面**视为一体——AdSense 广告不能与违规的第三方创意同页。因此本方案的约束全部落在"只投最低风险的格式"上。

### 8.1 工程层已强制的约束

| 约束 | 实现方式 |
|---|---|
| 只允许静态 banner | `AdsterraSlot` 的类型只接受静态尺寸（468×60 / 320×100 / 300×250 / 336×280 / 160×600）。**Popunder / Social Bar / In-page push / Direct link / Interstitial 在类型层面不存在**，不可能被误用 |
| 每篇一个广告位 | 三个内容模板各渲染一对响应式尺寸（同一时刻只有一个可见），位置在**正文与 FAQ 之后、相关阅读之前**，永不落在首屏 |
| 不制造横向溢出 | 博客正文容器 `max-w-3xl` 内宽约 720px，**728×90 在任何视口下都放不进博客**，因此博客用 468×60；≥md 才显示 |
| 不浪费请求 | 进入视口前 200px 才注入脚本；隐藏的响应式变体是 `display:none`，永远不会触发 IntersectionObserver |
| 不产生 CLS | 服务端渲染即预留广告盒高度 |
| 默认零影响 | 未配置 key 时组件返回 `null`，站点与改前完全一致 |

### 8.2 配置与开关

真实的 key / host 已按项目既有风格（同 `adsense-script.tsx` 的 `PUBLISHER_ID`）**写入组件常量**，默认即生效。

| 项 | 值 | 取值来源 |
|---|---|---|
| 固定 banner host | `www.highrevenueformat.com` | 160×600 代码的 `invoke.js` 域名 |
| 固定 banner key | `0a10f1179828aa089fc729009bdc247d` | 160×600 代码的 `atOptions.key` |
| Native host | `pl30662924.profitableratecpmnetwork.com` | Native 代码的 `script src` 域名 |
| Native key | `caffcdba1878c0c7c8b337c8016e362e` | `invoke.js` 路径段，同时构成 `container-<key>` 的 id |

环境变量用于覆盖（Vercel → Settings → Environment Variables，改完需重新部署，`NEXT_PUBLIC_*` 在构建期内联）：

```
NEXT_PUBLIC_ADSTERRA_ENABLED      = false   # 总开关，关掉全部 Adsterra 位
NEXT_PUBLIC_ADSTERRA_KEY_160X600  = <key>   # 设为空字符串即单独关闭该尺寸
NEXT_PUBLIC_ADSTERRA_HOST         = <host>
NEXT_PUBLIC_ADSTERRA_NATIVE_HOST  = <host>
NEXT_PUBLIC_ADSTERRA_NATIVE_KEY   = <key>
```

实现细节：这些变量用 `??` 而非 `||` 读取，因此**把变量设为空字符串可以单独关闭该尺寸**；总开关为 `NEXT_PUBLIC_ADSTERRA_ENABLED=false`。

组件尺寸表已对齐 Adsterra 后台实际提供的选项：`468x60` / `320x50` / `300x250` / `160x300` / `160x600`（后台**不提供** `320x100` 与 `336x280`，故未收录；`728x90` 因博客正文容器仅 720px 内宽也不收录）。

**不要开启的选项**：`Show adult ads`（成人广告直接违反 AdSense 内容政策，且会导致账号连坐）、Popunder / Social Bar / Smartlink（侵入性格式，审核扣分项）。后台的 `BOOST YOUR CPM` 是营销话术，不是建议。

格式取舍结论（2026-10-02）：**Native 作为文章页主力**（自适应宽度、覆盖流量大头、单一 code 兼容手机与桌面），160×600 固定 banner 作为角色页侧栏补充。站内只有角色页存在侧栏列，因此固定 banner 在本项目里天然只能是补充位。

### 8.2b 两种格式的区别（重要）

| | 固定尺寸 banner | Native Banner |
|---|---|---|
| 组件 | `AdsterraSlot` | `AdsterraNativeBanner` |
| 代码结构 | `atOptions{key,format,height,width}` + `https://HOST/<key>/invoke.js` | `<script async data-cfasync="false" src="https://HOST/<key>/invoke.js">` + `<div id="container-<key>">` |
| 尺寸 | 固定，调用方指定 | 自适应容器宽度 |
| 后台的 "ID" | **不是 key**（实测：后台 ID `30562450` ≠ key `0a10f11…`） | **不是 key**（实测：后台 ID `30562425` ≠ key `caffcdba…`） |
| host | 每个 banner 各自分配，非账号级 | 同左，且与固定 banner 的 host 不同 |

**结论：Adsterra 后台列表里的 "ID" 字段不能当 key 用，必须从 "Get Code" 的代码原文里取。**两个 banner 的实测都印证了这一点，记录在此避免重复踩坑。另外 `container-<key>` 的命名规则经实测确认与 key 一致。

### 8.2c 当前接入位置

| 模板 | 格式 | 位置 | 屏幕 |
|---|---|---|---|
| `/roles/[slug]` | 160×600 固定 | 侧栏首项（放在 sticky Builder 面板**之前**，避免滚动时两者重叠） | 仅 lg+ |
| `/blog/[slug]` | Native | 正文与 FAQ 之后、相关阅读之前 | 全部 |
| `/guides/[slug]` | Native | 同上 | 全部 |
| `/tactics/[slug]` | Native | 同上 | 全部 |

说明：

- 侧栏 160×600 排在 sticky 元素之前是刻意的——后来者会在滚动时覆盖 sticky 面板（现有布局本就存在该现象），把广告放在 sticky 之前可以完全避开。
- 文章页原本为 468×60 / 320×100 固定尺寸预留，现已改为 Native（自适应，无需再建两个固定尺寸 code）。
- Native 单位长得像正文卡片，因此**类别黑名单比固定横幅更关键**：出现成人/赌博/假杀毒这类欺骗性素材时，既伤体验也伤 AdSense 审核。
- Native 高度由素材决定，不预留高度（在文末，不影响首屏 CLS）。

### 8.3 待办

1. **ads.txt**：`public/ads.txt` 已留注释占位，从 Adsterra 后台复制**真实行**粘贴（不要凭猜测填写）。
2. **Vercel 配置 key 并重新部署**。
3. **浏览器实测**：部署后用真实 key 打开任一文章页，DevTools 检查 `<script src="//…/invoke.js">` 是否注入、广告是否渲染。本地构建只验证到"注入代码已进 chunk + 服务端预留盒子"，**客户端实际注入与广告填充未经浏览器实测**。
4. **跑一周后逐条审素材**：Adsterra 后台开启类别黑名单（成人、赌博、dating、假杀毒），发现违规创意立即拉黑。
5. **EEA/UK 同意**：已在 §9 处理完毕（接受/拒绝横幅 + 广告位门控）。剩余未接入的是 GA，见 §9.3。

### 8.4 风险复述（不可逆的那一半）

过渡期用 Adsterra 的实际风险不在 AdSense 重提，而在**获批之后**：若届时页面上的第三方创意违反政策，后果不是"拒批"而是**账号封禁，且连坐名下其他站点**。因此 AdSense 通过后应重新评估是否继续保留 Adsterra，而不是默认留着。

## 9. EEA/UK 广告同意（2026-10-02）

触发：Top 10 国家里德/法/荷/葡都在 EEA/UK 范围内。GDPR + ePrivacy 要求非必要 cookie 事先取得同意，而**广告与 GA 都会设 cookie** —— 这一点与广告网络是谁无关。

### 9.1 判断修正（重要）

初版方案曾以"Google 要求认证 CMP"为由，直接对 EEA/UK 不投广告。**这个理由用错了阶段**：

| 要求 | 适用范围 | 何时需要 |
|---|---|---|
| 事先取得同意（GDPR / ePrivacy） | **任何**会设 cookie 的广告网络，含 Adsterra | 现在就要 |
| **Google 认证的 CMP**（IAB TCF v2.2） | 仅限 **AdSense** 面向 EEA/UK 投放 | AdSense 获批时 |

结论：Adsterra 阶段**一个简单的接受/拒绝横幅就足够**，不需要认证 CMP；认证 CMP 是 AdSense 获批后的独立一步（AdSense 后台自带的 Privacy & messaging，免费）。正确做法不是把 EEA 用户关掉，而是**给他们选择**：同意则正常投放，拒绝则不加载。

### 9.2 实现（本批已完成）

| 环节 | 实现 |
|---|---|
| 判定区域 | `src/middleware.ts` 读 Vercel 边缘 geo（`request.geo.country`，回退 `x-vercel-ip-country`），写 cookie `fm26-ad-consent-region`（`1` = EEA/UK） |
| 名单 | EU 27 + IS / LI / NO + GB；`src/lib/consent-region.ts` |
| 询问 | `src/components/consent/consent-banner.tsx`：**仅**对 EEA/UK 且尚未决定的访客显示；Reject 与 Accept 同等显著；无关闭按钮（必须先选） |
| 记录 | cookie `fm26-ad-consent` = `granted` / `denied`，有效期 180 天 |
| 生效 | 两个广告位读取判定：区域外直接放行；区域内**只有 granted 才加载**。同意后经自定义事件立即生效，**无需刷新** |
| 更改选择 | 页脚 "Cookie settings"（`CookieSettingsButton`）重新打开横幅 |
| 失败策略 | fail-closed：无 document（服务端渲染）视为不允许 |

**收益**：EEA/UK 访客中同意的部分恢复投放。此前的"直接关掉"方案放弃了这约 17%（8 月数据：德 41 + 法 24 + 荷 28 + 葡 29 ≈ 122 clicks / 708）。

### 9.3 已知未处理项

**GA 仍对 EEA/UK 用户加载，未接入同意判定。** GA4 的 `_ga` cookie 同属需事先同意的非必要 cookie，这是**广告之前就存在的老缺口**。接入方式与广告位完全相同（读同一个 cookie、订阅同一个事件，约五行），但会让 EEA/UK 中拒绝同意的访客不计入 GA 数据 —— 是否接受这部分数据损失待确认；与认证 CMP + Consent Mode 一并处理也可以。

### 9.4 验证方式

- 本地与任何无 geo 环境：`request.geo` 为 undefined → cookie 恒为 `0` → 横幅不显示、广告正常，开发不受影响
- 上线后自测（非 EEA）：横幅不应出现，DevTools 可见 `invoke.js`
- 测 EEA 分支：临时把 `needsAdConsent()` 改为恒 `true` 推到 preview —— 应出现横幅；点 Accept 后 `invoke.js` 立即加载；点 Reject 后始终不加载。验完改回（Vercel 无法覆盖 geo）

### 8.5 线上排查记录（2026-10-02，广告不显示）

用户反馈"线上广告没出来"。逐层排查结论：

| 检查 | 手段 | 结果 |
|---|---|---|
| 部署版本 | 抓线上 HTML + 客户端 chunk | 广告位与同意逻辑**都已上线**（native 容器 id 在 HTML 中；页面 chunk 含 `pl30662924`；layout chunk 含 `div[role=dialog]` + `bottom-0` + `z-50`） |
| 访客区域 | 看响应头 | `Set-Cookie: fm26-ad-consent-region=1` → **测试者本身位于 EEA/UK**，广告被同意门控挡住，必须先点 Accept |
| key 是否有效 | `curl invoke.js` | 无 Referer → 200 但 **0 字节**；带 Referer + 浏览器 UA → **约 50KB**。<br>**结论：空响应是防爬保护，不代表 key 失效，排查时必须带 Referer。** |
| 注入方式是否可行 | 分析脚本内容 | 两个脚本**都不用 `document.write`**，动态注入可行 |
| 落点元素 | 分析脚本反混淆片段 | 两个脚本都按 `document.getElementById(atOptions.container \|\| "container-" + key)` 找落点并 `appendChild` → **容器必须带该 id** |

**发现的 bug 1**：`AdsterraSlot` 原先只渲染匿名占位 div，没有 id，脚本无处 append（native 组件一直是对的，它渲染的就是 `container-<key>`）。已修复：固定尺寸位现在渲染 `id="container-<key>"`。

**发现的 bug 2（ERR_ABORTED 的根源）**：两个组件的同意状态原先初始化为"乐观允许"（`useState(true)`），于是 EEA/UK 访客刷新页面时，注入副作用会**先**把脚本插入 DOM，紧接着同意检查解析为"未同意"→ React 执行清理 → 移除仍在加载的 script → **浏览器报 `net::ERR_ABORTED`**。已改为三态（`null` = 未决）：
- 未决时不注入、但保留 SSR 预留的占位盒子（避免非 EEA 用户的 CLS）
- 明确拒绝时才移除占位
- 只有明确允许才注入

**未解释的部分**：同机器、同 IP、同 UA/Referer 用 curl 拉 `invoke.js` 一律 200（约 50KB），而浏览器端返回 **403 Forbidden**。因此 403 不由 key / host / 区域 / 同意状态引起，需要看浏览器端 403 的**响应体与响应头**（可能是 Adsterra 侧的 bot 防护，或浏览器扩展/代理造成的链路差异）。待补。

**排查顺序（下次照此走）**：① 响应头里的区域 cookie → ② 同意横幅是否出现 → ③ 广告位容器 id 是否在 HTML 中 → ④ chunk 内是否含 host/key → ⑤ 带 Referer 拉 invoke.js。

### 9.5 测试

`src/lib/__tests__/consent-region.test.ts`（15 项）：EEA 名单边界、区域 cookie 解析、`adsAllowed` 的四种组合（区域外 / 区域内未决定 / 已同意 / 已拒绝）、提示条件、服务端 fail-closed。

> **该测试在首次运行时抓到德国（DE）漏出 EEA 名单** —— 若没这个测试，德国访客会完全静默地绕过同意判定。国家名单这类错误不会产生任何运行时报错，只能靠测试守。修改名单后务必重跑。
