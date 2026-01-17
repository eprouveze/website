# emmanuel.prouveze.fr

Personal portfolio website for Emmanuel Prouvèze.

**Live:** https://emmanuel.prouveze.fr

## Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **Content:** MDX for blog posts and project pages
- **Hosting:** Vercel
- **Analytics:** Vercel Analytics

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Structure

```
content/
  posts/          # Blog posts as MDX
  projects/       # Project pages as MDX
src/
  app/            # Next.js App Router pages
  components/     # React components
  lib/            # Utilities (MDX parsing, etc.)
  types/          # TypeScript types
public/
  images/         # Static images
  resume.pdf      # Resume
```

## Adding Content

**New blog post:**
```bash
# Create content/posts/my-post.mdx
---
title: "Post Title"
description: "Brief description"
publishedAt: "2026-01-17"
tags: ["Tag1", "Tag2"]
---

Content here...
```

**New project:**
```bash
# Create content/projects/my-project.mdx
---
title: "Project Name"
description: "Brief description"
tech: ["Tech1", "Tech2"]
status: "active"
github: "https://github.com/..."
---

Content here...
```

## Deploy

Push to main branch. Vercel auto-deploys.

Or manually: `vercel --prod`
