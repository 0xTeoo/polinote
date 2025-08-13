import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "@/components/navigation";
import { getMetadataForLocale } from "@/i18n/metadata";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // get metadata for locale
  const metadata = getMetadataForLocale(locale);

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    authors: [{ name: "Polinote Team" }],
    creator: "Polinote",
    publisher: "Polinote",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/logo.svg",
      shortcut: "/logo.svg",
      apple: "/logo.svg",
    },
    openGraph: {
      type: "website",
      locale: locale,
      url: "https://app.thepolinote.com",
      siteName: "Polinote",
      title: metadata.title,
      description: metadata.description,
      images: [
        {
          url: "https://cdn.thepolinote.com/opengraph.png",
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: ["https://cdn.thepolinote.com/opengraph.png"],
      creator: "@polinote",
      site: "@polinote",
    },
    alternates: {
      canonical: "https://app.thepolinote.com",
      languages: {
        en: "https://app.thepolinote.com/en",
        ko: "https://app.thepolinote.com/ko",
        ja: "https://app.thepolinote.com/ja",
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation currentLocale={locale} showLanguageSelector={true} />
        {children}
      </body>
    </html>
  );
}
