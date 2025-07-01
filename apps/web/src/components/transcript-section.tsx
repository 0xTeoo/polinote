import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface TranscriptSectionProps {
  transcript: string;
}

export function TranscriptSection({ transcript }: TranscriptSectionProps) {
  // Format the transcript with proper paragraph breaks
  const formattedTranscript = transcript
    .split("\n\n")
    .map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {paragraph}
      </p>
    ));

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-xl text-gray-900">
            Full Transcript
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-gray-700 leading-relaxed text-base max-h-[600px] overflow-y-auto pr-2 transcript-scrollbar">
          {formattedTranscript}
        </div>
      </CardContent>
    </Card>
  );
}
