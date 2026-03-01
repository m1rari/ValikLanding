// ============================================================
// ДАННЫЕ: ПРИМЕРЫ РАБОТ
// Добавляйте сюда новые фото из папки /public/works/
//
// src      — имя файла в /public/works/ (например "kitchen.jpg")
// title    — подпись (отображается в лайтбоксе)
// category — категория для фильтрации (опционально)
// ============================================================

export interface WorkItem {
  src:      string; // путь относительно /public
  title:    string;
  category: string;
}

export const works: WorkItem[] = [
  // --- Раскомментируйте и замените на свои файлы: ---
  //
   { src: "/works/1.jpg", title: "Монтаж электрощита",       category: "Щиты"      },
  { src: "/works/2.jpg", title: "Скрытая проводка кухня",   category: "Проводка"  },
  { src: "/works/3.jpg", title: "Розетки в гостиной",       category: "Розетки"   },
  { src: "/works/4.jpg", title: "Освещение прихожей",       category: "Освещение" },
  { src: "/works/5.jpg", title: "Подключение бойлера",      category: "Другое"    },
  { src: "/works/6.jpg", title: "Подключение бойлера",      category: "Другое"    },
];
