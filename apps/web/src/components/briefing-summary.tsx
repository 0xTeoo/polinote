import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface BriefingSummaryProps {
  summary: string;
}

export function BriefingSummary({ summary }: BriefingSummaryProps) {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-xl text-gray-900">
            AI-Generated Summary
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed text-base">{summary}</p>
      </CardContent>
    </Card>
  );
}
