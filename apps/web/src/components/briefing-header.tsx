"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns-tz";

interface BriefingHeaderProps {
  title: string;
  date: string;
}

export function BriefingHeader({ title, date }: BriefingHeaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <Link href="/" className="inline-block mb-8">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all briefings
        </Button>
      </Link>

      <div className="border-b border-neutral-200 pb-6 mb-8">
        <h1
          className={`text-3xl md:text-4xl font-bold text-neutral-900 mb-3 transition-all duration-500 ease-out tracking-tight ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {title}
        </h1>
        <p
          className={`text-neutral-500 text-lg transition-all duration-500 delay-100 ease-out ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {format(new Date(date), "MMMM d, yyyy")}
        </p>
      </div>
    </div>
  );
}
