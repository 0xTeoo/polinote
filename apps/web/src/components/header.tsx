import { CalendarDays } from "lucide-react";

interface HeaderProps {
  title: string;
  date: string;
}

export function Header({ title, date }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 pb-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
      <div className="flex items-center mt-2 text-gray-600">
        <CalendarDays className="h-4 w-4 mr-2" />
        <time dateTime="2025-04-20" className="text-sm md:text-base">
          {date}
        </time>
      </div>
    </header>
  );
}
