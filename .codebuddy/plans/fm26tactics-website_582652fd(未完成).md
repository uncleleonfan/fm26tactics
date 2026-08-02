---
name: fm26tactics-website
overview: 搭建 FM26 战术攻略网站 fm26tactics.com，基于 Next.js，包含攻略内容系统 + 战术可视化工具，英文界面。
design:
  architecture:
    framework: react
    component: shadcn
  styleKeywords:
    - Dark Tactical Dashboard
    - Glassmorphism
    - Neon Accents
    - High Contrast
    - Data-Driven
    - Professional
  fontSystem:
    fontFamily: Inter
    heading:
      size: 36px
      weight: 700
    subheading:
      size: 20px
      weight: 600
    body:
      size: 16px
      weight: 400
  colorSystem:
    primary:
      - "#00E676"
      - "#00C853"
      - "#1B5E2040"
    background:
      - "#0A0E17"
      - "#141A26"
      - "#1C2436"
      - "#1A3A1A"
    text:
      - "#F1F5F9"
      - "#94A3B8"
      - "#475569"
    functional:
      - "#00E676"
      - "#FFB300"
      - "#FF5252"
      - "#448AFF"
      - "#448AFF"
      - "#FFB300"
      - "#FF5252"
todos:
  - id: scaffold-project
    content: Initialize Next.js 14 project with TypeScript, Tailwind CSS, shadcn/ui, and Contentlayer
    status: pending
  - id: research-fm26
    content: Use [skill:agent-browser] to research FM26 tactics system, player roles, formations, and competing sites for content structure reference
    status: pending
  - id: implement-layout
    content: "Build global layout: dark-themed header, footer, mobile navigation, and page shell"
    status: pending
    dependencies:
      - scaffold-project
  - id: implement-homepage
    content: Build homepage with hero section, featured tactics grid, latest guides list, and CTA section
    status: pending
    dependencies:
      - implement-layout
  - id: implement-content-system
    content: Set up Contentlayer MDX pipeline, define tactic/role/guide content types, and create initial sample content
    status: pending
    dependencies:
      - scaffold-project
      - research-fm26
  - id: implement-tactic-pages
    content: Build tactics list page with filtering and tactic detail page with MDX rendering and embedded formation diagrams
    status: pending
    dependencies:
      - implement-content-system
      - implement-layout
  - id: implement-tactic-builder
    content: "Build interactive tactics visualizer: draggable pitch, role selector, instruction panel, presets, and export"
    status: pending
    dependencies:
      - implement-layout
      - research-fm26
  - id: implement-role-encyclopedia
    content: Build player role encyclopedia with role cards grid, detail pages with attribute radar charts
    status: pending
    dependencies:
      - implement-content-system
      - implement-layout
  - id: implement-search-seo
    content: Implement site-wide search, dynamic sitemap, SEO metadata, and Open Graph images
    status: pending
    dependencies:
      - implement-content-system
      - implement-layout
  - id: generate-assets
    content: Use [skill:多模态内容生成] to create formation diagrams, role icons, and guide illustrations for content pages
    status: pending
    dependencies:
      - research-fm26
---

## 产品概述

fm26tactics.com 是一个面向 Football Manager 2026 玩家的英文战术攻略网站。核心定位是"战术内容+战术可视化工具"双引擎，帮助玩家从理解战术原理到亲手搭建阵型，打通 FM26 战术学习全链路。

## 核心功能

### 1. 攻略内容系统

- **战术基础理论**：阵型选择、球员角色职责、团队指令、球员个人指令的系统性解析
- **战术模板库**：不同风格的预设战术（高位压迫、防守反击、控球Tiki-Taka、三中卫体系等），附带详细配置和适用场景
- **球员角色百科**：FM26 所有球员角色的数据化分析，包含关键属性门槛、行为模式、适配阵型
- **定位球战术**：角球、任意球攻防策略，包含跑位图和配置参数
- **训练与球队管理**：训练日程安排、球员发展路线、士气管理指南
- **联赛/俱乐部指南**：不同联赛特色分析，俱乐部开档推荐
- **版本更新解析**：比赛引擎机制变化、Meta战术演变追踪

