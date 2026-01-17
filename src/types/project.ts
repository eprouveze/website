export interface ProjectFrontmatter {
  title: string
  description: string
  tech: string[]
  status: 'active' | 'completed' | 'archived'
  url?: string
  github?: string
}

export interface Project extends ProjectFrontmatter {
  slug: string
}

export interface ProjectWithContent extends Project {
  content: React.ReactElement
}
