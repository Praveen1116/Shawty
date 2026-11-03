import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-7 shadow-xs transition-all hover:border-neutral-300">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold tracking-tight text-neutral-900">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-neutral-600">
        {description}
      </p>
    </div>
  );
};

