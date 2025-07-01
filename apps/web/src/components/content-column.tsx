"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FileText, FileDigit } from "lucide-react";
import { Summary } from "@/types";
import { Markdown } from "@/components/ui/markdown";

interface ContentColumnProps {
  summary: Summary;
  transcript: string;
}

export function ContentColumn({ summary, transcript }: ContentColumnProps) {
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
          <TabsList className="apple-tab-list bg-gray-100/80 p-1 rounded-xl backdrop-blur">
            <TabsTrigger
              value="summary"
              className="apple-tab px-5 py-1.5 text-sm relative overflow-hidden"
            >
              <div className="flex items-center gap-2 relative z-10">
                <FileDigit
                  className={`h-4 w-4 transition-all duration-300 ${
                    activeTab === "summary"
                      ? "text-apple-blue scale-110"
                      : "text-apple-gray-400"
                  }`}
                />
                <span>Summary</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="transcript"
              className="apple-tab px-5 py-1.5 text-sm relative overflow-hidden"
            >
              <div className="flex items-center gap-2 relative z-10">
                <FileText
                  className={`h-4 w-4 transition-all duration-300 ${
                    activeTab === "transcript"
                      ? "text-apple-blue scale-110"
                      : "text-apple-gray-400"
                  }`}
                />
                <span>Transcript</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="summary" className="mt-0">
          <Card className="rounded-3xl shadow-lg border-0 bg-white/95 backdrop-blur">
            <div className="p-8">
              <div className="max-h-[70vh] overflow-y-auto pr-6 apple-scrollbar space-y-10">
                {/* Overview Section */}
                <section className="space-y-4">
                  <div className="border-l-4 border-apple-blue pl-6 py-1">
                    <h2 className="text-2xl font-semibold text-apple-gray-900 tracking-tight">
                      Overview
                    </h2>
                  </div>
                  <div className="pl-6">
                    <Markdown content={summary.overview} />
                  </div>
                </section>

                {/* Key Points Section */}
                <section className="space-y-6">
                  <div className="border-l-4 border-apple-blue pl-6 py-1">
                    <h2 className="text-2xl font-semibold text-apple-gray-900 tracking-tight">
                      Key Points
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Introduction */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-apple-blue/10 text-apple-blue font-semibold px-2.5 py-0.5 rounded-lg text-xs">
                          01
                        </span>
                        <h3 className="text-xl font-medium text-apple-gray-800">
                          Introduction
                        </h3>
                      </div>
                      <div>
                        <Markdown content={summary.keySections.introduction} />
                      </div>
                    </div>

                    {/* Main Points */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-apple-blue/10 text-apple-blue font-semibold px-2.5 py-0.5 rounded-lg text-xs">
                          02
                        </span>
                        <h3 className="text-xl font-medium text-apple-gray-800">
                          Main Points
                        </h3>
                      </div>
                      <ul className="space-y-4">
                        {summary.keySections.mainPoints.map((point, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3"
                            style={{
                              animationDelay: `${index * 0.1}s`,
                            }}
                          >
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-apple-blue/10 text-apple-blue text-xs font-medium flex-shrink-0 mt-0.5">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <div className="flex-1">
                              <Markdown content={point} />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Conclusion */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-apple-blue/10 text-apple-blue font-semibold px-2.5 py-0.5 rounded-lg text-xs">
                          03
                        </span>
                        <h3 className="text-xl font-medium text-apple-gray-800">
                          Conclusion
                        </h3>
                      </div>
                      <div>
                        <Markdown content={summary.keySections.conclusion} />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Analysis Section */}
                <section className="space-y-4">
                  <div className="border-l-4 border-apple-blue pl-6 py-1">
                    <h2 className="text-2xl font-semibold text-apple-gray-900 tracking-tight">
                      Analysis
                    </h2>
                  </div>
                  <div className="pl-6">
                    <Markdown content={summary.analysis} />
                  </div>
                </section>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="transcript" className="mt-0">
          <Card className="rounded-3xl shadow-lg border-0 bg-white/95 backdrop-blur transition-all duration-500">
            <div className="p-8">
              <div className="max-h-[70vh] overflow-y-auto pr-6 apple-scrollbar">
                <div className="border-l-4 border-apple-blue pl-6 py-1 mb-6 transition-all duration-500">
                  <h2 className="text-2xl font-semibold text-apple-gray-900 tracking-tight">
                    Full Transcript
                  </h2>
                </div>
                <div className="text-apple-gray-600 leading-relaxed space-y-4 pl-6">
                  {transcript.split("\n\n").map((paragraph, index) => {
                    if (
                      paragraph.startsWith("Reporter:") ||
                      paragraph.startsWith("Press Secretary:")
                    ) {
                      const [speaker, ...content] = paragraph.split(":");
                      return (
                        <div
                          key={index}
                          className="flex gap-3 items-start opacity-0 animate-fade-slide-up"
                          style={{
                            animationDelay: `${index * 0.05}s`,
                            animationFillMode: "forwards",
                          }}
                        >
                          <span
                            className={`font-semibold whitespace-nowrap px-2.5 py-0.5 rounded-lg text-xs transition-all duration-300 ${
                              speaker === "Reporter:"
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                : "bg-apple-blue/10 text-apple-blue hover:bg-apple-blue/20"
                            }`}
                          >
                            {speaker.replace(":", "")}
                          </span>
                          <div className="flex-1 prose-sm">
                            <Markdown
                              content={content.join(":")}
                              className="[&_p]:mt-0 [&_p]:mb-0"
                            />
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={index}
                        className="opacity-0 animate-fade-slide-up"
                        style={{
                          animationDelay: `${index * 0.05}s`,
                          animationFillMode: "forwards",
                        }}
                      >
                        <Markdown
                          content={paragraph}
                          className="prose-sm [&_p]:mt-0 [&_p]:mb-0"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
