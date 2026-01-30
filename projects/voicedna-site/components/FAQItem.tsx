'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export default function FAQItem({
  question,
  answer,
  defaultOpen = false
}: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-sm"
        aria-expanded={isOpen}
      >
        <span className="pr-4 text-base font-medium text-gray-900 group-hover:text-blue-600">
          {question}
        </span>
        <span className="flex-shrink-0">
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transition-transform duration-300 ease-out ${
              isOpen ? 'rotate-180 text-blue-600' : ''
            }`}
          />
        </span>
      </button>

      {/* Animated Answer Section */}
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-5 pr-12">
            <p className="text-sm leading-relaxed text-gray-600">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// FAQ Accordion Container Component
interface FAQAccordionProps {
  items: Array<{ question: string; answer: string }>;
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white px-6">
      {items.map((item, index) => (
        <FAQItem
          key={index}
          question={item.question}
          answer={item.answer}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  );
}

// Pre-configured FAQ data based on the sales page content
export const faqData = [
  {
    question: 'How is this different from prompt packs?',
    answer:
      'Prompt packs give you generic templates. VoiceDNA gives you a complete system to clone your specific voice. The output is customized to your sentence rhythm, your transitions, your cultural context—not generic "professional" writing.',
  },
  {
    question: 'Do I need technical skills?',
    answer:
      'No. If you can copy-paste and follow instructions, you can use VoiceDNA. The video walkthrough shows every step.',
  },
  {
    question: 'Which AI platforms does this work with?',
    answer:
      'All of them. We include specific guides for ChatGPT (Custom GPTs), Claude (Projects), and Gemini (Gems). The Runtime Block works with any LLM, including API usage.',
  },
  {
    question: 'How long does setup take?',
    answer:
      'Collecting samples takes 1-2 hours (one-time). Running extraction takes 30-60 minutes. Deploying takes 10-15 minutes. Total: About 3 hours for a system you\'ll use daily.',
  },
  {
    question: 'What if I only speak one language?',
    answer:
      'VoiceDNA works great for single-language users too. You\'ll get voice consistency across different contexts (email vs Slack vs documents) even in one language.',
  },
  {
    question: 'What if it doesn\'t work for me?',
    answer:
      'We offer a 14-day satisfaction guarantee. If VoiceDNA doesn\'t help you create a Digital Twin that sounds like you, email us for a full refund.',
  },
  {
    question: 'Do I need ChatGPT Plus / Claude Pro?',
    answer:
      'The system works best with a paid AI subscription ($20/mo) that allows custom instructions. However, we include a "Manual Mode" guide that works with any AI, including free tiers.',
  },
];
