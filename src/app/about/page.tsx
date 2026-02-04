import { Metadata } from 'next'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about Emmanuel Prouvèze - Enterprise sales leader and AI enthusiast.',
}

export default function AboutPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
          <Image
            src="/images/headshot.jpg"
            alt="Emmanuel Prouvèze"
            width={200}
            height={200}
            className="rounded-full object-cover w-40 h-40 sm:w-48 sm:h-48 flex-shrink-0"
            priority
          />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4 text-center sm:text-left">
              About Me
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed text-center sm:text-left">
              Enterprise sales leader with 20+ years of experience in the Japanese technology market.
              I build AI tools as a hobby and write about the intersection of business and technology.
            </p>
          </div>
        </div>

        <div className="prose prose-slate prose-lg max-w-none">

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Background</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            I've spent my career helping technology companies grow in Japan, one of the world's most
            sophisticated and demanding enterprise markets. This experience has taught me the
            importance of understanding both the technical details and the business context.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Current Focus</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Today, I'm particularly interested in how AI can transform enterprise software.
            I build tools that demonstrate practical applications of AI in business contexts,
            from sales forecasting to document analysis.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Writing</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            I write about AI, enterprise software, and the lessons learned from building tools.
            My posts tend to be technical and practical, focused on what actually works rather
            than theoretical possibilities.
          </p>
        </div>
      </Container>
    </section>
  )
}
