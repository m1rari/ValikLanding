import type { Metadata } from "next";
import { getPricesFromSheet } from "@/utils/getPricesFromSheet";

export const metadata: Metadata = {
  title: "Цены",
  description: "Актуальные цены на электромонтажные работы ИП Шугайло в Пинске и Пинском районе.",
  alternates: {
    canonical: "/prices",
  },
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
      <section className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Прайс на электромонтажные работы</h1>
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
      </section>
    </main>
  );
}
