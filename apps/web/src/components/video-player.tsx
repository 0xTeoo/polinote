"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface VideoPlayerProps {
  videoId: string;
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Card className="overflow-hidden shadow-minimal border border-neutral-200/50 bg-white/80 backdrop-blur-sm rounded-2xl">
        <div className="aspect-video bg-neutral-100 rounded-t-2xl flex items-center justify-center">
          <p className="text-neutral-500">Loading video player...</p>
        </div>
        <CardContent className="p-6 bg-white">
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Today&apos;s Press Briefing
          </h2>
          <p className="text-neutral-600 leading-relaxed">Loading video player...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-minimal border border-neutral-200/50 bg-white/80 backdrop-blur-sm rounded-2xl">
      <div className="aspect-video bg-black rounded-t-2xl">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="White House Press Briefing"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <CardContent className="p-6 bg-white">
        <h2 className="text-xl font-semibold text-neutral-900 mb-3">
          Today&apos;s Press Briefing
        </h2>
        <p className="text-neutral-600 leading-relaxed">
          Watch the complete White House press briefing for the latest updates
          and announcements.
        </p>
      </CardContent>
    </Card>
  );
}
