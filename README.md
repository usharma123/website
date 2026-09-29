# Utsav Sharma — personal site

Instead of pages, it's a small desktop: icons, draggable
windows, a taskbar, and a terminal that can open everything else.

- **README.md**: who I am
- **Projects**: pinned work, plus a list of everything else
- **Writing**: long-form posts (Markdown in `src/content/posts`)
- **Résumé**: experience, research, education, skills
- **Terminal**: `help`, `ls`, `open <anything>`

Every routed window (`/about`, `/work`, `/blog`, `/blog/<slug>`, `/resume`) is
prerendered, so links, SEO and no-JS visitors still get real content.

## Stack

Next.js 16 (App Router, static), Tailwind CSS 4, MDX via `next-mdx-remote`.
No UI or animation libraries. The window manager is about 300 lines in
`src/components/desktop`.

## Where things live

| What                            | Where                             |
| ------------------------------- | --------------------------------- |
| Profile, education              | `src/data/resume.ts`              |
| Jobs                            | `src/data/experience.ts`          |
| Research                        | `src/data/research.ts`            |
| Projects (+ `featured`, `post`) | `src/data/projects.ts`            |
| Posts                           | `src/content/posts/*.md`          |
| Apps, icons, window sizes       | `src/components/desktop/apps.tsx` |
| Colors and fonts                | `src/app/globals.css` (`@theme`)  |

## Development

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm build
```
