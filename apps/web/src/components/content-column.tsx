"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FileText, FileDigit } from "lucide-react";
import { Markdown } from "@/components/ui/markdown";
import { SummaryDTO, TranscriptSegmentDTO } from "@polinote/schemas";

interface ContentColumnProps {
  summary: SummaryDTO;
  transcriptSegments: TranscriptSegmentDTO[];
}

export function ContentColumn({
  summary,
  transcriptSegments,
}: ContentColumnProps) {
  const [activeTab, setActiveTab] = useState("summary");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <Tabs
        defaultValue="summary"
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <div className="flex justify-center mb-8">
          <TabsList className="bg-white/80 p-1 rounded-2xl backdrop-blur-sm border border-neutral-200/60 shadow-sm">
            <TabsTrigger
              value="summary"
              className="px-6 py-2.5 text-sm font-medium relative overflow-hidden rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-neutral-200/60 data-[state=inactive]:text-neutral-600 data-[state=inactive]:bg-transparent hover:text-neutral-900 hover:bg-neutral-50/50"
            >
              <div className="flex items-center gap-2.5 relative z-10">
                <FileDigit
                  className={`h-4 w-4 transition-all duration-300 ${
                    activeTab === "summary"
                      ? "text-blue-600"
                      : "text-neutral-500"
                  }`}
                />
                <span>Summary</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="transcript"
              className="px-6 py-2.5 text-sm font-medium relative overflow-hidden rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-neutral-200/60 data-[state=inactive]:text-neutral-600 data-[state=inactive]:bg-transparent hover:text-neutral-900 hover:bg-neutral-50/50"
            >
              <div className="flex items-center gap-2.5 relative z-10">
                <FileText
                  className={`h-4 w-4 transition-all duration-300 ${
                    activeTab === "transcript"
                      ? "text-blue-600"
                      : "text-neutral-500"
                  }`}
                />
                <span>Transcript</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="summary" className="mt-0">
          <Card className="rounded-3xl shadow-minimal border border-neutral-200/50 bg-white/80 backdrop-blur-sm">
            <div className="p-8">
              <div className="max-h-[70vh] overflow-y-auto pr-6">
                <div className="prose prose-neutral max-w-none">
                  <Markdown content={summary.content} />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="transcript" className="mt-0">
          <Card className="rounded-3xl shadow-minimal border border-neutral-200/50 bg-white/80 backdrop-blur-sm transition-all duration-500">
            <div className="p-8">
              <div className="max-h-[70vh] overflow-y-auto pr-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">
                    Full Transcript
                  </h2>
                </div>
                <div className="space-y-4">
                  {(() => {
                    // 세그먼트들을 연결하여 더 자연스러운 문단으로 만들기
                    const groupedSegments: Array<{
                      startTime: number;
                      endTime: number;
                      text: string;
                      segments: TranscriptSegmentDTO[];
                    }> = [];

                    let currentGroup: {
                      startTime: number;
                      endTime: number;
                      text: string;
                      segments: TranscriptSegmentDTO[];
                    } | null = null;

                    transcriptSegments.forEach((segment) => {
                      const segmentText = segment.text.trim();
                      const isShortSegment = segmentText.length < 50; // 50자 미만은 짧은 세그먼트
                      const endsWithPunctuation = /[.!?]/.test(
                        segmentText.slice(-1)
                      );

                      if (!currentGroup) {
                        // 새로운 그룹 시작
                        currentGroup = {
                          startTime: segment.start,
                          endTime: segment.end,
                          text: segmentText,
                          segments: [segment],
                        };
                      } else if (
                        isShortSegment &&
                        !endsWithPunctuation &&
                        currentGroup.segments.length < 3
                      ) {
                        // 짧은 세그먼트이고 문장이 끝나지 않았고, 그룹이 3개 미만이면 연결
                        currentGroup.text += " " + segmentText;
                        currentGroup.endTime = segment.end;
                        currentGroup.segments.push(segment);
                      } else {
                        // 현재 그룹 완료하고 새 그룹 시작
                        groupedSegments.push(currentGroup);
                        currentGroup = {
                          startTime: segment.start,
                          endTime: segment.end,
                          text: segmentText,
                          segments: [segment],
                        };
                      }
                    });

                    // 마지막 그룹 추가
                    if (currentGroup) {
                      groupedSegments.push(currentGroup);
                    }

                    return groupedSegments.map((group, index) => {
                      const startMinutes = Math.floor(group.startTime / 60);
                      const startSeconds = Math.floor(group.startTime % 60);
                      const endMinutes = Math.floor(group.endTime / 60);
                      const endSeconds = Math.floor(group.endTime % 60);

                      const formatTime = (minutes: number, seconds: number) => {
                        return `${minutes.toString().padStart(2, "0")}:${seconds
                          .toString()
                          .padStart(2, "0")}`;
                      };

                      return (
                        <div
                          key={`group-${index}`}
                          className="opacity-0 animate-fade-in-up group hover:bg-neutral-50/50 rounded-lg transition-all duration-300"
                          style={{
                            animationDelay: `${index * 0.05}s`,
                            animationFillMode: "forwards",
                          }}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="text-xs text-neutral-400 font-mono flex-shrink-0 bg-neutral-100 px-2 mt-2 rounded">
                              {formatTime(startMinutes, startSeconds)} -{" "}
                              {formatTime(endMinutes, endSeconds)}
                            </div>
                            <div className="flex-1">
                              <p className="text-base leading-7 text-neutral-800 font-normal">
                                {group.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}

                  {transcriptSegments.length === 0 && (
                    <div className="text-center py-16">
                      <div className="text-neutral-500 text-base">
                        No transcript segments available
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
