import type { Metadata } from 'next'
import { compileMDX } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

import CodeBlock from '@/components/CodeBlock'
import { PostHeader, PostMount } from '@/components/desktop/windows/Post'
import { getPost, getPosts } from '@/lib/posts'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug)
  return post
    ? { title: post.meta.title, description: post.meta.description }
    : {}
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  // Mount the reader only when the entire article, including diagrams, is
  // ready. Otherwise PostMount clears the loading state before MDX resolves.
  const { content } = await compileMDX({
    source: post.content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
      },
    },
    components: {
      pre: CodeBlock,
      table: (props) => (
        <div className="table-wrap">
          <table {...props} />
        </div>
      ),
    },
  })

  return (
    <article className="mx-auto max-w-[680px] px-6 py-8 sm:px-10">
      <PostMount slug={slug} />
      <PostHeader meta={post.meta} />
      <div className="prose">{content}</div>
    </article>
  )
}
