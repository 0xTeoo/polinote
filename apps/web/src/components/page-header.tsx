"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <header
      className={cn(
        "mb-10 md:mb-14 transition-all duration-700 ease-out",
        isLoaded ? "opacity-100" : "opacity-0",
      )}
    >
      <h1
        className={`text-3xl md:text-4xl font-semibold text-apple-gray-900 mb-3 transition-all duration-700 ease-out`}
      >
        {title}
      </h1>
      <p
        className={`text-apple-gray-500 max-w-3xl transition-all duration-700 delay-100 ease-out`}
      >
        {description}
      </p>
    </header>
  );
}