### 2. 战术可视化工具

- **在线战术板**：可拖拽调整的足球场战术板，11名球员自由摆放
- **角色可视化**：每个位置可下拉选择球员角色（防守/策应/进攻职责），不同角色以颜色区分
- **指令叠加显示**：团队指令以图例/高亮形式直接显示在战术板上
- **战术导出**：战术配置可导出为图片或分享链接

### 3. 内容发现

- **战术筛选**：按阵型（4-2-3-1、4-3-3等）、风格、难度筛选战术
- **站内搜索**：全站内容搜索
- **热门标签聚合**：通过标签关联发现相关内容

## 技术栈

### 核心技术

| 层级 | 技术选型 | 理由 |
| --- | --- | --- |
| 框架 | Next.js 14 (App Router) | SSR/SSG 保障SEO，React Server Components降低JS体积 |
| 语言 | TypeScript | 类型安全，战术数据结构复杂需要类型约束 |
| 样式 | Tailwind CSS | 原子化CSS，快速构建响应式界面 |
| 组件库 | shadcn/ui | 高质量无样式冲突的React组件，暗色主题友好 |
| 内容管理 | MDX (Contentlayer) | Markdown写攻略，支持嵌入React组件 |
| 拖拽交互 | @dnd-kit | 战术板球员拖拽、阵型编辑 |
| 动画 | Framer Motion | 战术板过渡动画、页面转场 |
| 部署 | Vercel | Next.js原生支持，全球CDN |


### 架构设计

```mermaid
graph TB
    subgraph "内容层"
        MDX[MDX攻略内容] --> CL[Contentlayer]
        CL --> SSG[静态生成页面]
    end
    
    subgraph "展示层"
        SSG --> HP[首页]
        SSG --> TL[战术列表页]
        SSG --> TP[战术详情页]
        SSG --> GP[攻略分类页]
    end
    
    subgraph "交互层"
        TB[战术板工具] --> DND[@dnd-kit拖拽引擎]
        DND --> FIELD[球场Canvas组件]
        FIELD --> ROLE[角色选择器]
        FIELD --> INST[指令面板]
        TB --> EXPORT[导出/分享]
    end
    
    subgraph "基础设施"
        LAYOUT[共享布局] --> NAV[导航系统]
        LAYOUT --> SEARCH[站内搜索]
        SEO[SEO元数据] --> OG[Open Graph]
    end
    
    HP --> LAYOUT
    TL --> LAYOUT
    TP --> LAYOUT
    GP --> LAYOUT
    TB --> LAYOUT
```

### 数据流

- **内容页面**：MDX文件 → Contentlayer编译时处理 → SSG生成静态HTML → 客户端水合
- **战术板工具**：用户拖拽 → React状态更新 → 球场实时重绘 → 配置序列化 → 导出/分享
- **搜索**：构建时生成内容索引JSON → 客户端FlexSearch全文检索

### 目录结构

