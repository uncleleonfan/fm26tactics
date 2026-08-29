# FM26Tactics.com 网页事件分析报告

> **报告周期**：2026-08-01 ~ 2026-08-28（GA4 Events: Event name 导出）
> **数据范围**：All Users，60 种事件，事件总量 17,757（与《用户行为与搜索表现报告》的 17,755 基本一致，差 2 为导出口径正常差异）
> **姊妹报告**：`docs/analytics-report-2026-08.md`（用户行为 + GSC 搜索表现）

---

## 1. 执行摘要（TL;DR）

| 核心结论 | 数据支撑 |
|---|---|
| **Builder 是绝对的产品核心** | Builder 相关事件 4,789 次，占全部自定义交互事件的 **78.1%** |
| 搭建深度极强，产品价值已验证 | 189 位搭建者人均选人 **7.1 次**，指令开关人均 9.3 次 |
| **转化漏斗在中后段断裂** | 226 人看到 Builder → 189 人开始搭建 → 仅 **18 人完成下载**（全链路 8.0%） |
| 最大单点流失：导出面板 | 66 次打开导出 → 20 次完成下载，**完成率仅 30%** |
| 分享飞轮缺失 | `builder_copy_share_link` 全月仅 **1 次** |
| 大量"死"入口 | 站内搜索 1 次、view_all CTA 合计 4 次、card_guide 3 次、语言切换 7 次 |
| 核心转化未被度量 | GA4 未标记任何 Key event，`builder_download` 等关键行为不在转化报告中 |

---

## 2. 事件全景

### 2.1 事件分类统计

| 分类 | 事件数合计 | 占自定义交互比 | 代表事件 |
|---|---|---|---|
| 自动/系统事件 | 11,620 | — | page_view 7,216、session_start 1,588、first_visit 1,204、user_engagement 983、scroll 629 |
| **Builder（builder_\*）** | **4,789** | **78.1%** | select_player 1,343、tab 669、select_role 412 |
| 导航（nav_\* + footer） | 518 | 8.4% | nav_link 356、mobile_menu 47 |
| 卡片（card_\*） | 255 | 4.2% | card_tactic 84、card_role 54 |
| 战术页（tactic_\*） | 230 | 3.7% | open_builder 130、copy_setup 100 |
| CTA（cta_\*） | 155 | 2.5% | try_builder 69、browse_tactics 56 |
| 其他交互（click / detail_back） | 101 | 1.6% | click 90、detail_back 11 |
| Meta 页（meta_\*） | 89 | 1.4% | meta_download 85 |

> 自定义交互事件合计 6,137 次 = 总量 17,757 − 自动事件 11,620。

### 2.2 基础流量指标（系统事件推导）

| 指标 | 数值 | 说明 |
|---|---|---|
| Page views | 7,216 | 5.9 页/用户、4.5 页/会话 |
| Sessions | 1,588 | 与 first_visit 1,204 对照：75.8% 会话来自首访用户 |
| 有 engaged 会话的用户 | 677 | 占总用户 55.3% |
| 触发滚动的用户 | 440 | 36% 用户至少一次完成整页滚动（scroll 事件在页面 90% 可见时触发） |
| **滚动完成率（页面口径）** | **629 / 7,216 = 8.7%** | 91% 的页面浏览未滚到页底，内容消费集中在前半屏 |

---

## 3. Builder 转化漏斗（核心章节）

### 3.1 漏斗全景（用户数口径）

```
看到 Builder 提示 (builder_nudge_shown)     226 人  ██████████████
 └─ 开始搭建 (builder_select_player)        189 人  ████████████   83.6%
     ├─ 应用模板 (apply_template)            83 人  █████          43.9%
     ├─ 选阵型 (select_formation)            82 人  █████          43.4%
     ├─ 选角色 (select_role)                 82 人  █████          43.4%
     ├─ 调职责 (select_duty)                 59 人  ████           31.2%
     └─ 设心态 (set_mentality)               40 人  ███            21.2%
         └─ 打开导出面板 (open_export)        51 人  ███            27.0%
             └─ ✅ 完成下载 (download)        18 人  █▌             8.0%（全链路）
                 └─ 分享链接 (copy_share)      1 人  ▏             0.4%
```

### 3.2 两个关键流失点

**① 导出面板完成率仅 30%**（最大单点流失）

- `builder_open_export` 66 次（51 人）→ `builder_download` 20 次（18 人），另有 `builder_export_close` 53 次（43 人）
- 打开过导出面板的用户中仅 **35.3%**（18/51）最终下载。
- 需要排查：导出步骤是否过多（格式选择/文件命名/确认弹窗）、是否有门槛或报错被吞、移动端导出是否可用。

