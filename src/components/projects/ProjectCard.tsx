import Link from 'next/link'
import { Project } from '@/types/project'

interface ProjectCardProps {
  project: Project
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  archived: 'bg-slate-100 text-slate-600',
}

const statusLabels = {
  active: 'Active',
  completed: 'Completed',
  archived: 'Archived',
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group">
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="p-6 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
              {project.title}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[project.status]}`}>
              {statusLabels[project.status]}
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4">{project.description}</p>
          {project.tech.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}
