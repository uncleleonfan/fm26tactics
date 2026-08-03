# FM26 Tactics

> The Ultimate Football Manager 2026 Tactics Hub — Meta strategies, role deep-dives, interactive builder, and community-curated guides.

**Official Site:** [fm26tactics.com](https://fm26tactics.com)

Built for FM players who want to stop guessing and start winning. Based on community testing data from FM-Arena, FM Scout, Passion4FM, and the broader FM community.

## Features

- **8 Formations** — Gegenpress, Tiki-Taka, Wing Play, Counter Attack, and more, each with full role assignments and team instructions
- **Interactive Tactic Builder** — Drag-to-position players, assign roles and duties, visualize formations, and export as SVG
- **9 In-Depth Guides** — Training schedules, set-piece masterclass, youth development, scouting & wonderkids, match-day shouts, squad rotation & morale
- **Meta Analysis** — FM-Arena engine rewards/punishments, OP roles, role synergy combos, shape-switching tips
- **Community Insights** — Curated from Reddit, FM-Arena, FM Scout, Sortitoutsi, and top creators (ZaZ, CBP87, etc.)
- **Dark Theme** — Eye-friendly dark UI with green accent
- **Full-Text Search** — FlexSearch-powered instant search across all content
- **Responsive** — Works on desktop, tablet, and mobile

## Tech Stack

| Layer | Technology |
|-------|-------------|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + `tailwindcss-animate` |
| Content | Contentlayer (MDX-based) |
| Animations | Framer Motion |
| Charts | Recharts |
| Search | FlexSearch |
| Icons | Lucide React |
| Export | html-to-image |
| Deployment | [Vercel](https://vercel.com) |

## Project Structure

```
fm26tactics/
├── content/                  # MDX content files
│   ├── tactics/              # 8 tactic files
│   └── guides/               # 9 guide files
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── builder/          # Interactive tactic builder
│   │   ├── tactics/          # Tactic browser & detail pages
│   │   ├── guides/           # Guide browser & detail pages
│   │   ├── meta/             # Meta analysis & community insights
│   │   ├── contact/          # Contact page
│   │   └── privacy/          # Privacy policy
│   ├── components/           # React components
│   │   ├── builder/          # Pitch, PlayerNode, RoleSelector, etc.
│   │   ├── home/             # Hero, FeaturedTactics, StatsSection, etc.
│   │   ├── layout/           # Header, Footer, MainWrapper
│   │   ├── shared/           # SearchDialog, Breadcrumb, Callout, etc.
│   │   ├── tactics/          # TacticCard, TacticFilterBar
│   │   └── guides/           # GuideDetail
│   ├── hooks/                # useTacticBuilder
│   ├── lib/                  # Data, utils, metadata, community-data
│   └── types/                # TypeScript type definitions
├── contentlayer.config.ts    # Contentlayer configuration
├── tailwind.config.ts        # Tailwind configuration
├── vercel.json               # Vercel deployment config
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
# Clone the repo
git clone https://github.com/uncleleonfan/fm26tactics.git
cd fm26tactics

# Install dependencies
npm install --legacy-peer-deps

# Generate Contentlayer types
npm run contentlayer:build

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Adding Content

All content lives in `content/` as MDX files. Contentlayer automatically generates types and validates frontmatter.

### Add a Tactic

Create a file in `content/tactics/`:

```mdx
---
title: "My Tactic"
description: "A brief description"
formation: "4-3-3"
style: "gegenpress"
difficulty: "intermediate"
tags: ["pressing", "high-tempo"]
publishedAt: "2026-08-03"
author: "Your Name"
---

Your tactic content here...
```

### Add a Guide

Create a file in `content/guides/`:

```mdx
---
title: "My Guide"
description: "A brief description"
category: "training"
publishedAt: "2026-08-03"
author: "Your Name"
---

Your guide content here...
```

## Deployment

The site is deployed on Vercel. Push to `main` branch triggers automatic deployment.

```bash
# Manual deploy
npx vercel --prod
```

## Contact

- **Email:** [uncleleofan@gmail.com](mailto:uncleleofan@gmail.com)
- **GitHub Issues:** [github.com/uncleleonfan/fm26tactics/issues](https://github.com/uncleleonfan/fm26tactics/issues)

## License

MIT
