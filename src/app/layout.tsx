import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import YandexMetrika from "@/components/YandexMetrika";
import { ThemeProvider } from "@/components/ThemeProvider";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Электромонтажные работы в Пинске | Надёжно, по стандартам",
  description:
    "Комплекс электромонтажных работ в частном доме, квартире или офисе. Замена проводки, монтаж щитов, установка розеток и освещения. Выезд мастера в день обращения. Пинск и Пинский район.",
  keywords:
    "электромонтаж Пинск, электрик Пинск, замена проводки Пинск, монтаж щита Пинск, электромонтажные работы Пинский район, ИП Шугайло",
  openGraph: {
    title: "Электромонтажные работы | ИП Шугайло В.Г. | Пинск",
    description:
      "Надёжно, по стандартам. Выезд мастера в день обращения. Пинск и Пинский район.",
    locale: "ru_BY",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning нужен, чтобы React не жаловался на класс .dark,
    // который ThemeProvider добавляет на клиенте после гидратации
    <html lang="ru" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${montserrat.variable} font-sans bg-dark text-foreground antialiased`}>
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
