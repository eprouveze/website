'use client';

import { useState, useEffect } from 'react';
import { Dna } from 'lucide-react';

interface HeaderProps {
  ctaHref?: string;
}

export default function Header({ ctaHref = '#pricing' }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href) {
      window.location.href = href;
    }
  };

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
        }
      `}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <a
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Dna className={`h-8 w-8 ${isScrolled ? 'text-blue-600' : 'text-blue-500'}`} />
            <span
              className={`
                text-xl font-bold tracking-tight
                ${isScrolled ? 'text-gray-900' : 'text-gray-900'}
              `}
            >
              VoiceDNA
            </span>
          </a>

          {/* CTA Button */}
          <a
            href={ctaHref}
            onClick={scrollToSection}
            className={`
              inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${isScrolled
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            Get VoiceDNA
          </a>
        </div>
      </div>
    </header>
  );
}
