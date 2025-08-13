"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Globe,
  ChevronDown,
  Menu,
  X,
  Home,
  Info,
} from "lucide-react";
import Image from "next/image";

interface NavigationProps {
  showBackButton?: boolean;
  backHref?: string;
  title?: string;
  currentLocale?: string;
  onLocaleChange?: (locale: string) => void;
  showLanguageSelector?: boolean;
}

export function Navigation({
  showBackButton = false,
  backHref = "/",
  title = "Polinote",
  currentLocale = "en",
  onLocaleChange,
  showLanguageSelector = true,
}: NavigationProps) {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Check if we're on a video detail page to show back button
  const isVideoDetailPage =
    pathname.includes("/videos/") && pathname.split("/").length > 3;
  const shouldShowBackButton = showBackButton || isVideoDetailPage;

  // Detect outside clicks on language dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleSelect = (locale: string) => {
    onLocaleChange?.(locale);
    setIsLanguageOpen(false);

    const pathParts = pathname.split("/");
    pathParts[1] = locale;
    const newPath = pathParts.join("/");
    router.push(newPath);
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === currentLocale) || languages[0];

  // Get the appropriate back href
  const getBackHref = () => {
    if (backHref !== "/") return backHref;
    if (isVideoDetailPage) {
      // Extract locale from pathname
      const pathParts = pathname.split("/");
      const locale = pathParts[1];
      return `/${locale}`;
    }
    return "/";
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {shouldShowBackButton && (
              <>
                <Link href={getBackHref()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-medium hidden sm:inline">Back</span>
                  </Button>
                </Link>
                <div className="h-4 w-px bg-gray-300 hidden sm:block" />
              </>
            )}

            <Link href="/" className="flex items-center space-x-2 group">
              <Image
                src="/logo.svg"
                alt="Polinote Logo"
                className="w-8 h-8"
                width={32}
                height={32}
              />
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors duration-200">
                {title}
              </h1>
            </Link>
          </div>

          {/* Center Section - Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            {showLanguageSelector && (
              <div className="relative" ref={languageRef}>
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100/50 text-gray-700 hover:text-gray-900 transition-all duration-200 border border-gray-200/50 hover:border-gray-300/50"
                  aria-label="Language selector"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {currentLanguage.name}
                  </span>
                  <span className="text-sm font-medium sm:hidden">
                    {currentLanguage.flag}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      isLanguageOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isLanguageOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg shadow-gray-200/50">
                    <div className="p-1">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => handleLocaleSelect(language.code)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 rounded-lg ${
                            currentLocale === language.code
                              ? "bg-blue-50 text-blue-700 border border-blue-200/50"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <span className="text-base">{language.flag}</span>
                          <span className="font-medium">{language.name}</span>
                          {currentLocale === language.code && (
                            <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-sm">
            <nav className="px-4 py-4 space-y-2">
              <Link
                href="/"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Home</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Info className="w-4 h-4" />
                <span className="font-medium">About</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
