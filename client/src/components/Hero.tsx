import React from 'react';
import { Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="mx-auto max-w-4xl px-4 pt-12 pb-8 text-center sm:pt-20 sm:pb-10">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-neutral-200/80 bg-neutral-100 px-3.5 py-1 text-xs font-medium text-neutral-700 sm:text-sm">
        <Sparkles className="h-3.5 w-3.5 text-neutral-500" />
        <span>Free forever URL shortener</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl md:leading-[1.12]">
        Shorten links. Expand your reach.
      </h1>

      {/* Supporting Text */}
      <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600 sm:mt-6 sm:text-lg md:text-xl md:leading-relaxed">
        Create short, powerful links in seconds. Track every click and manage your brand with ease.
      </p>
    </section>
  );
};

