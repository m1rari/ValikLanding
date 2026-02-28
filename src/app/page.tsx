// ============================================================
// ГЛАВНАЯ СТРАНИЦА (page.tsx)
// Точка входа лендинга.
// Собирает все секции в правильном порядке:
//   Header → Hero → WorkFormats → Services → Timeline → LeadForm → Footer
// Header и Footer подключены в layout.tsx, здесь только секции тела страницы.
// ============================================================

import Hero        from "@/sections/Hero";
import WorkFormats from "@/sections/WorkFormats";
import Services    from "@/sections/Services";
import Timeline    from "@/sections/Timeline";
import LeadForm    from "@/sections/LeadForm";

export default function Home() {
  return (
    <main>
      {/* ---- Первый экран: Главный баннер с CTA ---- */}
      <Hero />

      {/* ---- Форматы работы: с проектом / без проекта ---- */}
      <WorkFormats />

      {/* ---- Наши услуги: сетка из 8 карточек ---- */}
      <Services />

      {/* ---- Этапы работы: анимированный таймлайн ---- */}
      <Timeline />

      {/* ---- Форма захвата лидов: заявка на консультацию ---- */}
      <LeadForm />
    </main>
  );
}
