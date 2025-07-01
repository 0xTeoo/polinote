"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FileText, FileDigit } from "lucide-react";

interface Summary {
  overview: string;
  keyPoints: string[];
  analysis: string;
  additionalContext: string;
}

interface TabbedContentProps {
  summary: Summary;
  transcript: string;
}

export function TabbedContent({ summary, transcript }: TabbedContentProps) {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger
          value="summary"
          className="flex items-center gap-2 text-base py-3"
        >
          <FileDigit className="h-5 w-5" />
          <span>Summary</span>
        </TabsTrigger>
        <TabsTrigger
          value="transcript"
          className="flex items-center gap-2 text-base py-3"
        >
          <FileText className="h-5 w-5" />
          <span>Transcript</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="mt-0">
        <Card className="border border-gray-200 shadow-sm p-6">
          <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Overview
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {summary.overview}
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Key Points
            </h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              {summary.keyPoints.map((point, index) => (
                <li key={index} className="text-gray-700 leading-relaxed">
                  {point}
                </li>
              ))}
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Analysis
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {summary.analysis}
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Additional Context
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {summary.additionalContext}
            </p>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="transcript" className="mt-0">
        <Card className="border border-gray-200 shadow-sm p-6">
          <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Full Transcript
            </h2>
            <div className="text-gray-700 leading-relaxed">
              {transcript.split("\n\n").map((paragraph, index) => {
                // Check if this is a Q&A section
                if (
                  paragraph.startsWith("Reporter:") ||
                  paragraph.startsWith("Press Secretary:")
                ) {
                  const [speaker, ...content] = paragraph.split(":");
                  return (
                    <div key={index} className="mb-4">
                      <span className="font-semibold">{speaker}:</span>
                      <span>{content.join(":")}</span>
                    </div>
                  );
                }
                return (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
