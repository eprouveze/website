import Link from 'next/link';

const RESOURCES = [
  {
    slug: 'voice-assessment',
    title: 'Voice Profile Self-Assessment',
    description: 'Discover how well AI captures your writing voice with this 10-question diagnostic.',
    audience: 'Anyone using AI for writing',
    icon: '📋',
  },
  {
    slug: 'ai-prompts',
    title: '10 Prompts to Test Your AI\'s Voice',
    description: 'Copy-paste prompts that instantly reveal whether your AI sounds like you.',
    audience: 'ChatGPT/Claude users',
    icon: '💬',
  },
  {
    slug: 'multilingual-checklist',
    title: 'Multilingual AI Writing Checklist',
    description: 'Ensure consistent voice across languages with this comprehensive checklist.',
    audience: 'Bilingual professionals',
    icon: '🌍',
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white">
              My Voice Twin
            </Link>
            <Link
              href="/signup"
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white sm:text-5xl mb-4">
            Free Resources
          </h1>
          <p className="text-xl text-gray-300">
            Tools and guides to help you get better results from AI writing assistants.
          </p>
        </div>

        {/* Resource Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESOURCES.map((resource) => (
            <Link
              key={resource.slug}
              href={`/resources/${resource.slug}`}
              className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/50 hover:bg-white/15 transition-all"
            >
              <div className="text-4xl mb-4">{resource.icon}</div>
              <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                {resource.title}
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                {resource.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-400">
                  For: {resource.audience}
                </span>
                <span className="text-purple-400 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Build Your Voice Twin?
            </h2>
            <p className="text-gray-300 mb-6">
              Create a free account to start building an AI that actually sounds like you.
            </p>
            <Link
              href="/signup"
              className="inline-block rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold text-white hover:from-purple-600 hover:to-pink-600"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
