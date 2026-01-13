---
title: "Building My Portfolio & Blog with Next.js and Neobrutalism"
description: "A detailed walkthrough of how I built this personal website using Next.js, Tailwind, and neobrutalist design."
pubDate: "2025-07-09"
tags: ["nextjs", "portfolio", "blog", "neobrutalism", "tutorial"]
---

# Building My Portfolio & Blog with Next.js and Neobrutalism

Welcome to my first blog post! In this post, I'll document the process of building my personal portfolio and blog using [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and the [neobrutalism-templates/portfolio](https://github.com/neobrutalism-templates/portfolio) and [neobrutalism-templates/blog](https://github.com/neobrutalism-templates/blog) as inspiration.

## 1. Project Setup

I started by cloning the neobrutalism portfolio template:

```bash
git clone https://github.com/neobrutalism-templates/portfolio.git blog
cd blog
pnpm install
```

## 2. Customizing the Theme

I wanted a sky blue neobrutalist look, so I updated the CSS variables in `globals.css`:

```css
:root {
  --background: oklch(94.61% 0.043 211.12);
  --main: oklch(76.89% 0.139164 219.13); /* Cyan */
  --border: oklch(0% 0 0);
  --shadow: 4px 4px 0px 0px var(--border);
  /* ...other variables... */
}
```

## 3. Adding a Blog Section

I wanted my blog to match the neobrutalist style. I created a `/blog` route and set up dynamic routing for individual posts:

```tsx
// src/app/blog/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export default function BlogPage() {
  // Reads all markdown files in /src/content/posts
}
```

Each post is a markdown file in `src/content/posts/` with frontmatter for title, date, and tags.

## 4. Rendering Markdown with Code

To render markdown and code snippets, I used `gray-matter` and `next-mdx-remote`:

```bash
pnpm add gray-matter next-mdx-remote
```

In the dynamic post page:

```tsx
// src/app/blog/[slug]/page.tsx
import { MDXRemote } from 'next-mdx-remote/rsc';

const mdxContent = (
  <MDXRemote
    source={content}
    options={{
      mdxOptions: {
        rehypePlugins: [rehypeHighlight],
      },
    }}
  />
);
```

## 5. Animations with Framer Motion

To add a smooth expand animation when viewing a blog post, I used Framer Motion in a client component:

```tsx
// src/app/blog/[slug]/BlogPostClient.tsx
"use client";
import { motion } from "framer-motion";

export default function BlogPostClient({ data, children }) {
  return (
    <motion.article
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* ... */}
      {children}
    </motion.article>
  );
}
```

## 6. Skills & Projects

I updated my skills and projects in `src/data/skills.ts` and `src/data/projects.ts` to reflect my real experience and current work.

```ts
// Example for skills
const SKILLS = [
  { field: 'Frontend', skills: [
    { skill: 'html', icon: SiHtml5 },
    { skill: 'css', icon: SiCss3 },
    // ...
  ]},
  { field: 'Backend', skills: [
    { skill: 'nodejs', icon: SiNodedotjs },
    // ...
  ]},
];
```

## 7. Home Page Layout

I used a flex layout to place my avatar to the left of my introduction:

```tsx
<div className="flex items-start gap-8 font-base mt-12">
  <img src="/avatar.png" alt="Utsav Sharma Avatar" className="w-56 h-56 ..." />
  <div>
    {/* Intro text */}
  </div>
</div>
```

## 8. Final Thoughts

I recently started learning **Next.js**, and this is my first attempt at building a simple portfolio site. I wrote everything in **MDX/Markdown** so I could easily include code snippets. For the design, I went with a **neobrutalist** style for a bold, minimal look, and added **Framer Motion** animations to make the site feel more dynamic and engaging. Honestly, it wasn't as hard as I thought!

## 9. What's Next?

I'm planning to use this site as a personal journal to document what I learn throughout my Masters, as well as to share mini data projects I work on. One of my goals is to create a **Markov process** calculator and visualizer.

---

Thanks for reading! If you have questions or want to see more, check out the **[GitHub repo](https://github.com/usharma123/website/tree/main)** or connect with me on social media.