**② 深度配置层流失过半**

- 从开始搭建（189 人）到角色/阵型配置（82 人）流失 57%；`builder_instructions_tab`（60 人）、`builder_select_duty`（59 人）同步下滑——相当一部分用户只完成"摆 11 个人"就离开，未进入战术微调阶段。

### 3.3 使用深度：留下来的人用得很重

| 事件 | 人均次数 | 解读 |
|---|---|---|
| builder_switch_phase | **10.0** | 仅 2 位用户，但反复切换 |
| builder_toggle_instruction | **9.3** | 23 位深度用户反复调试指令 |
| builder_select_player | 7.1 | 全体搭建者平均，粘性强 |
| builder_select_role | 5.0 | 角色调整是核心动作 |
| builder_apply_template | 4.3 | 模板是高频起点 |
| builder_tab | 4.1 | 多面板切换浏览 |

**结论**：Builder 呈"两极使用"——多数人浅尝辄止（89% 搭建者未完成下载），但进入深度配置的用户人均交互 5-10 次。产品价值已被重度用户验证，问题在**中段引导与导出闭环**，而非功能本身。

### 3.4 Nudge 提示效果

- 曝光 226 人，关闭 56 人（**24.8% dismiss 率**），且 dismiss 用户人均恰好 1 次（无烦躁性重复关闭）
- 189/226 = **83.6%** 的曝光用户实际开始搭建——nudge 转化效率优秀，值得扩大曝光面（例如战术页内联展示）。

### 3.5 高级功能几乎无人知晓

- `builder_switch_phase`（20 次）与 `builder_apply_dual_phase`（14 次）各只有 **2 位用户**，但人均 7-10 次——功能不是不好，是入口太深。
- `builder_reset` 21 次：重置低频，属正常。

---

## 4. 战术页与 Meta 页行为

### 4.1 战术详情页（tactic_\*）

| 事件 | 次数 | 用户 | 人均 |
|---|---|---|---|
| tactic_open_builder | 130 | 80 | 1.6 |
| tactic_copy_setup | 100 | 73 | 1.4 |

- 战术页 → Builder 桥接有效：80 人从战术页进入 Builder，占全部搭建者（189）的 **42%**，是 Builder 第一大入口。
- **双轨并存**：73 人选择"复制设置"（游戏内手动照抄），这部分用户未被引导至 Builder 二次编辑。

### 4.2 Meta 页（meta_\*）

| 事件 | 次数 | 用户 | 人均 |
|---|---|---|---|
| meta_download | 85 | 25 | **3.4** |
| meta_view_arena | 4 | 1 | 4.0 |

- 25 人下载 85 次、人均 3.4 个战术——**批量获取需求明确**，可提供打包下载。
- `meta_view_arena` 仅 1 人使用：Arena 展示的入口或价值传达有问题。

---

## 5. 导航与 CTA 效果排行

### 5.1 导航（nav_\* / footer）

| 事件 | 次数 | 用户 | 人均 | 评价 |
|---|---|---|---|---|
| nav_link | 356 | 94 | 3.8 | 主导航是浏览中枢 ✓ |
| nav_mobile_menu | 47 | 24 | 2.0 | 移动菜单使用少（与移动流量占比低一致） |
| nav_logo | 39 | 29 | 1.3 | 常规回首页行为 |
| nav_link_mobile | 27 | 15 | 1.8 | — |
| nav_lang_switch | 7 | 7 | 1.0 | **几乎无人切换语言**，印证多语言页零流量 |
| nav_search_open | **1** | 1 | 1.0 | **站内搜索形同虚设** |
| footer_link | 41 | 31 | 1.3 | Footer 有实际使用，可承载更多导流 |

### 5.2 CTA（cta_\*）

| 事件 | 次数 | 用户 | 评价 |
|---|---|---|---|
| cta_try_builder | 69 | 60 | 最有效 CTA ✓（60 独立用户） |
| cta_browse_tactics | 56 | 47 | 有效 ✓ |
| cta_trending_tactic | 26 | 24 | 有效 |
| cta_view_all_tactics | 3 | 3 | **基本无效** |
| cta_view_all_guides | 1 | 1 | **基本无效** |

### 5.3 卡片（card_\*）

| 事件 | 次数 | 用户 | 评价 |
|---|---|---|---|
| card_tactic | 84 | 64 | 主力内容入口 ✓ |
| card_role | 54 | 26 | 人均 2.1，角色卡粘性不错 |
| card_quick_pick | 48 | 43 | 快速挑选转化面广 ✓ |
| card_guide_list | 45 | 25 | 列表版指南卡有效 |
| card_related_tactic | 11 | 8 | 相关推荐点击弱 |
| card_featured_tactic | 10 | 8 | 精选推荐点击弱 |
| card_guide | 3 | 2 | **与 card_guide_list 同类却差 15 倍**，位置/样式问题 |

