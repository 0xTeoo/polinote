"use client";

import { useState, useEffect } from "react";
import { Play } from "lucide-react";

interface VideoColumnProps {
  videoId: string;
}

export function VideoColumn({ videoId }: VideoColumnProps) {
  const [isClient, setIsClient] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="lg:sticky lg:top-6 animate-slide-up">
      <div
        className="overflow-hidden rounded-2xl shadow-apple transition-all duration-300 ease-out hover:shadow-apple-hover border border-gray-100/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-video bg-black relative overflow-hidden">
          {isClient ? (
            isPlaying ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="White House Press Briefing"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
                  alt="Video thumbnail"
                  className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                    isHovered ? "scale-105" : "scale-100"
                  }`}
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transition-all duration-300 ease-out transform hover:scale-110 hover:bg-white"
                  >
                    <Play
                      className="h-8 w-8 text-apple-blue ml-1"
                      fill="currentColor"
                    />
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="w-full h-full bg-apple-gray-100 flex items-center justify-center">
              <div className="animate-pulse-subtle">
                <svg
                  className="w-10 h-10 text-apple-gray-300"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    opacity="0.2"
                  />
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div className="p-5 bg-white">
          <h2 className="text-lg font-semibold text-apple-gray-900">
            Today's Press Briefing
          </h2>
          <p className="text-sm text-apple-gray-500 mt-1">
            Watch the complete White House press briefing for the latest updates
            and announcements.
          </p>
        </div>
      </div>
    </div>
  );
}
