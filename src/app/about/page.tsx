import { Metadata } from 'next'
import { Container } from '@/components/layout/Container'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about Emmanuel Prouvèze - Enterprise sales leader and AI enthusiast.',
}

export default function AboutPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container narrow>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-6">
          About Me
        </h1>

        <div className="prose prose-slate prose-lg max-w-none">
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Enterprise sales leader with 20+ years of experience in the Japanese technology market.
            I build AI tools as a hobby and write about the intersection of business and technology.
          </p>

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
