import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { WritingLayout } from '@/components/blog/WritingLayout'
import { PostCard } from '@/components/blog/PostCard'
import { getPostsByTag, getAllTags } from '@/lib/mdx'

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map(({ tag }) => ({
    tag: tag.toLowerCase(),
  }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)

  return {
    title: `Posts tagged "${decodedTag}"`,
    description: `Browse all posts tagged with ${decodedTag}.`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const posts = getPostsByTag(decodedTag)

  if (posts.length === 0) {
    notFound()
  }

  const displayTag = posts[0]?.tags.find(
    (t) => t.toLowerCase() === decodedTag.toLowerCase()
  ) || decodedTag

  return (
    <section className="py-12 sm:py-16">
      <WritingLayout activeTag={decodedTag}>
        {/* Breadcrumb */}
        <Link
          href="/writing"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          All posts
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
          Tagged: {displayTag}
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} tagged with "{displayTag}"
        </p>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </WritingLayout>
    </section>
  )
}
