"use client";

const navLinks = [
  { href: "#services", label: "Услуги"         },
  { href: "#formats",  label: "Форматы работы" },
  { href: "#works",    label: "Примеры работ"  },
  { href: "#contacts", label: "Контакты"       },
];

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
                <button
                  key={link.href}
                  onClick={() => handleScrollTo(link.href)}
                  className="block text-muted hover:text-primary transition-colors text-sm"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Колонка 2: контакты */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Контакты</h3>

            <div className="space-y-3 text-sm text-muted">
              <div className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+375291645388" className="hover:text-primary transition-colors">
                  +375 (29) 164-53-88
                </a>
              </div>

              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Пинск и Пинский район</span>
              </div>

              <div className="flex items-center gap-2">
                <span>🕐</span>
                <span>Пн–Вс: 8:00 – 21:00</span>
              </div>

              <div className="flex gap-3 mt-4">
                <a
                  href="viber://chat?number=375291645388"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-dark rounded-lg border border-foreground/10 hover:border-primary/30 transition-colors text-xs"
                >
                  💬 Viber
                </a>
                <a
                  href="https://t.me/+375291645388"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-dark rounded-lg border border-foreground/10 hover:border-primary/30 transition-colors text-xs"
                >
                  ✈️ Telegram
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
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-foreground/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} ИП Шугайло Валентин Георгиевич. Все права защищены.
          </p>
          <div className="flex gap-4 text-xs text-muted">
            <a href="#" className="hover:text-primary transition-colors">
              Политика конфиденциальности
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
