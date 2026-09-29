import PROJECTS from '@/data/projects'
import type { PostMeta } from '@/lib/posts'
import type { WinId } from '../apps'

/* A tiny read-only filesystem built from the site's data, so the terminal can
   be explored with ls/cd/cat instead of memorized commands. */

export type FileKind =
  | { type: 'readme' }
  | { type: 'resume' }
  | { type: 'contact' }
  | { type: 'skills' }
  | { type: 'project'; slug: string }
  | { type: 'post'; slug: string }

export type Dir = {
  kind: 'dir'
  name: string
  /** One-line summary shown by `ls -l`. */
  note?: string
  /** The window `open` brings up for this directory. */
  app?: WinId
  children: FsNode[]
}
export type File = { kind: 'file'; name: string; note?: string; file: FileKind }
export type FsNode = Dir | File

export function buildFs(posts: PostMeta[]): Dir {
  return {
    kind: 'dir',
    name: '~',
    app: 'home',
    children: [
      {
        kind: 'file',
        name: 'README.md',
        note: 'who I am',
        file: { type: 'readme' },
      },
      {
        kind: 'file',
        name: 'resume.md',
        note: 'work and school',
        file: { type: 'resume' },
      },
      {
        kind: 'file',
        name: 'skills.txt',
        note: 'what I work with',
        file: { type: 'skills' },
      },
      {
        kind: 'file',
        name: 'contact.txt',
        note: 'how to reach me',
        file: { type: 'contact' },
      },
      {
        kind: 'dir',
        name: 'projects',
        note: `${PROJECTS.length} things I've built`,
        app: 'projects',
        children: PROJECTS.map((p) => ({
          kind: 'dir' as const,
          name: p.slug,
          note: p.name,
          app: `project:${p.slug}` as const,
          children: [
            {
              kind: 'file' as const,
              name: 'README.md',
              note: p.description,
              file: { type: 'project' as const, slug: p.slug },
            },
          ],
        })),
      },
      {
        kind: 'dir',
        name: 'writing',
        note: `${posts.length} posts`,
        app: 'writing',
        children: posts.map((p) => ({
          kind: 'file' as const,
          name: `${p.slug}.md`,
          note: p.title,
          file: { type: 'post' as const, slug: p.slug },
        })),
      },
    ],
  }
}

/** Resolve `path` against `cwd` (segments below ~). Case-insensitive, and
 *  understands ~, /, ., .. and trailing slashes. */
export function resolve(
  root: Dir,
  cwd: string[],
  path: string,
): { node: FsNode; path: string[] } | null {
  const trimmed = path.trim()
  let segs = trimmed.startsWith('~') || trimmed.startsWith('/') ? [] : [...cwd]
  for (const part of trimmed.replace(/^~\/?|^\//, '').split('/')) {
    if (!part || part === '.') continue
    if (part === '..') segs = segs.slice(0, -1)
    else segs.push(part)
  }
  let node: FsNode = root
  const canonical: string[] = []
  for (const seg of segs) {
    if (node.kind !== 'dir') return null
    const hit: FsNode | undefined = node.children.find(
      (c) => c.name.toLowerCase() === seg.toLowerCase(),
    )
    if (!hit) return null
    node = hit
    canonical.push(hit.name)
  }
  return { node, path: canonical }
}

export function displayPath(segs: string[]) {
  return segs.length ? `~/${segs.join('/')}` : '~'
}