```
fm26tactics/
├── public/
│   ├── images/
│   │   ├── formations/        # 阵型示意图
│   │   ├── roles/             # 球员角色图标
│   │   └── og/                # Open Graph 社交分享图
│   └── fonts/
│
├── content/                   # MDX攻略内容（核心内容资产）
│   ├── tactics/               # 战术攻略
│   │   ├── 4-2-3-1-gegenpress.mdx
│   │   ├── 4-3-3-tiki-taka.mdx
│   │   └── ...
│   ├── roles/                 # 球员角色分析
│   │   ├── deep-lying-playmaker.mdx
│   │   └── ...
│   ├── training/              # 训练指南
│   ├── set-pieces/            # 定位球
│   └── meta/                  # 元数据、导航配置
│       └── navigation.ts
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # 根布局（导航+页脚）
│   │   ├── page.tsx           # 首页
│   │   ├── tactics/
│   │   │   ├── page.tsx       # 战术列表（可筛选）
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # 战术详情
│   │   ├── guides/
│   │   │   ├── page.tsx       # 攻略分类导航
│   │   │   └── [category]/
│   │   │       └── [slug]/
│   │   │           └── page.tsx
│   │   ├── builder/
│   │   │   └── page.tsx       # 战术可视化工具
│   │   ├── roles/
│   │   │   ├── page.tsx       # 角色百科列表
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── search/
│   │   │   └── page.tsx       # 搜索结果页
│   │   ├── sitemap.ts         # 动态Sitemap生成
│   │   └── robots.ts          # Robots配置
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx      # 顶部导航（Logo+链接+搜索入口）
│   │   │   ├── footer.tsx      # 页脚（链接+版权）
│   │   │   ├── mobile-nav.tsx  # 移动端抽屉导航
│   │   │   └── sidebar.tsx     # 攻略侧边栏目录
│   │   ├── tactics/
│   │   │   ├── formation-card.tsx       # 战术卡片组件
│   │   │   ├── formation-grid.tsx       # 战术网格布局
│   │   │   ├── tactic-filter-bar.tsx    # 战术筛选栏
│   │   │   └── tactic-mdx-layout.tsx    # 战术MDX渲染布局
│   │   ├── builder/                     # 战术板工具核心组件
│   │   │   ├── pitch.tsx                # 球场Canvas（SVG绘制）
│   │   │   ├── player-node.tsx          # 可拖拽球员节点
│   │   │   ├── role-selector.tsx        # 角色/职责下拉选择器
│   │   │   ├── instruction-panel.tsx    # 团队指令配置面板
│   │   │   ├── formation-presets.tsx    # 预设阵型快速切换
│   │   │   ├── tactic-export.tsx        # 导出为图片/分享链接
│   │   │   └── tactic-builder-provider.tsx  # 战术板状态管理
│   │   ├── shared/
│   │   │   ├── search-dialog.tsx        # 全局搜索弹窗
│   │   │   ├── mdx-components.tsx       # MDX自定义组件映射
│   │   │   ├── table-of-contents.tsx    # 文章目录导航
│   │   │   ├── callout.tsx              # 提示框（技巧/警告/信息）
│   │   │   ├── breadcrumb.tsx           # 面包屑导航
│   │   │   └── tag-badge.tsx            # 标签徽章
│   │   └── home/
│   │       ├── hero.tsx                 # 首页大屏
│   │       ├── featured-tactics.tsx     # 精选战术
│   │       ├── latest-guides.tsx        # 最新攻略
│   │       └── cta-section.tsx          # 引导进入战术板
│   │
│   ├── lib/
│   │   ├── content.ts         # Contentlayer配置导出
│   │   ├── search.ts          # FlexSearch索引与查询
│   │   ├── tactics-data.ts    # FM26战术数据（角色、阵型、指令常量）
│   │   ├── metadata.ts       # SEO元数据生成工具
│   │   └── utils.ts           # 通用工具函数
│   │
│   ├── hooks/
│   │   ├── use-tactic-builder.ts  # 战术板核心状态Hook
│   │   └── use-search.ts         # 搜索Hook
│   │
│   └── types/
│       ├── tactic.ts          # 战术类型定义（阵型、角色、指令）
│       ├── content.ts         # 内容元数据类型
│       └── builder.ts         # 战术板状态类型
│
├── tailwind.config.ts
├── next.config.mjs
├── contentlayer.config.ts     # Contentlayer配置
├── tsconfig.json
└── package.json
```

### 核心类型定义

```typescript
// 战术板核心状态类型
interface PlayerNode {
  id: string;
  x: number;                    // 球场坐标 (0-100)
  y: number;
  role: PlayerRole;             // 角色枚举
  duty: 'defend' | 'support' | 'attack';
  individualInstructions: string[];
}

interface TacticBoardState {
  formation: string;            // e.g. "4-2-3-1"
  players: PlayerNode[];
  teamInstructions: {
    mentality: 'very-defensive' | 'defensive' | 'cautious' | 'balanced' | 'positive' | 'attacking' | 'very-attacking';
    inPossession: string[];
    inTransition: string[];
    outOfPossession: string[];
  };
}

// 内容元数据
interface TacticMeta {
  title: string;
  slug: string;
  formation: string;
  style: 'gegenpress' | 'tiki-taka' | 'counter-attack' | 'wing-play' | 'route-one' | 'fluid';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  excerpt: string;
  coverImage: string;
}
```

