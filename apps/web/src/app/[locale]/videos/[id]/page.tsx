import { getSummary } from "@/actions/get-summary";
import { getTranscriptSegments } from "@/actions/get-transcript-segments";
import { getVideo } from "@/actions/get-video";
import { VideoDetail } from "@/components/video-detail";
import { Language } from "@polinote/schemas";
import { getLocale } from "next-intl/server";

export default async function BriefingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const currentLocale = await getLocale();

  const video = await getVideo(id);
  const summary = await getSummary(id, currentLocale as Language);
  const transcriptSegments = await getTranscriptSegments(id);

  return (
    <div className="min-h-screen bg-neutral-50">
      <main>
        <div className="container mx-auto px-4 py-8">
          <VideoDetail
            videoId={video.youtubeVideoId}
            summary={summary}
            transcriptSegments={transcriptSegments}
          />
        </div>
      </main>
    </div>
  );
}
