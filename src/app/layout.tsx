import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import YandexMetrika from "@/components/YandexMetrika";
import { ThemeProvider } from "@/components/ThemeProvider";
import JsonLd from "@/components/JsonLd";
import { readSeoSettings } from "@/utils/seoSettings";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pinsk-elektrik.by";

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION?.trim();
const yandexVerification = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION?.trim();
const siteVerification =
  googleVerification || yandexVerification
    ? {
        ...(googleVerification ? { google: googleVerification } : {}),
        ...(yandexVerification ? { yandex: yandexVerification } : {}),
      }
    : undefined;

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await readSeoSettings();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo.title,
      template: `%s | ${seo.siteName}`,
    },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: "ИП Шугайло Валентин Георгиевич" }],
    creator: "ИП Шугайло Валентин Георгиевич",
    publisher: "ИП Шугайло Валентин Георгиевич",
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/logo.svg", type: "image/svg+xml" },
      ],
      shortcut: "/favicon.ico",
    },
    robots: {
      index: seo.indexingEnabled,
      follow: seo.indexingEnabled,
      googleBot: {
        index: seo.indexingEnabled,
        follow: seo.indexingEnabled,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: seo.canonicalPath,
      siteName: seo.siteName,
      locale: "ru_BY",
      type: "website",
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: "Электромонтажные работы в Пинске — ИП Шугайло",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: ["/opengraph-image.png"],
    },
    ...(siteVerification ? { verification: siteVerification } : {}),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${montserrat.variable} font-sans bg-dark text-foreground antialiased`}>
        <JsonLd />
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
          <YandexMetrika />
        </ThemeProvider>
      </body>
    </html>
  );
}
