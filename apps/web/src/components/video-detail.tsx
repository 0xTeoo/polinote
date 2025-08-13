"use client";

import { useState } from "react";
import { ContentTabs } from "@/components/content-tabs";
import { ContentPanel } from "@/components/content-panel";
import { SummaryDTO, TranscriptSegmentDTO } from "@polinote/schemas";
import { VideoPlayer } from "./video-player";

interface VideoDetailProps {
  videoId: string;
  summary: SummaryDTO;
  transcriptSegments: TranscriptSegmentDTO[];
}

export function VideoDetail({
  videoId,
  summary,
  transcriptSegments,
}: VideoDetailProps) {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
      {/* Left column - Video and Tabs */}
      <div className="lg:col-span-5 xl:col-span-5 space-y-6">
        <VideoPlayer videoId={videoId} />
        <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Right column - Content Panel */}
      <div className="lg:col-span-7 xl:col-span-7">
        <ContentPanel
          activeTab={activeTab}
          summary={summary}
          transcriptSegments={transcriptSegments}
        />
      </div>
    </div>
  );
}
