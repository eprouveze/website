export interface PostFrontmatter {
  title: string
  description: string
  publishedAt: string
  tags: string[]
}

export interface Post extends PostFrontmatter {
  slug: string
  readingTime: string
}

export interface PostWithContent extends Post {
  content: React.ReactElement
}