## 设计风格

采用 **Dark Tactical Dashboard** 风格——灵感来自足球战术分析软件和军事指挥界面，以深色背景为基底，高饱和霓虹绿/青色为功能主色，营造专业、沉浸、数据驱动的战术分析氛围。配合微妙的玻璃拟态面板和流畅的过渡动画，球场上球员节点的拖拽反馈即时、精准。

### 页面规划

#### 1. 首页

- **Hero 大屏**：全宽深色球场背景，大标题 "Master FM26 Tactics" 配合动态战术线动画，CTA 按钮直通战术板工具和战术库
- **精选战术卡片区**：3列网格展示热门战术，每张卡片包含阵型缩略图、风格标签、难度标签、阅读时长
- **最新攻略列表**：左侧缩略图+标题+摘要+日期的列表布局，支持按分类过滤
- **战术板引流区**：视觉化展示战术板工具的拖拽操作，强调"Try it yourself"的交互引导

#### 2. 战术列表页

- **筛选栏**：顶部fixed筛选条，支持阵型下拉、风格多选、难度滑块
- **战术网格**：响应式卡片网格（lg: 3列, md: 2列, sm: 1列），卡片悬停时阵型图有微放大效果，显示关键角色标注
- **空状态**：无匹配结果时显示建议调整筛选条件的友好提示

#### 3. 战术详情页

- **文章布局**：居中最大宽度 prose 排版，左侧悬浮目录导航，右侧可选的战术摘要卡片
- **战术配置可视化**：文章内嵌小型战术板SVG，展示该战术的阵型和关键角色
- **MDX 增强组件**：球员角色内联卡片（hover显示属性雷达图）、战术指令对比表、提示/警告 Callout
- **关联推荐**：底部相关战术横向滚动卡片

#### 4. 战术板工具页

- **全宽沉浸式**：移除常规导航侧边栏，最大化战术板操作区域
- **球场区域**：SVG 绘制的足球场，11个可拖拽球员节点，拖拽时有磁吸对齐网格线和半透明位置预览
- **右侧面板**：可折叠的指令配置面板，分为"球员角色"和"团队指令"两个Tab，使用下拉菜单和切换开关
- **顶部工具栏**：阵型预设快捷切换按钮组、重置按钮、导出按钮、分享按钮
- **底部状态栏**：显示当前阵型名称和球员数量，实时校验提示

#### 5. 球员角色百科页

- **角色网格**：卡片式布局，每个角色卡片包含图标、名称、职责标签（Defend/Support/Attack），点击进入详情
- **角色详情**：属性雷达图可视化、适配阵型列表、行为模式文字描述、关键属性门槛表格

### 交互设计

- 战术板拖拽：拖拽时有弹性动画，放下时节点吸附到最近网格点，角色选择器弹出带搜索的下拉
- 筛选联动：选择阵型后，风格筛选自动过滤不兼容选项
- 搜索：Cmd/Ctrl+K 唤起全局搜索弹窗，即时显示结果
- 页面转场：内容页之间使用 Framer Motion 淡入+轻微上移动画

## Agent Extensions

### Skill

- **agent-browser**
- Purpose: 调研 FM26 官方战术系统、现有攻略网站（如 FM Scout、Sortitoutsi）的内容结构和交互模式，提取可参考的设计模式
- Expected outcome: 获取 FM26 战术系统的完整角色列表、阵型分类、指令参数，以及竞品网站的内容组织方式

- **多模态内容生成**
- Purpose: 为战术攻略文章生成配图——阵型示意图、球员角色图标、战术指令对比图
- Expected outcome: 产出可直接用于内容页的高质量战术配图素材，提升文章可读性