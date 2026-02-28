// ============================================================
// СЕКЦИЯ: ПОДВАЛ САЙТА (Footer)
// Строго структурированный блок для соблюдения правовых норм РБ.
// Состоит из трёх колонок:
//   - Левая:  Логотип + навигационные ссылки
//   - Центр:  Контакты, время работы, мессенджеры
//   - Правая: Юридическая информация ИП
// Нижняя строка: копирайт + политика конфиденциальности.
// ============================================================

"use client";

// ---- Навигационные ссылки (дублируются из шапки) ----
const navLinks = [
  { href: "#services", label: "Услуги"           },
  { href: "#formats",  label: "Форматы работы"   },
  { href: "#contacts", label: "Контакты"         },
];

export default function Footer() {
  // Вспомогательная функция: плавный скролл к якорной секции
  const handleScrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#080B10] border-t border-white/5">
      <div className="container-custom py-16">

        {/* ================================================================
            ОСНОВНОЙ БЛОК ПОДВАЛА (три колонки)
            На мобильных — стак вертикально, на десктопе — строка
            ================================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* ---- КОЛОНКА 1: Логотип и навигация ---- */}
          <div>
            {/* Логотип — текстовый, жёлтый «молния» + название */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-6 h-6 text-dark" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-white">ЭлектроМастер</div>
                <div className="text-xs text-muted">Профессиональный монтаж</div>
              </div>
            </div>

            {/* Дублирование навигационного меню */}
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

          {/* ---- КОЛОНКА 2: Контакты и мессенджеры ---- */}
          <div>
            <h3 className="font-semibold text-white mb-4">Контакты</h3>

            {/* Список контактных данных */}
            <div className="space-y-3 text-sm text-muted">

              {/* Кликабельный телефон */}
              <div className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+375291645388" className="hover:text-primary transition-colors">
                  +375 (29) 164-53-88
                </a>
              </div>

              {/* Адрес */}
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>д. Берёзовичи, ул. Садовая, д. 38</span>
              </div>

              {/* Регион обслуживания */}
              <div className="flex items-center gap-2">
                <span>🗺️</span>
                <span>Пинск и Пинский район</span>
              </div>

              {/* Время работы */}
              <div className="flex items-center gap-2">
                <span>🕐</span>
                <span>Пн–Вс: 8:00 – 21:00</span>
              </div>

              {/* Ссылки на мессенджеры */}
              <div className="flex gap-3 mt-4">
                {/* Viber */}
                <a
                  href="viber://chat?number=375291645388"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-lg border border-white/10 hover:border-primary/30 transition-colors text-xs"
                >
                  💬 Viber
                </a>
                {/* Telegram */}
                <a
                  href="https://t.me/+375291645388"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-lg border border-white/10 hover:border-primary/30 transition-colors text-xs"
                >
                  ✈️ Telegram
                </a>
              </div>
            </div>
          </div>

          {/* ---- КОЛОНКА 3: Юридическая информация ---- */}
          {/* Обязательные реквизиты ИП согласно законодательству РБ */}
          <div>
            <h3 className="font-semibold text-white mb-4">Юридическая информация</h3>
            <div className="space-y-2 text-xs text-muted leading-relaxed">

              {/* Полное наименование ИП */}
              <p className="font-medium text-gray-400">
                ИП Шугайло Валентин Георгиевич
              </p>

              {/* УНП — Учётный номер плательщика */}
              <p>УНП 291466464</p>

              {/* Юридический адрес */}
              <p>Юридический адрес: д. Берёзовичи, ул. Садовая, д. 38</p>

              {/* Свидетельство о государственной регистрации */}
              <p className="mt-3">
                Свидетельство о государственной регистрации выдано в соответствии
                с законодательством Республики Беларусь.
              </p>

              {/* Уведомление о регистрации в Торговом реестре РБ */}
              <p className="mt-2">
                Зарегистрирован в Торговом реестре Республики Беларусь.
              </p>
            </div>
          </div>

        </div>

        {/* ================================================================
            НИЖНЯЯ СТРОКА ПОДВАЛА
            Горизонтальная черта + копирайт + политика
            ================================================================ */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">

          {/* Копирайт — текущий год формируется динамически */}
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} ИП Шугайло Валентин Георгиевич. Все права защищены.
          </p>

          {/* Ссылка на политику конфиденциальности */}
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
