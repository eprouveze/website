import Link from 'next/link'
import { Post } from '@/types/post'
import { formatDate } from '@/lib/mdx'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group">
      <Link href={`/writing/${post.slug}`} className="block">
        <div className="py-6 border-b border-slate-100 group-hover:border-slate-200 transition-colors">
          <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span>&middot;</span>
            <span>{post.readingTime}</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
            {post.title}
          </h3>
          <p className="text-slate-600 leading-relaxed">{post.description}</p>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}
