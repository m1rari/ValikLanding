const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://electro-pinsk.by";

const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "ИП Шугайло — Электромонтажные работы",
  description:
    "Комплекс электромонтажных работ в частном доме, квартире или офисе. Замена проводки, монтаж щитов, установка розеток и освещения. Пинск и Пинский район.",
  url: SITE_URL,
  telephone: "+375291645388",
  image: `${SITE_URL}/opengraph-image.png`,
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
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
