import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 sm:mt-28 border-t border-neutral-100 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-xs text-neutral-500">
          © {new Date().getFullYear()} Shawty. Fast, reliable, and minimal URL shortening.
        </p>

        <div className="flex items-center gap-6 text-xs text-neutral-500">
          <a
            href="#privacy"
            onClick={(e) => e.preventDefault()}
            className="hover:text-neutral-900 transition-colors"
          >
            Privacy
          </a>
          <a
            href="#terms"
            onClick={(e) => e.preventDefault()}
            className="hover:text-neutral-900 transition-colors"
          >
            Terms
          </a>
          <a
            href="#api"
            onClick={(e) => e.preventDefault()}
            className="hover:text-neutral-900 transition-colors"
          >
            API
          </a>
        </div>
      </div>
    </footer>
  );
};

