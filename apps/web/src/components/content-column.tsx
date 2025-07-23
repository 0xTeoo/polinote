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
          <TabsList className="bg-neutral-100/60 p-1 rounded-2xl backdrop-blur-sm border border-neutral-200/50">
            <TabsTrigger
              value="summary"
              className="px-6 py-2.5 text-sm font-medium relative overflow-hidden rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-minimal data-[state=inactive]:text-neutral-600 hover:text-neutral-900"
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
              className="px-6 py-2.5 text-sm font-medium relative overflow-hidden rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-minimal data-[state=inactive]:text-neutral-600 hover:text-neutral-900"
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
              <div className="max-h-[70vh] overflow-y-auto pr-6 space-y-12">
                {/* Overview Section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                    <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">
                      Overview
                    </h2>
                  </div>
                  <div className="pl-5">
                    <div className="prose prose-neutral max-w-none">
                      <Markdown content={summary.overview} />
                    </div>
                  </div>
                </section>

                {/* Key Points Section */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                    <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">
                      Key Points
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Introduction */}
                    <div className="bg-neutral-50/50 rounded-2xl p-6 border border-neutral-200/50">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-lg text-xs">
                          01
                        </span>
                        <h3 className="text-xl font-semibold text-neutral-900">
                          Introduction
                        </h3>
                      </div>
                      <div className="prose prose-neutral max-w-none">
                        <Markdown content={summary.keySections.introduction} />
                      </div>
                    </div>

                    {/* Main Points */}
                    <div className="bg-neutral-50/50 rounded-2xl p-6 border border-neutral-200/50">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-lg text-xs">
                          02
                        </span>
                        <h3 className="text-xl font-semibold text-neutral-900">
                          Main Points
                        </h3>
                      </div>
                      <ul className="space-y-5">
                        {summary.keySections.mainPoints.map((point, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-4"
                            style={{
                              animationDelay: `${index * 0.1}s`,
                            }}
                          >
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex-shrink-0 mt-0.5">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <div className="flex-1 prose prose-neutral max-w-none">
                              <Markdown content={point} />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Conclusion */}
                    <div className="bg-neutral-50/50 rounded-2xl p-6 border border-neutral-200/50">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-lg text-xs">
                          03
                        </span>
                        <h3 className="text-xl font-semibold text-neutral-900">
                          Conclusion
                        </h3>
                      </div>
                      <div className="prose prose-neutral max-w-none">
                        <Markdown content={summary.keySections.conclusion} />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Analysis Section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                    <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">
                      Analysis
                    </h2>
                  </div>
                  <div className="pl-5">
                    <div className="prose prose-neutral max-w-none">
                      <Markdown content={summary.analysis} />
                    </div>
                  </div>
                </section>
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
