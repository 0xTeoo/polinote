"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarDays, ArrowRight } from "lucide-react";
import { VideoDTO } from "@polinote/schemas";
import { format } from "date-fns-tz";

interface VideoCardProps {
  video: VideoDTO;
  index: number;
}

export function VideoCard({ video, index }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    // Format date only on client side to prevent hydration mismatch
    setFormattedDate(format(new Date(video.publishedAt), "MMM d, yyyy"));
  }, [video.publishedAt]);

  return (
    <Link href={`/videos/${video.id}`} className="block h-full">
      <div
        className={`h-full animate-fade-in`}
        style={{ animationDelay: `${index * 0.1}s` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className="h-full overflow-hidden flex flex-col rounded-2xl shadow-minimal hover:shadow-minimal-lg transition-all duration-500 ease-out border border-neutral-200/50 bg-white/80 backdrop-blur-sm">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={video.thumbnailUrl || "/placeholder.svg"}
              alt={`Thumbnail for ${video.title}`}
              fill
              className={`object-cover transition-transform duration-700 ease-out ${
                isHovered ? "scale-105" : "scale-100"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              key={video.youtubeVideoId}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
              <div
                className={`w-12 h-12 rounded-full bg-white/90 flex items-center justify-center m-4 transition-all duration-300 ease-out ${
                  isHovered ? "scale-110 bg-white" : ""
                }`}
              >
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-blue-600 border-b-8 border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>
          <CardContent className="flex-grow pt-5">
            <div className="flex items-center text-sm text-neutral-500 mb-3">
              <CalendarDays className="h-4 w-4 mr-2" />
              <time dateTime={video.publishedAt}>
                {formattedDate}
              </time>
            </div>
            <h2 className="font-semibold text-neutral-900 mb-3 line-clamp-2 text-lg">
              {video.title}
            </h2>
            <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          </CardContent>
          <CardFooter className="pt-0 pb-5">
            <span
              className={`text-sm font-medium flex items-center gap-1 transition-all duration-300 ease-out ${
                isHovered ? "text-blue-600 gap-2" : "text-neutral-500"
              }`}
            >
              View details
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
