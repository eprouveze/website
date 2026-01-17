import { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { getAllProjects } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'AI tools and software projects built by Emmanuel Prouvèze.',
}

export default function ProjectsPage() {
  const projects = getAllProjects()

  return (
    <section className="py-12 sm:py-16">
      <Container narrow>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
          Projects
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          AI tools and software projects I've built.
        </p>

        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-xl">
            <p className="text-slate-500">Projects coming soon.</p>
          </div>
        )}
      </Container>
    </section>
  )
}
