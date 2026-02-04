import Link from 'next/link'

interface TagCloudProps {
  tags: { tag: string; count: number }[]
  activeTag?: string
}

export function TagCloud({ tags, activeTag }: TagCloudProps) {
  if (tags.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(({ tag, count }) => {
        const isActive = activeTag?.toLowerCase() === tag.toLowerCase()
        return (
          <Link
            key={tag}
            href={`/writing/tags/${encodeURIComponent(tag.toLowerCase())}`}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
              isActive
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {tag} ({count})
          </Link>
        )
      })}
    </div>
  )
}
