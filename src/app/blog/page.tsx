import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

type PostMeta = {
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  slug: string;
};

function getPosts(): PostMeta[] {
  const postsDir = path.join(process.cwd(), 'src/content/posts');
  const files = fs.readdirSync(postsDir);
  const posts = files.map((file) => {
    const filePath = path.join(postsDir, file);
    const { data } = matter(fs.readFileSync(filePath, 'utf8'));
    return {
      ...data,
      slug: file.replace(/\.mdx?$/, ''),
    } as PostMeta;
  });
  // Sort posts by pubDate descending so the latest appears first
  return posts.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

export default function BlogPage() {
  const posts = getPosts();

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-heading mb-8 text-black dark:text-white">Blog</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="p-6 rounded-[var(--radius-base)] border-2 border-[var(--color-border)] shadow-[var(--shadow-shadow)] bg-[var(--color-secondary-background)]"
          >
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-heading mb-2 hover:underline" style={{ color: 'var(--main)' }}>
                {post.title}
              </h2>
            </Link>
            <div className="text-sm text-[var(--color-foreground)] mb-2">{post.pubDate}</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded bg-[var(--color-main)] text-[var(--color-main-foreground)] text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-[var(--color-foreground)]">{post.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
