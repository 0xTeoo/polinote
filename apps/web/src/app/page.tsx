import { BriefingList } from "@/components/briefing-list";
import { PageHeader } from "@/components/page-header";
import { getVideos } from "../actions/get-videos";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const { page } = await searchParams;

  const { items: videos, meta: pagination } = await getVideos(
    parseInt(page) || 1
  );

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-12">
        <div className={`transition-all duration-700 ease-out`}>
          <PageHeader
            title="White House Press Briefings"
            description="Watch and read summaries of the latest White House press briefings"
          />
          <BriefingList briefings={videos} pagination={pagination} />
        </div>
      </div>
    </main>
  );
}
