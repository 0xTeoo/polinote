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
      <Link href="/" className="inline-block mb-6">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full border border-apple-gray-200 hover:bg-apple-gray-100 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all briefings
        </Button>
      </Link>

      <div className="border-b border-apple-gray-200 pb-4 mb-8">
        <h1
          className={`text-2xl md:text-3xl font-semibold text-apple-gray-900 mb-2 transition-all duration-500 ease-out ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {title}
        </h1>
        <p
          className={`text-apple-gray-500 transition-all duration-500 delay-100 ease-out ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {format(new Date(date), "MMMM d, yyyy")}
        </p>
      </div>
    </div>
  );
}
