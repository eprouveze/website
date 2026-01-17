import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { PostCard } from '@/components/blog/PostCard'
import { getAllPosts } from '@/lib/mdx'

export default function Home() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <Container narrow>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
            <Image
              src="/images/headshot.jpg"
              alt="Emmanuel Prouvèze"
              width={160}
              height={160}
              className="rounded-full object-cover w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0"
              priority
            />
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-4 text-center sm:text-left">
                Emmanuel Prouvèze
              </h1>
              <p className="text-xl sm:text-2xl text-slate-600 leading-relaxed text-center sm:text-left">
                Global Account Manager at Salesforce Japan. 20+ years in Japanese tech. Co-founder with exit. I build AI tools as a hobby.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Learn more about me
            </Link>
            <Link
              href="/writing"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Read my writing
            </Link>
          </div>
        </Container>
      </section>

      {/* Recent Posts Section */}
      {posts.length > 0 && (
        <section className="py-12 bg-slate-50">
          <Container narrow>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Recent Writing</h2>
              <Link
                href="/writing"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                View all &rarr;
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-6">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
