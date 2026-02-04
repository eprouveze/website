import { Container } from '@/components/layout/Container'
import { Sidebar } from './Sidebar'
import { getAllTags, getRecentPosts, formatDate } from '@/lib/mdx'

interface WritingLayoutProps {
  children: React.ReactNode
  currentSlug?: string
  activeTag?: string
}

export function WritingLayout({ children, currentSlug, activeTag }: WritingLayoutProps) {
  const tags = getAllTags()
  const recentPosts = getRecentPosts(5, currentSlug).map((post) => ({
    slug: post.slug,
    title: post.title,
    publishedAt: post.publishedAt,
    formattedDate: formatDate(post.publishedAt),
  }))

  return (
    <Container>
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <main className="lg:col-span-8">
          {children}
        </main>
        <div className="lg:col-span-4">
          <Sidebar
            tags={tags}
            recentPosts={recentPosts}
            activeTag={activeTag}
          />
        </div>
      </div>
    </Container>
  )
}
