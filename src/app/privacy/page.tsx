import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Политика обработки персональных данных ИП Шугайло Валентина Георгиевича для заявок на электромонтажные работы в Пинске.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <section className="container-custom max-w-3xl">
        <span className="text-primary text-sm font-semibold uppercase tracking-widest">
          Персональные данные
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mt-3 mb-6">
          Политика конфиденциальности
        </h1>

        <div className="space-y-6 rounded-2xl border border-foreground/10 bg-surface p-6 text-muted leading-relaxed">
          <p>
            ИП Шугайло Валентин Георгиевич обрабатывает персональные данные посетителей сайта
            только для связи по заявкам, расчёта стоимости и оказания электромонтажных услуг.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Какие данные обрабатываются?
            </h2>
            <p>
              При отправке формы могут обрабатываться имя, номер телефона, параметры объекта
              и содержание обращения. Также сайт может использовать технические данные посещения
              для аналитики и улучшения работы страницы.
            </p>
          </section>

          <section id="cookies">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Cookies и аналитика
            </h2>
            <p>
              Сайт может использовать cookies, данные браузера и обезличенную
              статистику посещений для корректной работы форм, аналитики и
              улучшения качества страницы. Эти данные не используются для продажи
              персональной информации третьим лицам.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Для чего используются данные?
            </h2>
            <p>
              Данные нужны, чтобы перезвонить клиенту, уточнить задачу, рассчитать стоимость,
              согласовать выезд мастера, подготовить договор и выполнить работы.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Передаются ли данные третьим лицам?
            </h2>
            <p>
              Персональные данные не продаются и не передаются третьим лицам, кроме случаев,
              когда это требуется по законодательству Республики Беларусь или необходимо для
              технической обработки заявки.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Как отозвать согласие?
            </h2>
            <p>
              Чтобы уточнить, изменить или удалить данные, свяжитесь по телефону
              {" "}
              <a href="tel:+375291645388" className="text-primary hover:underline">
                +375 (29) 164-53-88
              </a>
              .
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
