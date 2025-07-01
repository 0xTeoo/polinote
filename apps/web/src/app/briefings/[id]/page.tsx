import { VideoColumn } from "@/components/video-column";
import { ContentColumn } from "@/components/content-column";
import { BriefingHeader } from "@/components/briefing-header";
import { getBriefingById } from "@/app/actions/get-briefing-by-id";

interface BriefingPageProps {
  params: {
    id: string;
  };
}

export default async function BriefingPage({ params }: BriefingPageProps) {
  const { id } = await params;
  const briefing = await getBriefingById(id);

  return (
    <main className="min-h-screen bg-apple-gray-50">
      <div className="container mx-auto px-4 py-8">
        <BriefingHeader title={briefing.title} date={briefing.publishedAt} />

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left column - Video */}
          <div className="lg:col-span-4 xl:col-span-4 mb-8 lg:mb-0">
            <VideoColumn videoId={briefing.youtubeVideoId} />
          </div>

          {/* Right column - Tabbed content */}
          <div className="lg:col-span-8 xl:col-span-8">
            <ContentColumn
              summary={briefing.summaries[0]}
              transcript={briefing.transcript}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
