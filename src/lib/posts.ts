import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type PostMeta = {
  slug: string
  title: string
  description: string
  pubDate: string
  tags: string[]
}

const POSTS_DIR = path.join(process.cwd(), 'src/content/posts')

function toMeta(data: Record<string, unknown>, slug: string): PostMeta {
  const meta = data as Partial<PostMeta>
  return {
    title: '',
    description: '',
    pubDate: '',
    ...meta,
    tags: meta.tags ?? [],
    slug,
  }
}

function slugOf(file: string) {
  return file.replace(/\.mdx?$/, '')
}

export function getPosts(): PostMeta[] {
  return fs
    .readdirSync(POSTS_DIR)
    .map((file) => {
      const { data } = matter(
        fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'),
      )
      return toMeta(data, slugOf(file))
    })
    .sort((a, b) => b.pubDate.localeCompare(a.pubDate))
}

export function getPost(slug: string) {
  const file = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(file)) return null
  const { content, data } = matter(fs.readFileSync(file, 'utf8'))
  return { meta: toMeta(data, slug), content }
}
