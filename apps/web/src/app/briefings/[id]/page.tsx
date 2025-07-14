import { getSummary } from "@/actions/get-summary";
import { getTranscriptSegments } from "@/actions/get-transcript-segments";
import { getVideo } from "@/actions/get-video";
import { BriefingHeader } from "@/components/briefing-header";
import { ContentColumn } from "@/components/content-column";
import { VideoColumn } from "@/components/video-column";
import { Language } from "@polinote/entities";

interface BriefingPageProps {
  params: {
    id: string;
  };
}

export default async function BriefingPage({ params }: BriefingPageProps) {
  const { id } = await params;
  const video = await getVideo(id);

  const summary = await getSummary(id, Language.KO);
  const transcriptSegments = await getTranscriptSegments(id);

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <BriefingHeader title={video.title} date={video.publishedAt} />

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left column - Video */}
          <div className="lg:col-span-4 xl:col-span-4 mb-8 lg:mb-0">
            <VideoColumn videoId={video.youtubeVideoId} />
          </div>

          {/* Right column - Tabbed content */}
          <div className="lg:col-span-8 xl:col-span-8">
            <ContentColumn
              summary={summary}
              transcriptSegments={transcriptSegments}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
