import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Условия оказания услуг",
  description:
    "Условия выполнения электромонтажных работ ИП Шугайло Валентина Георгиевича: договор, оплата, акт и порядок работ.",
  alternates: {
    canonical: "/offer",
  },
};

export default function OfferPage() {
  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <section className="container-custom max-w-3xl">
        <span className="text-primary text-sm font-semibold uppercase tracking-widest">
          Договор и порядок работ
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mt-3 mb-6">
          Условия оказания электромонтажных услуг
        </h1>

        <div className="space-y-6 rounded-2xl border border-foreground/10 bg-surface p-6 text-muted leading-relaxed">
          <section id="requisites">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Исполнитель и реквизиты
            </h2>
            <p>
              ИП Шугайло Валентин Георгиевич, УНП 291466464. Юридический адрес:
              д. Берёзовичи, ул. Садовая, д. 38.
            </p>
            <p className="mt-2">
              Свидетельство о государственной регистрации выдано в соответствии
              с законодательством Республики Беларусь. Работы оказываются как
              услуги по электромонтажу для физических лиц и организаций.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Порядок выполнения работ
            </h2>
            <p>
              Клиент оставляет заявку, после чего мастер уточняет задачу, сроки, адрес и
              ориентировочную стоимость. Финальный объём и цена работ согласовываются после
              осмотра объекта или уточнения технических деталей.
            </p>
          </section>

          <section id="payment">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Оплата
            </h2>
            <p>
              Оплата принимается наличным или безналичным расчётом в белорусских рублях.
              Условия оплаты фиксируются до начала работ.
            </p>
          </section>

          <section id="acceptance">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Договор и акт
            </h2>
            <p>
              Работы выполняются по договору. После завершения подписывается акт
              приёма-передачи. Объём работ, материалы, сроки и итоговая стоимость
              согласовываются с клиентом до начала выполнения.
            </p>
          </section>

          <section id="service-area">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Зона обслуживания и выезд
            </h2>
            <p>
              Основной регион работы — Пинск и Пинский район. Выезд в другие населённые пункты
              согласовывается индивидуально.
            </p>
            <p className="mt-2">
              Доставка товаров не применяется: сайт продвигает услуги мастера.
              Если для работ нужны материалы, их перечень, закупка и доставка на
              объект согласовываются с клиентом до начала монтажа.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
