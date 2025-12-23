import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import BlogPageClient from './BlogPageClient';

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
  return posts.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

export default function BlogPage() {
  const posts = getPosts();
  return <BlogPageClient posts={posts} />;
}
