// ============================================================
// КОРНЕВОЙ МАКЕТ (Root Layout)
// Этот файл оборачивает ВСЕ страницы сайта.
// Здесь подключается шрифт, задаются мета-теги для SEO
// и устанавливается базовая структура HTML.
// ============================================================

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";

// ---- Подключение шрифта Montserrat ----
// Next.js автоматически загружает шрифт с Google Fonts и передаёт его
// через CSS-переменную --font-montserrat (используется в tailwind.config.ts)
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"], // Поддержка латиницы и кириллицы
  variable: "--font-montserrat",  // Имя CSS-переменной
  display: "swap",                // Сначала показывается системный шрифт, потом подгружается Montserrat
});

// ---- SEO-метаданные ----
// Next.js автоматически вставляет их в <head> страницы
export const metadata: Metadata = {
  title: "Электромонтажные работы в Пинске | Надёжно, по стандартам",
  description:
    "Комплекс электромонтажных работ в частном доме, квартире или офисе. Замена проводки, монтаж щитов, установка розеток и освещения. Выезд мастера в день обращения. Пинск и Пинский район.",
  keywords:
    "электромонтаж Пинск, электрик Пинск, замена проводки Пинск, монтаж щита Пинск, электромонтажные работы Пинский район, ИП Шугайло",
  openGraph: {
    // Данные для отображения ссылки при репосте в соцсетях/мессенджерах
    title: "Электромонтажные работы | ИП Шугайло В.Г. | Пинск",
    description:
      "Надёжно, по стандартам. Выезд мастера в день обращения. Пинск и Пинский район.",
    locale: "ru_BY",
    type: "website",
  },
};

// ---- Корневой компонент-обёртка ----
// Принимает children — это и есть содержимое каждой страницы (page.tsx)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body
        className={`${montserrat.variable} font-sans bg-dark text-white antialiased`}
        // antialiased — сглаживание шрифта для лучшей читаемости
      >
        {/* Шапка сайта — "липкая", всегда поверх контента */}
        <Header />

        {/* Основной контент страницы (секции из page.tsx) */}
        {children}

        {/* Подвал сайта с юридической информацией */}
        <Footer />
      </body>
    </html>
  );
}
