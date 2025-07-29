import { getVideos } from "@/actions/get-videos";
import { BriefingList } from "@/components/briefing-list";
import { PageHeader } from "@/components/page-header";

export default async function HomePage({
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page: string }>;
}) {
  const { page } = await searchParams;
  
  const { items: videos, meta: pagination } = await getVideos(
    parseInt(page) || 1
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <main>
        <div className="container mx-auto px-4 py-12">
          <div className={`transition-all duration-700 ease-out`}>
            <PageHeader
              title="Political Intelligence Platform"
              description="AI-powered analysis of political videos, transforming hours of content into actionable insights"
            />
            <BriefingList briefings={videos} pagination={pagination} />
          </div>
        </div>
      </main>
    </div>
  );
}
