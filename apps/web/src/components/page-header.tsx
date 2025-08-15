"use client";

import { RefreshCw } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  badgeTitle?: string;
}

export function PageHeader({
  title,
  description,
  badgeTitle,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
        {description}
      </p>
      {/* badge for auto update */}
      {badgeTitle && (
        <div className="flex items-center gap-2 text-sm text-neutral-500 bg-neutral-100/60 px-4 py-2.5 rounded-full border border-neutral-200/50 shadow-sm">
          <RefreshCw className="w-4 h-4 animate-spin text-neutral-400" />
          <span>{badgeTitle}</span>
        </div>
      )}
    </div>
  );
}
