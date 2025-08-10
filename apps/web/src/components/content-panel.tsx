"use client";

import { Card } from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import { SummaryDTO, TranscriptSegmentDTO } from "@polinote/schemas";

interface ContentPanelProps {
  activeTab: string;
  summary: SummaryDTO;
  transcriptSegments: TranscriptSegmentDTO[];
}

export function ContentPanel({
  activeTab,
  summary,
  transcriptSegments,
}: ContentPanelProps) {
  return (
    <Card className="rounded-2xl shadow-md border border-gray-200 bg-white h-full">
      <div className="p-8">
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-6">
          {activeTab === "summary" ? (
            <div className="prose prose-gray max-w-none">
              <Markdown content={summary.content} />
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1 h-6 bg-blue-400 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Full Transcript
                </h2>
              </div>
              <div className="space-y-4">
                {(() => {
                  const groupedSegments: Array<{
                    startTime: number;
                    endTime: number;
                    text: string;
                    segments: TranscriptSegmentDTO[];
                  }> = [];

                  let currentGroup = {
                    startTime: 0,
                    endTime: 0,
                    text: "",
                    segments: [] as TranscriptSegmentDTO[],
                    wordCount: 0,
                  };

                  transcriptSegments.forEach((segment) => {
                    const segmentText = segment.text.trim();
                    const wordCount = segmentText.split(" ").length;

                    if (currentGroup.segments.length === 0) {
                      // 새로운 그룹 시작
                      currentGroup = {
                        startTime: segment.start,
                        endTime: segment.end,
                        text: segmentText,
                        segments: [segment],
                        wordCount: wordCount,
                      };
                    } else {
                      // 그룹화 조건:
                      // 1. 현재 그룹의 단어 수가 50개 미만이고
                      // 2. 문장이 끝나지 않았거나 (마침표, 느낌표, 물음표가 없음)
                      // 3. 세그먼트가 5개 미만이면 계속 추가
                      const endsWithPunctuation = /[.!?]/.test(
                        segmentText.slice(-1)
                      );
                      const isShortSegment = wordCount < 15;
                      const shouldContinue =
                        currentGroup.wordCount < 50 &&
                        currentGroup.segments.length < 5 &&
                        (!endsWithPunctuation || isShortSegment);

                      if (shouldContinue) {
                        currentGroup.text += " " + segmentText;
                        currentGroup.endTime = segment.end;
                        currentGroup.segments.push(segment);
                        currentGroup.wordCount += wordCount;
                      } else {
                        // 현재 그룹 완료하고 새 그룹 시작
                        groupedSegments.push({
                          startTime: currentGroup.startTime,
                          endTime: currentGroup.endTime,
                          text: currentGroup.text,
                          segments: currentGroup.segments,
                        });

                        currentGroup = {
                          startTime: segment.start,
                          endTime: segment.end,
                          text: segmentText,
                          segments: [segment],
                          wordCount: wordCount,
                        };
                      }
                    }
                  });

                  // 마지막 그룹 추가
                  if (currentGroup.segments.length > 0) {
                    groupedSegments.push({
                      startTime: currentGroup.startTime,
                      endTime: currentGroup.endTime,
                      text: currentGroup.text,
                      segments: currentGroup.segments,
                    });
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
                        className="group hover:bg-blue-50/50 rounded-lg transition-all duration-200 p-4 border border-transparent hover:border-blue-100"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                            {formatTime(startMinutes, startSeconds)} -{" "}
                            {formatTime(endMinutes, endSeconds)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-base leading-7 text-gray-800">
                            {group.text}
                          </p>
                        </div>
                      </div>
                    );
                  });
                })()}

                {transcriptSegments.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-gray-500 text-base">
                      No transcript segments available
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
