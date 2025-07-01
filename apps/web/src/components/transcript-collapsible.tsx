"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

interface TranscriptCollapsibleProps {
  transcript: string;
}

export function TranscriptCollapsible({
  transcript,
}: TranscriptCollapsibleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-xl text-gray-900">
              Full Transcript
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-controls="transcript-content"
            className="text-gray-600 hover:text-gray-900"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>Hide</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                <span>Show</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isExpanded ? (
          <div
            id="transcript-content"
            className="text-gray-700 leading-relaxed whitespace-pre-line"
          >
            {transcript}
          </div>
        ) : (
          <div id="transcript-content" className="text-gray-500 text-sm">
            Click "Show" to view the complete transcript of today's briefing.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