### 5.4 其他交互

- `click`（通用点击）90 次 / 26 人，人均 3.5：建议在下一次埋点审计中明确该事件指向的具体组件。
- `detail_back` 11 次：用户极少"返回列表"——列表→详情的浏览回路未形成，多为直接离开。

---

## 6. 十大关键发现

1. **Builder 占自定义交互事件 78%**：内容站外壳下，实际是工具站，资源应向 Builder 倾斜。
2. **全链路转化仅 8%**（226 曝光 → 18 下载），89% 的搭建者未走完全程。
3. **导出面板完成率 30%** 是最大单点流失（66 open → 20 download，43 人关闭放弃）。
4. **重度用户价值被验证**：人均选人 7.1 次、指令调试 9.3 次、阶段切换 10 次。
5. **分享机制失效**（全月 1 次），病毒增长飞轮不存在。
6. **战术页是 Builder 第一大入口**（贡献 42% 搭建者），但"复制设置"用户（73 人）未被二次转化。
7. **Meta 页批量下载需求明确**（人均 3.4 个），无打包下载功能。
8. **死入口清单**：站内搜索（1 次）、view_all CTA（4 次）、card_guide（3 次）、语言切换（7 次）、Arena（1 人）。
9. **91% 的页面浏览未滚到页底**：关键信息与转化组件必须前置到前 50% 屏幅。
10. **GA4 无 Key event**：builder_download / tactic_copy_setup / meta_download 未进转化报告，优化决策缺北极星指标。

---

## 7. 优化建议（按优先级）

> 承接姊妹报告（`docs/analytics-report-2026-08.md`）的 P0/P1/P2 体系，本报告编号 E（Events）。

### P0 速效（1-2 周）

#### E-1 修复导出漏斗（对应发现 2/3）

- **操作**：走查 `open_export` → `download` 之间的每一步：减少弹窗层级、默认格式+默认文件名一键下载、导出失败要有可见报错；在 `builder_export_close` 时弹一次性"遇到问题？"微调查（月样本 43 人足够）。
- **目标**：导出完成率 30% → 60%+，月下载 20 → 40+。
- **涉及**：`src/components/` 下 Builder 导出相关组件。

#### E-2 标记 Key events（对应发现 10）

- **操作**：GA4 中将 `builder_download`、`tactic_copy_setup`、`meta_download`、`builder_apply_template` 标记为 Key events。
- **价值**：零开发成本，立即获得转化漏斗报告，为所有后续优化提供度量基线。

#### E-3 清理/重定位死入口（对应发现 8）

- **操作**：
  - `nav_search_open`（1 次）→ 暂时隐藏或替换为高频入口；
  - `cta_view_all_*`（4 次）→ 文案改具体数字（"浏览 12 套实测战术"）并调整位置；
  - `card_guide`（3 次）→ 对齐 card_guide_list 的样式位置或移除。
- **价值**：减少页面噪声，把屏幕位置让给有效入口（card_tactic、cta_try_builder）。

### P1 中期（2-6 周）

#### E-4 建立分享闭环（对应发现 5）

- **操作**：下载成功页直接给"复制分享链接 + 战术预览图"；分享落地页展示战术参数并附"在 Builder 中打开"。当前分享入口藏得太深（全月 1 次）。
- **目标**：月分享 1 → 50+。

#### E-5 "复制设置"用户二次转化（对应发现 6）

- **操作**：`tactic_copy_setup` 成功 toast 中追加"在 Builder 中打开微调 →"；战术页 Builder 按钮提亮。
- **依据**：73 位复制用户 ≈ 潜在 38% 的 Builder 搭建者增量。

#### E-6 Meta 战术打包下载（对应发现 7）

- **操作**：Meta 页加"Download all meta tactics"，埋点 `meta_download_all`；消除 25 人 × 3.4 次的重复操作。

#### E-7 深度配置引导（对应 3.2 节流失点 ②）

- **操作**：摆完 11 人后出现一次性引导："设定角色与心态（30 秒）"；或提供"智能推荐角色"一键填充。
- **目标**：select_role 参与率 43% → 65%+。

#### E-8 高级功能前置（对应 3.5 节）

- **操作**：双阶段战术（dual phase）在模板列表加"高级"标签与 30 秒 GIF 演示；仅 2 人用过但人均 7-10 次，属于被埋没的差异化功能。

### P2 长期（1-3 个月）

#### E-9 Builder 留存与账户体系

