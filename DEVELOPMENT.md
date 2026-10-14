# Developing guischet.xyz

This repo is my GitHub profile README and the source of [guischet.xyz](https://guischet.xyz):
monthly notes on my open-source work, plus talks and workshops.

Next.js 16 (App Router, fully static), Tailwind CSS v4, shadcn/ui, MDX. Deployed on Vercel.

## Development

    npm install
    npm run dev      # http://localhost:3000
    npm run lint
    npm run build    # every route should be ○ (static)

Vercel skips the build when a push only changes `README.md` (the GitHub profile), via
`ignoreCommand` in `vercel.json`.

## Writing a post

Add `content/posts/<slug>.mdx`. The file name is the URL: `/posts/<slug>`. Monthly notes use
`YYYY-MM` as the slug.

```yaml
---
title: "Post title"
date: 2026-10-14
summary: "One or two sentences, shown in lists, RSS and link previews."
type: update            # update | talk | workshop
project: drivechain-observatory   # optional
event: LABITCONF 2026             # optional, for talks/workshops
links:                            # optional, shown under the title
  - label: Slides
    href: https://example.com
tags: [drivechain]                # optional
draft: true                       # optional, only visible in `npm run dev`
---
```

Frontmatter is validated at build time (`lib/posts.ts`). A bad post fails the build.
Talks and workshops also appear on `/talks`.

Besides Markdown (with GFM tables), posts can use `<Callout title="…">`, `<Stats>` and
`<Stat value="…" label="…" />` (see `components/mdx-components.tsx`).

Site name, email and Discord live in `lib/site.ts`.
