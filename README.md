# Portfolio Website

A modern, neobrutalism-styled portfolio website built with Next.js, showcasing projects, blog posts, and professional experience.

## Features

- **Home Page**: Animated hero section with personal introduction and social links
- **About Page**: Professional experience timeline and skills showcase
- **Work Page**: Interactive project gallery with preview images and links
- **Blog**: MDX-powered blog with syntax highlighting
- **Dark Mode**: Theme switching with smooth transitions
- **Animations**: Smooth page transitions and interactive elements powered by Framer Motion
- **Responsive Design**: Mobile-first design that works across all devices

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom neobrutalism design system
- **Animations**: Framer Motion
- **UI Components**: Radix UI primitives
- **Content**: MDX for blog posts with gray-matter
- **Syntax Highlighting**: Highlight.js with rehype-highlight
- **Theme Management**: next-themes
- **Icons**: Lucide React & React Simple Icons

## Installation

This project uses `pnpm` as the package manager. Make sure you have it installed.

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── about/             # About page with experience & skills
│   ├── blog/              # Blog listing and individual posts
│   ├── work/               # Projects showcase page
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── motion/            # Animation components
│   ├── sections/          # Page sections (experience, skills)
│   └── ui/                # Reusable UI components
├── content/               # MDX blog posts
│   └── posts/
├── data/                  # Static data files
│   ├── experience.ts      # Work experience data
│   ├── projects.ts        # Project data
│   └── skills.ts          # Skills data
└── lib/                   # Utility functions
```

## Configuration

### Metadata

Update site metadata in `src/app/layout.tsx`:
- Site title and description
- Open Graph tags
- Favicon

### Content Updates

#### Social Links
Edit `src/components/links.tsx` to update social media links. Icons are imported from `@icons-pack/react-simple-icons` with the `Si` prefix.

#### Projects
Update project information in `src/data/projects.ts`. For preview images:
- Place images in the `public/` folder
- Reference them as `/image-name.png` in the `previewImage` field
- Default aspect ratio is `71/26` (can be adjusted in `src/app/work/page.tsx`)

#### Experience & Skills
- Experience timeline: `src/data/experience.ts`
- Skills showcase: `src/data/skills.ts`

#### Blog Posts
- Create new posts in `src/content/posts/` as `.md` files
- Use frontmatter for metadata:
  ```markdown
  ---
  title: "Post Title"
  description: "Post description"
  pubDate: "2024-01-01"
  tags: ["tag1", "tag2"]
  ---
  ```

### Styling

The design uses a neobrutalism style with custom CSS variables defined in `src/app/globals.css`. To customize:
- Color scheme: Update CSS variables in `globals.css`
- Component styles: Modify Tailwind classes in components
- For more styling options, visit [neobrutalism.dev/styling](https://neobrutalism.dev/styling)

## Design System

The website uses a custom neobrutalism design system with:
- Bold borders and shadows
- Vibrant accent colors
- Geometric shapes and decorations
- Smooth animations and interactions
- Custom typography with heading and base font families

## License

See [LICENSE](LICENSE) file for details.
