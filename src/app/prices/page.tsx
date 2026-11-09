import type { Metadata } from "next";
import { getPricesFromSheet } from "@/utils/getPricesFromSheet";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pinsk-elektrik.by";

const PAGE_TITLE = "Цены на услуги электрика в Пинске — прайс в BYN";
const PAGE_DESCRIPTION =
  "Прайс на электромонтажные работы в Пинске: штробление, прокладка кабеля, сборка щитов, установка розеток и светильников. Цены в BYN, выезд на замер бесплатно.";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/prices",
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/prices",
  },
};

const breadcrumbsSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Электрик в Пинске", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Цены", item: `${SITE_URL}/prices` },
  ],
};

function formatPrice(price: number | null): string {
  if (price === null) {
    return "Уточнить";
  }

  return `${price.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 2 })} BYN`;
}

export default async function PricesPage() {
  const { items, warnings } = await getPricesFromSheet();

  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <section className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Цены на электромонтажные работы в Пинске</h1>
          <p className="text-muted max-w-2xl">
            Стоимость указана за единицу работы. Итоговую смету мастер составит после бесплатного
            выезда на замер — по договору, без скрытых доплат.
          </p>
        </div>

        {warnings.length > 0 ? (
          <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground/80">
            Часть данных может быть неполной. Проверьте формат таблицы Google Sheets.
          </div>
        ) : null}

        {items.length === 0 ? (
          <div className="rounded-2xl border border-foreground/10 bg-surface p-6">
            <p className="text-foreground font-medium">Прайс пока не загружен.</p>
            <p className="text-muted text-sm mt-2">
              Убедитесь, что таблица опубликована и переменная `GOOGLE_SHEET_PRICES_URL` заполнена.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([category, categoryItems]) => (
              <section key={category} className="rounded-2xl border border-foreground/10 bg-surface p-4 md:p-6">
                <h2 className="text-xl font-semibold mb-4">{category}</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted border-b border-foreground/10">
                        <th className="py-2 pr-4 font-medium">Работа</th>
                        <th className="py-2 pr-4 font-medium">Ед.</th>
                        <th className="py-2 font-medium">Цена</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryItems.map((item, idx) => (
                        <tr
                          key={`${item.category}-${item.service}-${item.unit}-${idx}`}
                          className="border-b border-foreground/5 last:border-b-0"
                        >
                          <td className="py-2.5 pr-4">{item.service}</td>
                          <td className="py-2.5 pr-4 text-muted">{item.unit}</td>
                          <td className="py-2.5 font-medium">{formatPrice(item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-primary/30 bg-primary/10 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-1">Нужен точный расчёт?</h2>
            <p className="text-muted">Позвоните или напишите — подскажем стоимость под ваш объект.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:+375291645388"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary text-onPrimary font-semibold hover:bg-primary/90 transition-colors"
            >
              +375 (29) 164-53-88
            </a>
            <a
              href="/#contacts"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-primary/40 text-foreground font-semibold hover:bg-primary/10 transition-colors"
            >
              Оставить заявку
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
