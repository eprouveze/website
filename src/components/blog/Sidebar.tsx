'use client'

import { useState } from 'react'
import { TagCloud } from './TagCloud'
import { RecentPosts } from './RecentPosts'

interface RecentPost {
  slug: string
  title: string
  publishedAt: string
  formattedDate: string
}

interface SidebarProps {
  tags: { tag: string; count: number }[]
  recentPosts: RecentPost[]
  activeTag?: string
}

export function Sidebar({ tags, recentPosts, activeTag }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const sidebarContent = (
    <>
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
          Topics
        </h3>
        <TagCloud tags={tags} activeTag={activeTag} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
          Recent Posts
        </h3>
        <RecentPosts posts={recentPosts} />
      </div>
    </>
  )

  return (
    <>
      {/* Mobile: Collapsible */}
      <div className="lg:hidden mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <span>Topics & Recent Posts</span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        {isOpen && (
          <div className="mt-4 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            {sidebarContent}
          </div>
        )}
      </div>

      {/* Desktop: Sticky sidebar */}
      <aside className="hidden lg:block lg:sticky lg:top-24">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          {sidebarContent}
        </div>
      </aside>
    </>
  )
}
