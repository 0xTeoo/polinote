"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FileDigit } from "lucide-react";

interface ContentTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function ContentTabs({ activeTab, onTabChange }: ContentTabsProps) {
  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full bg-white p-1.5 rounded-xl shadow-md border border-gray-200">
          <TabsTrigger
            value="summary"
            className="flex-1 px-4 py-3 text-sm font-medium relative rounded-lg transition-all duration-300 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-blue-200 data-[state=inactive]:text-gray-600 data-[state=inactive]:bg-transparent hover:text-blue-600 hover:bg-blue-50/50"
          >
            <div className="flex items-center justify-center gap-2">
              <FileDigit
                className={`h-4 w-4 transition-all duration-300 ${
                  activeTab === "summary" ? "text-blue-600" : "text-gray-500"
                }`}
              />
              <span>Summary</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="transcript"
            className="flex-1 px-4 py-3 text-sm font-medium relative rounded-lg transition-all duration-300 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-blue-200 data-[state=inactive]:text-gray-600 data-[state=inactive]:bg-transparent hover:text-blue-600 hover:bg-blue-50/50"
          >
            <div className="flex items-center justify-center gap-2">
              <FileText
                className={`h-4 w-4 transition-all duration-300 ${
                  activeTab === "transcript" ? "text-blue-600" : "text-gray-500"
                }`}
              />
              <span>Transcript</span>
            </div>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
