import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  function getVisiblePages(current: number, total: number) {
    if (total <= 7) return pages;

    if (current <= 4) {
      return [...pages.slice(0, 5), -1, total];
    }

    if (current >= total - 3) {
      return [1, -1, ...pages.slice(total - 5)];
    }

    return [1, -1, current - 1, current, current + 1, -1, total];
  }

  return (
    <nav
      className={cn("flex items-center justify-center space-x-2", className)}
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 h-9 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-50"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-1">
        {visiblePages.map((pageNum, idx) =>
          pageNum === -1 ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                currentPage === pageNum
                  ? "bg-apple-blue text-white hover:bg-apple-blue/90"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
              aria-current={currentPage === pageNum ? "page" : undefined}
            >
              {pageNum}
            </button>
          )
        )}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 h-9 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-50"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
