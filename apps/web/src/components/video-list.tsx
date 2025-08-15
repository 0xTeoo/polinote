"use client";

import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { VideoDTO } from "@polinote/schemas";
import { useRouter, useSearchParams } from "next/navigation";
import { VideoCard } from "./video-card";

interface VideoListProps {
  videos: VideoDTO[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export function VideoList({ videos, pagination }: VideoListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";

  const handlePageChange = (page: number) => {
    router.push(`?page=${page}`);
  };

  return (
    <div className="space-y-8">
      <ul
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        )}
      >
        {videos.map((video, index) => (
          <li
            key={video.id}
            className="opacity-0 animate-fade-slide-up"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: "forwards",
            }}
          >
            <VideoCard key={video.id} video={video} index={index} />
          </li>
        ))}
      </ul>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-200 pt-6">
          <div className="text-sm text-neutral-500">
            Showing {pagination.currentPage}-
            {Math.min(pagination.currentPage + 1, pagination.totalPages)} of{" "}
            {videos.length} videos
          </div>
          <Pagination
            currentPage={parseInt(page)}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
