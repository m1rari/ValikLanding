import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import YandexMetrika from "@/components/YandexMetrika";
import { ThemeProvider } from "@/components/ThemeProvider";
import JsonLd from "@/components/JsonLd";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://electro-pinsk.by";

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION?.trim();
const yandexVerification = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION?.trim();
const siteVerification =
  googleVerification || yandexVerification
    ? {
        ...(googleVerification ? { google: googleVerification } : {}),
        ...(yandexVerification ? { yandex: yandexVerification } : {}),
      }
    : undefined;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Электромонтажные работы в Пинске | ИП Шугайло",
    template: "%s | ИП Шугайло — Электрик в Пинске",
  },
  description:
    "Комплекс электромонтажных работ в частном доме, квартире или офисе. Замена проводки, монтаж щитов, установка розеток и освещения. Выезд мастера в день обращения. Пинск и Пинский район.",
  keywords: [
    "электромонтаж Пинск",
    "электрик Пинск",
    "замена проводки Пинск",
    "монтаж щита Пинск",
    "электромонтажные работы Пинский район",
    "ИП Шугайло",
    "вызов электрика Пинск",
    "монтаж освещения Пинск",
    "установка розеток Пинск",
    "электрик на дом Пинск",
    "электромонтаж квартира Пинск",
    "электромонтаж частный дом Пинск",
  ],
  authors: [{ name: "ИП Шугайло Валентин Георгиевич" }],
  creator: "ИП Шугайло Валентин Георгиевич",
  publisher: "ИП Шугайло Валентин Георгиевич",
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
  openGraph: {
    title: "Электромонтажные работы в Пинске | ИП Шугайло",
    description:
      "Надёжно, по стандартам. Выезд мастера в день обращения. Пинск и Пинский район.",
    url: "/",
    siteName: "ИП Шугайло — Электрик в Пинске",
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
    title: "Электромонтажные работы в Пинске | ИП Шугайло",
    description: "Надёжно, по стандартам. Выезд мастера в день обращения.",
    images: ["/opengraph-image.png"],
  },
  // Коды верификации: только значение из content="..." (не весь HTML тега). NEXT_PUBLIC_* подставляется при сборке/старте.
  ...(siteVerification ? { verification: siteVerification } : {}),
};

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
