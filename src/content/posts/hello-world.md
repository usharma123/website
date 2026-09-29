---
title: 'Building the first version of my portfolio and blog'
description: 'The original Next.js portfolio: a neobrutalist template, a blue theme, and Markdown posts stored alongside the code.'
pubDate: '2025-07-09'
tags: ['nextjs', 'portfolio', 'blog', 'neobrutalism', 'tutorial']
---

This was the first version of my portfolio and blog, built in July 2025. I started from the [neobrutalism portfolio template](https://github.com/neobrutalism-templates/portfolio) and used its [blog template](https://github.com/neobrutalism-templates/blog) as a reference.

The site has since changed. These examples describe the original implementation; the [desktop redesign](/blog/desktop-os-website) explains the current one.

## Starting with a template

```bash
git clone https://github.com/neobrutalism-templates/portfolio.git blog
cd blog
pnpm install
```

The template gave me a layout to work from while I learned Next.js. I changed the colors, replaced the sample projects, and added a place to publish Markdown posts.

## Setting the colors

I wanted pale blue backgrounds, dark borders, and offset shadows. The theme used CSS variables in `globals.css`:

```css
:root {
  --background: oklch(94.61% 0.043 211.12);
  --main: oklch(76.89% 0.139164 219.13); /* Cyan */
  --border: oklch(0% 0 0);
  --shadow: 4px 4px 0px 0px var(--border);
  /* ...other variables... */
}
```

## Adding posts

The blog index read Markdown files from `src/content/posts`. Each file had frontmatter for its title, publication date, description, and tags. Individual posts used the `/blog/[slug]` route.

`gray-matter` parsed the frontmatter. `next-mdx-remote` rendered the body, with `rehype-highlight` for code blocks:

```bash
pnpm add gray-matter next-mdx-remote
```

```tsx
// src/app/blog/[slug]/page.tsx
import { MDXRemote } from 'next-mdx-remote/rsc'

const mdxContent = (
  <MDXRemote
    source={content}
    options={{
      mdxOptions: {
        rehypePlugins: [rehypeHighlight],
      },
    }}
  />
)
```

Keeping the posts in the repository meant I could review a writing change alongside a code change and publish both through the same build.

## Animating the reader

The original reader used Framer Motion to expand an article when it opened:

```tsx
// src/app/blog/[slug]/BlogPostClient.tsx
'use client'
import { motion } from 'framer-motion'

export default function BlogPostClient({ data, children }) {
  return (
    <motion.article
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* ... */}
      {children}
    </motion.article>
  )
}
```

That was a design choice in this version of the site. The desktop redesign uses a different window-opening animation and no longer depends on Framer Motion.

## Keeping profile data separate

Skills and projects lived in `src/data/skills.ts` and `src/data/projects.ts`. Components read those lists instead of embedding the same information in several pages.

The home page put an avatar beside a short introduction:

```tsx
<div className="font-base mt-12 flex items-start gap-8">
  <img src="/avatar.png" alt="Utsav Sharma Avatar" className="h-56 w-56 ..." />
  <div>{/* Intro text */}</div>
</div>
```

## What I used it for

I wanted a place to record what I learned during my master's and share small data projects. One early idea was a Markov-process calculator and visualizer, which became [MarkovExplorer](/blog/markov-explorer).

[Website source](https://github.com/usharma123/website/tree/main)
