"use client";

import Link from "next/link";

type NavLink = {
  href: string;
  label: string;
  type: "section" | "page";
};

const navLinks = [
  { href: "#services", label: "Услуги", type: "section" },
  { href: "#formats", label: "Форматы работы", type: "section" },
  { href: "#works", label: "Примеры работ", type: "section" },
  { href: "/prices", label: "Цены", type: "page" },
  { href: "#faq", label: "FAQ", type: "section" },
  { href: "#contacts", label: "Контакты", type: "section" },
] satisfies NavLink[];

function FooterIcon({ name, className = "w-4 h-4" }: { name: "phone" | "pin" | "clock" | "message" | "telegram"; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "phone":
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.66 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.23a2 2 0 0 1 2.11-.45c.84.32 1.72.54 2.62.66A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12Z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "message":
      return (
        <svg {...common}>
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      );
    case "telegram":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 1 0 .01 0ZM16.7 8.8l-1.69 7.96c-.12.56-.46.69-.93.43l-2.57-1.89-1.24 1.19c-.14.14-.25.25-.52.25l.18-2.62 4.74-4.28c.21-.18-.04-.28-.31-.1l-6.9 4.53-2.53-.77c-.55-.17-.56-.55.11-.82l10.03-3.87c.46-.17.86.11.63.99Z" />
        </svg>
      );
  }
}

export default function Footer() {
  const handleScrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-surface border-t border-foreground/5 dark:bg-[#080B10]">
      <div className="container-custom py-16">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Колонка 1: логотип + навигация */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-6 h-6 text-onPrimary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-foreground">ЭлектроМастер</div>
                <div className="text-xs text-muted">Профессиональный монтаж</div>
              </div>
            </div>

            <nav className="space-y-2">
              {navLinks.map((link) => (
                link.type === "section" ? (
                  <button
                    key={link.href}
                    onClick={() => handleScrollTo(link.href)}
                    className="block text-muted hover:text-primary transition-colors text-sm cursor-pointer"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-muted hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>
          </div>

          {/* Колонка 2: контакты */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Контакты</h3>

            <div className="space-y-3 text-sm text-muted">
              <div className="flex items-center gap-2">
                <FooterIcon name="phone" className="w-4 h-4 text-primary" />
                <a href="tel:+375291645388" className="hover:text-primary transition-colors">
                  +375 (29) 164-53-88
                </a>
              </div>

              <div className="flex items-center gap-2">
                <FooterIcon name="pin" className="w-4 h-4 text-primary" />
                <span>Пинск и Пинский район</span>
              </div>

              <div className="flex items-center gap-2">
                <FooterIcon name="clock" className="w-4 h-4 text-primary" />
                <span>Пн–Вс: 8:00 – 21:00</span>
              </div>

              <div className="flex gap-3 mt-4">
                <a
                  href="viber://chat?number=%2B375291645388"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-dark rounded-lg border border-foreground/10 hover:border-primary/30 transition-colors text-xs"
                >
                  <FooterIcon name="message" className="w-4 h-4" />
                  Viber
                </a>
                <a
                  href="https://t.me/+375291645388"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-dark rounded-lg border border-foreground/10 hover:border-primary/30 transition-colors text-xs"
                >
                  <FooterIcon name="telegram" className="w-4 h-4" />
                  Telegram
                </a>
              </div>
            </div>
          </div>

          {/* Колонка 3: юридическая информация */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Юридическая информация</h3>
            <div className="space-y-2 text-xs text-muted leading-relaxed">
              <p className="font-medium text-foreground/60">
                ИП Шугайло Валентин Георгиевич
              </p>
              <p>УНП 291466464</p>
              <p>Юридический адрес: д. Берёзовичи, ул. Садовая, д. 38</p>
              <p className="mt-3">
                Свидетельство о государственной регистрации выдано в соответствии
                с законодательством Республики Беларусь.
              </p>
              <p className="mt-2">
                Зарегистрирован в Торговом реестре Республики Беларусь.
              </p>
              <p className="mt-2">
                Работаем по договору, с актом приёма-передачи и согласованием условий до начала работ.
              </p>
              <p className="mt-2">
                Оплата: наличный и безналичный расчёт в белорусских рублях.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
                <Link href="/offer#requisites" className="hover:text-primary transition-colors">
                  Реквизиты
                </Link>
                <Link href="/offer#payment" className="hover:text-primary transition-colors">
                  Оплата
                </Link>
                <Link href="/offer#acceptance" className="hover:text-primary transition-colors">
                  Договор и акт
                </Link>
                <Link href="/offer#service-area" className="hover:text-primary transition-colors">
                  Выезд и условия
                </Link>
                <Link href="/privacy#cookies" className="hover:text-primary transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-foreground/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} ИП Шугайло Валентин Георгиевич. Все права защищены.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/offer" className="hover:text-primary transition-colors">
              Условия оказания услуг
            </Link>
            <Link href="/offer#payment" className="hover:text-primary transition-colors">
              Оплата
            </Link>
            <Link href="/offer#requisites" className="hover:text-primary transition-colors">
              Реквизиты
            </Link>
            <Link href="/privacy#cookies" className="hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
