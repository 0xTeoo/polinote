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
      <Card className="overflow-hidden shadow-md">
        <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
          <p className="text-gray-500">Loading video player...</p>
        </div>
        <CardContent className="p-4 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">
            Today's Press Briefing
          </h2>
          <p className="text-sm text-gray-600 mt-1">Loading video player...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-md">
      <div className="aspect-video bg-black rounded-t-lg">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="White House Press Briefing"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <CardContent className="p-4 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">
          Today's Press Briefing
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Watch the complete White House press briefing for the latest updates
          and announcements.
        </p>
      </CardContent>
    </Card>
  );
}
