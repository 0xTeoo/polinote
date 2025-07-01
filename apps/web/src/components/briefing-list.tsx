"use client";

import { BriefingCard } from "@/components/briefing-card";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { BriefingForList, PaginationMeta } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

interface BriefingListProps {
  briefings: BriefingForList[];
  pagination: PaginationMeta;
}

export function BriefingList({ briefings, pagination }: BriefingListProps) {
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
        {briefings.map((briefing, index) => (
          <li
            key={briefing.id}
            className="opacity-0 animate-fade-slide-up"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: "forwards",
            }}
          >
            <BriefingCard key={briefing.id} briefing={briefing} index={index} />
          </li>
        ))}
      </ul>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
          <div className="text-sm text-gray-500">
            Showing {pagination.currentPage}-
            {Math.min(pagination.currentPage + 1, pagination.totalPages)} of{" "}
            {briefings.length} briefings
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
