// ============================================================
// ДАННЫЕ УСЛУГ
// Массив из 8 объектов — каждый описывает одну карточку услуги.
// Данные импортируются в Services.tsx и передаются в компонент <ServiceCard />.
// Чтобы добавить новую услугу — просто добавьте новый объект в массив.
// ============================================================

// Тип одной услуги — описывает форму объекта
export interface Service {
  id: string;          // Уникальный ключ (используется как key в .map())
  title: string;       // Название услуги (показывается в заголовке карточки)
  description: string; // Описание (серый текст под заголовком)
  icon: string;        // SVG-разметка иконки в виде строки (вставляется через dangerouslySetInnerHTML)
}

// Массив всех услуг
export const services: Service[] = [
  {
    id: "cable-input",
    title: "Замена вводного кабеля",
    description:
      "Безопасное подключение к электросети с соблюдением нормативов. Замена устаревшего ввода, прокладка кабеля от опоры до счётчика.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  },
  {
    id: "panel",
    title: "Монтаж щита учёта / РЩ",
    description:
      "Сборка распределительных щитов любой сложности, установка автоматов, УЗО и дифавтоматов по схеме.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="8" y1="3" x2="8" y2="21"/><line x1="2" y1="9" x2="8" y2="9"/><line x1="2" y1="15" x2="8" y2="15"/><circle cx="14" cy="10" r="2"/><circle cx="14" cy="16" r="2"/><circle cx="19" cy="10" r="2"/><circle cx="19" cy="16" r="2"/></svg>`,
  },
  {
    id: "wiring",
    title: "Замена кабельных линий",
    description:
      "Полный или частичный демонтаж старой проводки (алюминий → медь). Прокладка кабеля в штробе, гофре или кабель-канале.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8m0 0l-3-3m3 3l-3 3"/><path d="M12 5v14"/><path d="M20 8v8a2 2 0 01-2 2h-4"/></svg>`,
  },
  {
    id: "chasing",
    title: "Штробление и высверливание",
    description:
      "Чистовая работа профильным инструментом с пылесосом. Штробы под кабель, отверстия под розетки, выключатели и распаечные коробки.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>`,
  },
  {
    id: "fixtures",
    title: "Установка фурнитуры",
    description:
      "Подключение розеток, выключателей, проходных переключателей, датчиков движения и диммеров любых марок.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="12" r="1.5"/><circle cx="15.5" cy="12" r="1.5"/></svg>`,
  },
  {
    id: "lighting",
    title: "Освещение",
    description:
      "Монтаж люстр, точечных светильников, скрытых светодиодных лент в нишах и подвесных потолках.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/><circle cx="12" cy="12" r="4"/></svg>`,
  },
  {
    id: "shaft-cable",
    title: "Протяжка кабеля в шахте",
    description:
      "Отдельная линия от ВРУ для мощных потребителей: электроплиты, варочных панелей, кондиционеров.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  },
  {
    id: "heating",
    title: "Электроотопление под ключ",
    description:
      "Проектирование и монтаж систем электрического отопления: тёплые полы, инфракрасные панели, электрокотлы.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 8v4l3 3"/><path d="M8 12c0-2.21 1.79-4 4-4"/></svg>`,
  },
];
