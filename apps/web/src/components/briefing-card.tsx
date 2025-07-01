"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarDays, ArrowRight } from "lucide-react";
import { BriefingForList } from "@/types";
import { format } from "date-fns-tz";

interface BriefingCardProps {
  briefing: BriefingForList;
  index: number;
}

export function BriefingCard({ briefing, index }: BriefingCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/briefings/${briefing.id}`} className="block h-full">
      <div
        className={`h-full animate-fade-in`}
        style={{ animationDelay: `${index * 0.1}s` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className="h-full overflow-hidden flex flex-col rounded-2xl shadow-apple hover:shadow-apple-hover transition-all duration-500 ease-out border border-gray-100/50">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={briefing.thumbnailUrl || "/placeholder.svg"}
              alt={`Thumbnail for ${briefing.title}`}
              fill
              className={`object-cover transition-transform duration-700 ease-out ${
                isHovered ? "scale-105" : "scale-100"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
              <div
                className={`w-12 h-12 rounded-full bg-white/90 flex items-center justify-center m-4 transition-all duration-300 ease-out ${
                  isHovered ? "scale-110 bg-white" : ""
                }`}
              >
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-apple-blue border-b-8 border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>
          <CardContent className="flex-grow pt-5">
            <div className="flex items-center text-sm text-apple-gray-500 mb-2">
              <CalendarDays className="h-4 w-4 mr-1" />
              <time dateTime={briefing.publishedAt}>
                {format(new Date(briefing.publishedAt), "MMM d, yyyy")}
              </time>
            </div>
            <h2 className="font-semibold text-apple-gray-900 mb-2 line-clamp-2">
              {briefing.title}
            </h2>
            <p className="text-sm text-apple-gray-600 line-clamp-2">
              {briefing.description}
            </p>
          </CardContent>
          <CardFooter className="pt-0 pb-5">
            <span
              className={`text-sm font-medium flex items-center gap-1 transition-all duration-300 ease-out ${
                isHovered ? "text-apple-blue gap-2" : "text-apple-gray-600"
              }`}
            >
              View briefing details
              <ArrowRight
                className={`h-3.5 w-3.5 transition-all duration-300 ease-out ${
                  isHovered ? "translate-x-1 opacity-100" : "opacity-0"
                }`}
              />
            </span>
          </CardFooter>
        </Card>
      </div>
    </Link>
  );
}
