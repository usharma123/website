---
title: 'Turning my website into a desktop'
description: 'How I rebuilt my portfolio around windows, a taskbar, and a terminal while keeping real URLs and server-rendered blog posts.'
pubDate: '2026-09-29'
tags: ['nextjs', 'react', 'portfolio', 'design', 'performance']
---

My portfolio had become a collection of pages: an introduction, projects, a résumé, and a blog. I wanted the site itself to feel like something I would build. Since much of my work involves terminals and developer tools, I turned it into a small desktop.

Projects open in windows. Posts have a reader. A taskbar tracks what's open, and a terminal lets visitors explore the same content with commands. The welcome window still gives someone a quick introduction and a direct way to browse projects. Exploring is optional.

## Giving each part of the site a home

The desktop metaphor gave the existing content a place:

| Content                        | Desktop application         |
| ------------------------------ | --------------------------- |
| Introduction and featured work | Welcome                     |
| Background and skills          | README.md                   |
| Project list and details       | Projects                    |
| Blog index and articles        | Writing and the post reader |
| Work and education             | Résumé                      |
| Contact information            | Contact                     |
| Command-based navigation       | Terminal                    |

The visual treatment is simple: pale wallpaper, dark borders, a purple active title bar, and compact controls. A note in the corner shows what I'm doing and links to the newest post.

## A window manager in React

The window manager uses a reducer. Each window has an ID, a stacking order, optional position and size, and minimized and maximized flags. Opening a window either creates it or brings the existing one forward.

The reducer handles actions such as `open`, `focus`, `close`, `minimize`, `toggleMax`, and `rect`. The taskbar reads the same state, so a minimized window can be restored without rebuilding a separate list of open applications.

| Action         | State change                            |
| -------------- | --------------------------------------- |
| Open           | Add a window or restore an existing one |
| Focus          | Move it above the other windows         |
| Minimize       | Hide it while retaining its state       |
| Maximize       | Fill the area above the taskbar         |
| Move or resize | Save the final rectangle                |
| Close          | Remove it from the open-window list     |

Dragging needs more care than a button click. Pointer movement writes the window's position directly to its element. React receives the final rectangle when the drag ends. That avoids rerendering the window contents for every pointer event.

The same interaction supports snapping at the screen edges. A temporary outline shows the proposed placement before the window is released.

## Keeping real URLs

A desktop interface can make navigation awkward if every view lives behind the same address. I kept routes for the main sections and `/blog/[slug]` for individual posts.

On a direct visit, the pathname determines the initial window. During a session, the focused window can update the address through the browser history API. Opening a post uses the Next.js router because it needs the article from that route.

The desktop lives in the root layout. The post route supplies server-rendered children to its reader window. That lets the desktop keep its open windows while an article changes.

## Making the terminal useful

The terminal exposes a small read-only filesystem built from the site's data. Project directories contain a `README.md`; the writing directory contains one entry per post. Some commands to try:

```bash
ls
cat README.md
cd projects
ls
cd ~/writing
open desktop-os-website.md
```

It supports command history, tab completion, path resolution, and clickable suggestions. Plain-English questions go through local pattern matching and return the relevant profile or project information. There is no model request behind those answers.

Both the desktop and terminal read the same project and post data. Adding an article creates a writing entry without a second list to maintain.

## Search and smaller screens

`⌘K` or `Ctrl+K` opens a search dialog for apps, projects, posts, and actions. A backtick toggles the terminal when the visitor isn't typing into a field.

The search uses a native modal dialog to keep keyboard focus inside it. When a window comes forward, it can focus its main input. Text fields show the caret without drawing a box around the typing area; buttons and links retain visible keyboard focus.

Below 768 pixels, windows fill the available desktop area. Dragging is disabled there. The title controls and taskbar remain available, so a phone doesn't need to imitate a mouse-driven desktop.

## Getting article loading out of the way

I kept the posts in Markdown. `gray-matter` reads their metadata, and the post route compiles their bodies with `next-mdx-remote`, `remark-gfm`, and syntax highlighting. `generateStaticParams` lists the posts for the production build.

The writing index and latest-post link use Next.js links to prefetch articles. On a local production check, opening a prefetched post needed no new route request. That's more useful than making the loading overlay look faster.

There was also a sequencing problem. The reader's mount notification could run before the asynchronous Markdown body was ready. The route now waits for compilation before returning the article, so the header and body arrive together.

Code blocks stay in server-rendered markup. Only their copy buttons need client state. For architecture sketches, I replaced misaligned box-drawing characters with Markdown tables and numbered flows. Those render as part of the article and stay readable in a narrow window.

## Loading application code when it's needed

The welcome window ships with the initial page. Other application bodies use dynamic imports, so a visitor reading an introduction doesn't need to load the terminal implementation immediately.

The window-opening animation uses opacity and a transform, and respects reduced-motion preferences. Most of the interface is regular HTML and CSS; the desktop behavior doesn't require an animation framework.

I checked the production build, typed commands in the terminal, opened posts through the desktop, and checked the table layouts at desktop and phone widths. React Doctor is a useful additional code check, but it doesn't measure navigation latency or tell me whether a diagram is readable.

## The files behind it

| File or directory                    | Responsibility                                |
| ------------------------------------ | --------------------------------------------- |
| `src/components/desktop/Desktop.tsx` | Compose the desktop and connect it to routing |
| `src/components/desktop/state.ts`    | Window state and reducer actions              |
| `src/components/desktop/Window.tsx`  | Window frame, focus, dragging, and resizing   |
| `src/components/desktop/terminal/`   | Read-only filesystem and command handling     |
| `src/app/blog/[slug]/page.tsx`       | Compile and render an article                 |
| `src/content/posts/`                 | Markdown source and frontmatter               |

The part I like most is that there are several ways into the same work. Someone can click a project, search for a topic, or type `ls`. They all lead back to the same content.

[Website source](https://github.com/usharma123/website)