- **依据**：姊妹报告发现回访率仅 1.6%；189 位搭建者的作品无法保存是主因之一。
- **操作**：本地保存/云保存战术列表（"我的战术"），配合回访提醒；这是把工具用户变成回头客的最短路径。

#### E-10 深度用户运营

- **操作**：识别 switch_phase/dual_phase 的 2 位超级用户与 23 位指令调试用户，做用户访谈或内测邀请；产品迭代以重度用户为雷达。

#### E-11 内容消费模式适配（对应发现 9）

- **操作**：所有长文的结论、参数表、CTA 前置到前 50% 屏幅；页底区域仅放相关推荐；用 8.7% 滚动完成率作为布局验收指标。

---

## 8. 附录

### 8.1 完整事件表（60 项，按次数降序）

| Event name | 次数 | 用户 | 人均 |
|---|---|---|---|
| page_view | 7,216 | 1,224 | 5.90 |
| session_start | 1,588 | 1,207 | 1.32 |
| builder_select_player | 1,343 | 189 | 7.11 |
| first_visit | 1,204 | 1,204 | 1.00 |
| user_engagement | 983 | 677 | 1.48 |
| builder_tab | 669 | 162 | 4.13 |
| scroll | 629 | 440 | 1.43 |
| builder_select_role | 412 | 82 | 5.02 |
| builder_nudge_shown | 365 | 226 | 1.62 |
| builder_apply_template | 357 | 83 | 4.30 |
| nav_link | 356 | 94 | 3.79 |
| builder_select_formation | 331 | 82 | 4.04 |
| builder_instructions_tab | 247 | 60 | 4.12 |
| builder_select_duty | 214 | 59 | 3.63 |
| builder_toggle_instruction | 214 | 23 | 9.30 |
| builder_open_sidebar | 194 | 52 | 3.73 |
| builder_open_formation | 133 | 72 | 1.85 |
| tactic_open_builder | 130 | 80 | 1.63 |
| tactic_copy_setup | 100 | 73 | 1.37 |
| click | 90 | 26 | 3.46 |
| meta_download | 85 | 25 | 3.40 |
| card_tactic | 84 | 64 | 1.31 |
| cta_try_builder | 69 | 60 | 1.15 |
| builder_open_export | 66 | 51 | 1.29 |
| builder_set_mentality | 59 | 40 | 1.48 |
| builder_nudge_dismiss | 56 | 56 | 1.00 |
| cta_browse_tactics | 56 | 47 | 1.19 |
| card_role | 54 | 26 | 2.08 |
| builder_export_close | 53 | 43 | 1.23 |
| card_quick_pick | 48 | 43 | 1.12 |
| nav_mobile_menu | 47 | 24 | 1.96 |
| card_guide_list | 45 | 25 | 1.80 |
| footer_link | 41 | 31 | 1.32 |
| nav_logo | 39 | 29 | 1.34 |
| nav_link_mobile | 27 | 15 | 1.80 |
| cta_trending_tactic | 26 | 24 | 1.08 |
| builder_reset | 21 | 14 | 1.50 |
| builder_download | 20 | 18 | 1.11 |
| builder_switch_phase | 20 | 2 | 10.00 |
| builder_apply_dual_phase | 14 | 2 | 7.00 |
| card_related_tactic | 11 | 8 | 1.38 |
| detail_back | 11 | 10 | 1.10 |
| card_featured_tactic | 10 | 8 | 1.25 |
| nav_lang_switch | 7 | 7 | 1.00 |
| meta_view_arena | 4 | 1 | 4.00 |
| card_guide | 3 | 2 | 1.50 |
| cta_view_all_tactics | 3 | 3 | 1.00 |
| builder_copy_share_link | 1 | 1 | 1.00 |
| cta_view_all_guides | 1 | 1 | 1.00 |
| nav_search_open | 1 | 1 | 1.00 |

### 8.2 口径说明

| 项目 | 口径 |
|---|---|
| 周期 | 2026-08-01 ~ 2026-08-28，All Users |
| 事件总量 | 60 项合计 17,757；与用户行为报告 17,755 差 2（GA 不同导出口径的正常差异） |
| 自定义交互事件 | 总量减去 page_view / session_start / first_visit / user_engagement / scroll 五项自动事件 = 6,137 |
| 漏斗口径 | 用户数（去重）而非次数；漏斗各级为包含关系近似（用户可不按典型路径完成） |
| 导出完成率 | download 用户 18 / open_export 用户 51 = 35.3%（用户口径）；次数口径 20/66 = 30.3% |
| scroll | GA4 增强度量事件，页面滚动至 90% 可见时触发一次 |

---

*报告生成：2026-08-29 ｜ 数据源：GA4 Events: Event name 导出（Account: Leon / Property: FM26Tactics）*
