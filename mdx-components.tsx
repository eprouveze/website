import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-8 mb-4">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mt-8 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-2">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-slate-700 leading-7 mb-4">{children}</p>
    ),
    a: ({ href, children }) => {
      const isExternal = href?.startsWith('http')
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
          >
            {children}
          </a>
        )
      }
      return (
        <Link href={href || '#'} className="text-blue-600 hover:text-blue-800 underline underline-offset-2">
          {children}
        </Link>
      )
    },
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-slate-700 mb-4 space-y-1">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-slate-700 mb-4 space-y-1">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-7">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 my-4">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-4 text-sm">
        {children}
      </pre>
    ),
    hr: () => <hr className="border-slate-200 my-8" />,
    strong: ({ children }) => (
      <strong className="font-semibold text-slate-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    ...components,
  }
}
