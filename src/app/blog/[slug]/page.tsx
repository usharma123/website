import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import rehypeHighlight from 'rehype-highlight';
import { MDXRemote } from 'next-mdx-remote/rsc';
import BlogPostClient from "./BlogPostClient";
import CopyCodeBlock from "@/components/CopyCodeBlock";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'src/content/posts');
  const files = fs.readdirSync(postsDir);
  return files.map((file) => ({
    slug: file.replace(/\.mdx?$/, ''),
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'src/content/posts', `${slug}.md`);
  const source = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(source);

  // Render MDX content as a React node
  const mdxContent = (
    <MDXRemote
      source={content}
      options={{
        mdxOptions: {
          rehypePlugins: [rehypeHighlight],
        },
      }}
      components={{
        pre: CopyCodeBlock,
      }}
    />
  );

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <BlogPostClient data={data}>{mdxContent}</BlogPostClient>
    </main>
  );
}