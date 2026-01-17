import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { Post, PostFrontmatter, PostWithContent } from '@/types/post'
import { Project, ProjectFrontmatter, ProjectWithContent } from '@/types/project'

const postsDirectory = path.join(process.cwd(), 'content/posts')
const projectsDirectory = path.join(process.cwd(), 'content/projects')

function ensureDirectory(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function getAllPosts(): Post[] {
  ensureDirectory(postsDirectory)

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      const frontmatter = data as PostFrontmatter

      return {
        slug,
        title: frontmatter.title,
        description: frontmatter.description,
        publishedAt: frontmatter.publishedAt,
        tags: frontmatter.tags || [],
        readingTime: readingTime(content).text,
      }
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return posts
}

export async function getPostBySlug(slug: string): Promise<PostWithContent | null> {
  ensureDirectory(postsDirectory)

  const fullPath = path.join(postsDirectory, `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content: rawContent } = matter(fileContents)
  const frontmatter = data as PostFrontmatter

  const { content } = await compileMDX({
    source: rawContent,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
      },
    },
  })

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    publishedAt: frontmatter.publishedAt,
    tags: frontmatter.tags || [],
    readingTime: readingTime(rawContent).text,
    content,
  }
}

export function getAllProjects(): Project[] {
  ensureDirectory(projectsDirectory)

  const fileNames = fs.readdirSync(projectsDirectory)
  const projects = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(projectsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      const frontmatter = data as ProjectFrontmatter

      return {
        slug,
        title: frontmatter.title,
        description: frontmatter.description,
        tech: frontmatter.tech || [],
        status: frontmatter.status,
        url: frontmatter.url,
        github: frontmatter.github,
      }
    })

  return projects
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithContent | null> {
  ensureDirectory(projectsDirectory)

  const fullPath = path.join(projectsDirectory, `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content: rawContent } = matter(fileContents)
  const frontmatter = data as ProjectFrontmatter

  const { content } = await compileMDX({
    source: rawContent,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
      },
    },
  })

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    tech: frontmatter.tech || [],
    status: frontmatter.status,
    url: frontmatter.url,
    github: frontmatter.github,
    content,
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
