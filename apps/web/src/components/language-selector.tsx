import { useState, useRef, useEffect } from "react";

interface LanguageSelectorProps {
  currentLocale: string;
  onLocaleChange: (locale: string) => void;
}

export const LanguageSelector = ({
  currentLocale,
  onLocaleChange,
}: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleSelect = (locale: string) => {
    onLocaleChange(locale);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-gray-800/50 text-gray-400 hover:text-gray-200 transition-all"
        aria-label="Language selector"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
        <span className="text-sm font-medium">
          {currentLocale.toUpperCase()}
        </span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-lg overflow-hidden bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 shadow-lg">
          <div role="menu" aria-orientation="vertical">
            <button
              onClick={() => handleLocaleSelect("ko")}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                currentLocale === "ko"
                  ? "bg-gray-800/80 text-white"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              }`}
              role="menuitem"
            >
              <span className="w-6 text-xs font-medium">KO</span>
              한국어
            </button>
            <button
              onClick={() => handleLocaleSelect("en")}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                currentLocale === "en"
                  ? "bg-gray-800/80 text-white"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              }`}
              role="menuitem"
            >
              <span className="w-6 text-xs font-medium">EN</span>
              English
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
