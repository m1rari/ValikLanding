import { faqItems } from "@/data/faq";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pinsk-elektrik.by";
const BUSINESS_ID = `${SITE_URL}/#business`;
const PERSON_ID = `${SITE_URL}/#person`;
const SERVICE_ID = `${SITE_URL}/#service`;

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "ИП Шугайло — Электрик в Пинске",
      url: SITE_URL,
      inLanguage: "ru-BY",
      publisher: { "@id": BUSINESS_ID },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "Электромонтажные работы в Пинске | Электрик ИП Шугайло",
      description:
        "Электромонтажные работы в Пинске и Пинском районе: замена проводки, монтаж щитов, розеток и освещения. Консультация в день обращения, договор и гарантия.",
      inLanguage: "ru-BY",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": SERVICE_ID },
      mainEntity: { "@id": SERVICE_ID },
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Шугайло Валентин Георгиевич",
      jobTitle: "Электрик",
      worksFor: { "@id": BUSINESS_ID },
      telephone: "+375291645388",
      knowsAbout: [
        "электромонтажные работы",
        "замена проводки",
        "монтаж электрощитов",
        "установка розеток и выключателей",
        "монтаж освещения",
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": BUSINESS_ID,
      name: "ИП Шугайло — Электромонтажные работы",
      description:
        "Электромонтажные работы в частном доме, квартире, офисе и коммерческом помещении. Замена проводки, монтаж щитов, установка розеток и освещения. Пинск и Пинский район.",
      url: SITE_URL,
      telephone: "+375291645388",
      image: `${SITE_URL}/opengraph-image.png`,
      founder: { "@id": PERSON_ID },
      priceRange: "$$",
      currenciesAccepted: "BYN",
      paymentAccepted: "Наличные, безналичный расчёт",
      areaServed: [
        { "@type": "City", name: "Пинск" },
        { "@type": "AdministrativeArea", name: "Пинский район" },
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "ул. Садовая, д. 38",
        addressLocality: "д. Берёзовичи",
        addressRegion: "Брестская область",
        addressCountry: "BY",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 52.1211,
        longitude: 26.0945,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "08:00",
          closes: "21:00",
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Электромонтажные услуги",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Замена электропроводки" },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Монтаж электрощита" },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Установка розеток и выключателей",
            },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Монтаж освещения" },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Подключение электроприборов",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Электромонтаж в частном доме",
            },
          },
        ],
      },
    },
    {
      "@type": "Service",
      "@id": SERVICE_ID,
      name: "Электромонтажные работы в Пинске и Пинском районе",
      serviceType: "Электромонтажные работы",
      provider: { "@id": BUSINESS_ID },
      areaServed: [
        { "@type": "City", name: "Пинск" },
        { "@type": "AdministrativeArea", name: "Пинский район" },
      ],
      offers: {
        "@type": "Offer",
        priceCurrency: "BYN",
        availability: "https://schema.org/InStock",
        url: SITE_URL,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
