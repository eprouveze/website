# CLAUDE.md - Project Context

## Project Overview

Personal portfolio and blog for Emmanuel Prouveze (https://emmanuel.prouveze.fr).
Business leader at Salesforce Japan who builds AI projects as a hobby. The site showcases
blog posts ("Writing") and side projects, positioning the author as someone who builds,
not just talks about AI.

## Tech Stack

- **Framework**: Next.js 16.1.3 (App Router)
- **React**: 19.2.3
- **Styling**: Tailwind CSS v4 with `@tailwindcss/typography`
- **Content**: MDX via `next-mdx-remote` + `gray-matter` frontmatter parsing
- **MDX plugins**: remark-gfm, rehype-slug, rehype-autolink-headings
- **Font**: Inter (Google Fonts, `--font-inter` CSS variable)
- **Analytics**: Vercel Analytics
- **Hosting**: Vercel (auto-deploys on push to main)
- **Language**: TypeScript

## Directory Structure

```
content/
  posts/           # Blog posts as .mdx files
  projects/        # Project pages as .mdx files
  drafts/          # Unpublished drafts and content strategy docs
src/
  app/             # Next.js App Router
    page.tsx       # Homepage
    about/         # About page
    contact/       # Contact page
    writing/       # Blog listing + [slug] + tags/[tag]
    projects/      # Projects listing + [slug]
  components/
    blog/          # PostCard, RecentPosts, Sidebar, TagCloud, WritingLayout
    layout/        # Container, Header, Footer
    projects/      # ProjectCard
  lib/
    mdx.ts         # Content loading: getAllPosts, getPostBySlug, getAllProjects, etc.
  types/
    post.ts        # Post, PostFrontmatter, PostWithContent
    project.ts     # Project, ProjectFrontmatter, ProjectWithContent
public/
  images/          # Static images (organized by post slug)
  resume.pdf       # Resume download
```

## Key Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Content Workflow

### Adding a blog post

Create `content/posts/<slug>.mdx`:

```mdx
---
title: "Post Title"
description: "Brief description for cards and SEO"
publishedAt: "2026-01-25"
tags: ["AI", "Career", "Building"]
---

Content here (standard MDX)...
```

- Posts are sorted by `publishedAt` descending
- Reading time is auto-calculated
- Tags power the tag cloud and `/writing/tags/[tag]` filtering
- Images go in `public/images/<slug>/`

### Adding a project

Create `content/projects/<slug>.mdx`:

```mdx
---
title: "Project Name"
description: "Brief description"
tech: ["Next.js", "TypeScript", "Claude API"]
status: "active"
github: "https://github.com/..."
---

Project description here...
```

- `status`: "active" | "archived" | etc.
- `url` and `github` are optional fields

### Content loading (src/lib/mdx.ts)

Key functions:
- `getAllPosts()` - Returns all posts sorted by date
- `getPostBySlug(slug)` - Returns compiled MDX content for a post
- `getAllProjects()` / `getProjectBySlug(slug)` - Same for projects
- `getAllTags()` - Tag list with counts
- `getRecentPosts(limit, excludeSlug)` - For sidebar/related posts
- `getPostsByTag(tag)` - Filter posts by tag

## Component Architecture

### Layout (`src/components/layout/`)
- **Header** - Site navigation
- **Footer** - Site footer
- **Container** - Shared max-w-5xl container wrapper

### Blog (`src/components/blog/`)
- **WritingLayout** - Blog page layout with sidebar
- **PostCard** - Post preview card (title, description, tags, reading time)
- **Sidebar** - Sidebar with tag cloud and recent posts
- **TagCloud** - Tag filter navigation
- **RecentPosts** - Recent posts list for sidebar

### Projects (`src/components/projects/`)
- **ProjectCard** - Project preview card (title, description, tech stack, links)

## Styling Conventions

- **Tailwind v4** with CSS-based config (no tailwind.config.js)
- Theme defined in `src/app/globals.css` via `@theme inline`
- Colors: white background (`#ffffff`), slate-900 foreground (`#0f172a`), blue-600 accent (`#2563eb`)
- Font: Inter via `--font-sans` CSS variable
- Site-wide container: `max-w-5xl` (via Container component)
- Typography plugin for MDX prose styling
- Light mode only (no dark mode)

## Known Issues / Tech Debt

- No dark mode support
- No search functionality
- No comments/engagement features on posts
- Draft article `local-first-ai-reframed.mdx` awaiting manager approval to publish
  (needs frontmatter fix: `date` → `publishedAt`, capitalize tags)

## Content Strategy

See `content/drafts/CONTENT_PLAN.md` for the full editorial calendar and
`content/drafts/CONTENT_GUIDELINES.md` for tone/style guidance.

Key framing rules:
- Always frame projects as "personal curiosity" / "hobby coding"
- Reference Salesforce direction favorably when relevant
- Never imply work tools are inadequate
- Tone: first-person, direct, specific, honest about failures
- Lead with concrete experience, not theory

### Published posts
- GenUI thought piece + technical + LinkedIn version
- "I'm in My Fifties. I Started Coding AI Projects."
- "Phantom Pipeline, Liar Catcher" (anti-hallucination)
- "Why I'm Always Smiling"

### Draft pipeline
- Local-first AI architecture (awaiting approval)
- AI coding journey (longer version)
- Japanese enterprise AI adoption
- HealthPulse deep-dive
- Digital twin voice piece

## Deployment

Push to `main` branch. Vercel auto-deploys.
Manual deploy: `vercel --prod`
