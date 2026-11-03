import React from 'react';
import { Link2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const handleNavigateHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === '/' && !window.location.search && !window.location.hash) {
      e.preventDefault();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <a
          href="/"
          onClick={handleNavigateHome}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          aria-label="Shawty Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow-xs">
            <Link2 className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900">
            Shawty
          </span>
        </a>

        {/* Navigation Items */}
        <div className="flex items-center">
          <a
            href="/"
            onClick={handleNavigateHome}
            className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-neutral-800 focus:outline-hidden"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
};
