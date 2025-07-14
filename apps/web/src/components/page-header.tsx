"use client";

import { useState, useEffect } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`text-center mb-12 transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
}
