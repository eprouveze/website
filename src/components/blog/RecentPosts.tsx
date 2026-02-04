import Link from 'next/link'

interface RecentPost {
  slug: string
  title: string
  publishedAt: string
  formattedDate: string
}

interface RecentPostsProps {
  posts: RecentPost[]
}

export function RecentPosts({ posts }: RecentPostsProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <ul className="space-y-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/writing/${post.slug}`}
            className="block group"
          >
            <h4 className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h4>
            <time
              dateTime={post.publishedAt}
              className="text-xs text-slate-500"
            >
              {post.formattedDate}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  )
}
