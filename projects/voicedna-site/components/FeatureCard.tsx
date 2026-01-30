import {
  ClipboardList,
  Microscope,
  Settings,
  Rocket,
  Gift,
  type LucideIcon
} from 'lucide-react';

interface FeatureCardProps {
  icon: string;
  title: string;
  items: string[];
}

// Map icon strings to Lucide components
const iconMap: Record<string, LucideIcon> = {
  'clipboard-list': ClipboardList,
  'microscope': Microscope,
  'settings': Settings,
  'rocket': Rocket,
  'gift': Gift,
};

export default function FeatureCard({ icon, title, items }: FeatureCardProps) {
  const IconComponent = iconMap[icon] || ClipboardList;

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md">
      {/* Icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
        <IconComponent className="h-6 w-6" />
      </div>

      {/* Title */}
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>

      {/* Items List */}
      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Pre-configured feature cards based on the sales page content
export const featureCardData = [
  {
    icon: 'clipboard-list',
    title: 'Stage 1: Golden Corpus Generator',
    items: [
      'Context Discovery Questionnaire',
      'Sample Collection Guide (what to gather, where to find it)',
      'Organization Template',
      'Quality Checklist',
    ],
  },
  {
    icon: 'microscope',
    title: 'Stage 2: Master Extraction Prompt',
    items: [
      'Forensic Linguist analysis prompt',
      'Extracts 6 Voice DNA dimensions',
      'Works for any language combination',
    ],
  },
  {
    icon: 'settings',
    title: 'Stage 3: Universal Meta-Prompt',
    items: [
      'Generates your Master Voice Guide (~15,000 words)',
      'Creates your Runtime Execution Block (~5,000 tokens)',
      'Auto-detect protocol included',
    ],
  },
  {
    icon: 'rocket',
    title: 'Stage 4: Deployment Guides',
    items: [
      'ChatGPT Custom GPT setup (step-by-step)',
      'Claude Project setup',
      'Gemini Gem setup',
      'Manual/API usage guide',
      'Testing & troubleshooting checklist',
    ],
  },
  {
    icon: 'gift',
    title: 'Bonuses',
    items: [
      'Real anonymized example corpus',
      'Sample Voice DNA output for reference',
      'Iteration workflow guide',
      'Video walkthrough (30 min)',
    ],
  },
];
