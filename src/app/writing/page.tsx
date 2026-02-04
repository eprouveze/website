import { Metadata } from 'next'
import { WritingLayout } from '@/components/blog/WritingLayout'
import { PostCard } from '@/components/blog/PostCard'
import { getAllPosts } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Thoughts on AI, enterprise software, and building tools.',
}

export default function WritingPage() {
  const posts = getAllPosts()

  return (
    <section className="py-12 sm:py-16">
      <WritingLayout>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
          Writing
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Thoughts on AI, enterprise software, and building tools.
        </p>

        {posts.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No posts yet. Check back soon.</p>
        )}
      </WritingLayout>
    </section>
  )
}
