# AdSense 拒批诊断与整改记录（2026-09）

> 拒批时间：2026-09-07 · 类型：**Low value content**（"Your site does not yet meet the criteria of use in the Google publisher network"）
> 引用标准：Minimum content requirements / Webmaster quality guidelines (thin content)

## 1. 时间线

| 日期 | 事件 |
|---|---|
| 08-30 | 接入 AdSense：script loader（`src/components/ads/adsense-script.tsx`）、`AdSlot` 组件、`ads.txt`、`google-adsense-account` 验证 meta → 提交申请 |
| 08-30 ~ 09-04 | **Google 审核窗口期**。审核爬虫抓到的版本：4 locale（en/de/fr/tr）并存、~150 个「英文正文 + 本地化 UI」重复页、首页 5 个内容区块 `ssr: false`（抓取 HTML 仅 Hero + QuickPicks + 空占位 div） |
| 09-04 | 上线大清理版本：移除全部非英语 locale（301 单跳无链）、sitemap/middleware 纯净化、新增 6 篇战术（共 14 篇）、SEO Week 1（www 跳转、首页重定位、pillar 页、内链）、favicon/404 噪音修复、FeaturedTactics/LatestGuides 恢复 SSR 并新增 Faq/Explore 区块 |
| 09-07 | 收到拒批通知。同日完成剩余整改（见 §3） |

## 2. Google 标准 ↔ 本站问题映射

| Google 拒批理由 | 本站对应问题 | 判定 |
|---|---|---|
| Thin / duplicated content | de/fr/tr locale 页与英文版正文重复度 95%+（仅 UI 翻译），合计 ~150 个重复价值 URL | **主因**，审核窗口期被抓取 |
| Unique high quality content | 首页抓取 HTML 几乎为空：FeaturedTactics/Stats/CTA/CommunityInsights/LatestGuides 全部 `ssr: false`，爬虫只看到 Hero + QuickPicks | **主因**，首页是审核首要入口 |
| Good user experience | favicon 404、根 404 崩溃、trailing-slash 重定向链（均已在 9-4 修复） | 次因，已消除 |
| Minimum content requirements | 内容量本身达标（14 战术 + 10 guides + 23 blog 均为深度长文）；站点年轻（7 月上线，~700 clicks/月）为固有减分项 | 非内容量问题 |

另有一处**合规矛盾**：Privacy Policy 声明 "We do not use advertising networks"，但站点已实际加载 adsbygoogle——对广告审核是直接负面信号（已于 09-07 修正）。

## 3. 整改清单

### 9-4 版本已上线（commit `959a6e7` ~ `1280713`）

- [x] 移除 /tr /fr /de 全部 locale，English-only，301 单跳重定向（`next.config.mjs`）
- [x] sitemap 去除全部 locale 变体与 hreflang；middleware 清理 bot locale-strip 逻辑
- [x] 首页 FeaturedTactics / LatestGuides 恢复 SSR；新增 FaqSection / ExploreSection 内容区块
- [x] 新增 6 篇战术页（5-3-2、4-2-2-2、3-4-2-1、5-2-3、4-4-1-1、4-2-4）
- [x] SEO Week 1：www 统一跳转、首页重定位、pillar 页、关键词蚕食修复、内链
- [x] favicon 404 / 根 404 崩溃 / 重定向链修复

### 09-07 本次完成

- [x] 首页剩余 3 区块（CommunityInsights / StatsSection / TacticBuilderCTA）恢复 SSR——三者均为轻量卡片组件，无图表依赖，抓取 HTML 现包含首页全部内容
- [x] About 页补 E-E-A-T：Who We Are（团队身份）、How We Test Tactics（FM-Arena 数据 + 多存档 + 全赛季 + 补丁感知方法论）、Editorial & Updates（更新机制与反馈渠道）
- [x] Privacy Policy 修正：删除「无广告网络」矛盾声明；新增 Advertising Cookies 条目、Google AdSense 第三方条款、「Advertising and Your Choices」章节（含 Google Ads Settings / aboutads.info 退出方式）；生效日期更新为 09-07
- [x] AdSense 基础设施确认就绪：`AdSenseScript`（afterInteractive 全局加载）、`AdSlot` 组件（待获批后按页投放）、`ads.txt`（pub-2798522702383698）、`google-adsense-account` meta

## 4. 重新申请操作清单

1. **部署**本次改动（09-07 整改批次）。
2. **GSC 触发重抓**：Search Console → URL 检查 → 请求编入索引：`/`、`/about`、`/privacy`、`/tactics`（首页与信任页优先）。
3. **等待 1~2 周**让审核爬虫（Media Partners / Mediapartners-Google）重新抓取新版页面，确认：首页 view-source 含各区块真实文本、`/tr /fr /de/*` 全部 301、Privacy 含广告章节。
4. **AdSense 后台重提审核**：站点 → 重新申请。若账号侧显示「网站已关联」则走申诉/反馈渠道说明整改完成。
5. **若再次拒批**：间隔 ≥30 天再提；期间持续产出内容（每周 1~2 篇 blog/guide）、积累自然流量（目标 1500+ clicks/月）；重申前复查 GSC「重复内容」报告归零。
6. **获批后**：AdSense 后台开启 Auto ads 或用 `AdSlot` 手动投放；确认 `ads.txt` 状态正常（已就位）；EU 流量需评估 Consent Mode / 同意横幅合规（届时单独任务处理）。

## 5. 长期预防

- 保持 English-only 直到某一语言有**真翻译正文**再开 locale（教训：UI 壳 locale = 重复价值页）
- 新增内容区块默认 SSR；`ssr: false` 仅用于重型客户端依赖（recharts 等），且须拆分外壳 SSR
- 隐私/条款页随广告/统计栈变更同步更新
