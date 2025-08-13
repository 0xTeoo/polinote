import { getVideos } from "@/actions/get-videos";
import { BriefingList } from "@/components/briefing-list";
import { PageHeader } from "@/components/page-header";
import { getTranslations } from "next-intl/server";

export default async function HomePage({
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page: string }>;
}) {
  const { page } = await searchParams;
  const t = await getTranslations();

  const { items: videos, meta: pagination } = await getVideos(
    parseInt(page) || 1
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <main>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col gap-10 items-center transition-all duration-700 ease-out">
            <PageHeader
              title={t("main.title")}
              description={t("main.description")}
              badgeTitle={t("main.badge.title")}
            />
            <BriefingList briefings={videos} pagination={pagination} />
          </div>
        </div>
      </main>
    </div>
  );
}