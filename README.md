# ⚡ ЭлектроМастер — Landing Page

Одностраничный сайт (Landing Page) для ИП Шугайло Валентин Георгиевич — электромонтажные работы в Пинске и Пинском районе.

---

## 🗂 Структура проекта

```
landing/
├── src/
│   ├── app/
│   │   ├── api/contact/route.ts   # API-маршрут: приём заявок с формы
│   │   ├── globals.css            # Глобальные стили + Tailwind
│   │   ├── layout.tsx             # Корневой макет (Header, Footer, мета-теги)
│   │   └── page.tsx               # Главная страница — сборка всех секций
│   ├── components/
│   │   ├── ServiceCard.tsx        # Карточка услуги (иконка + текст)
│   │   └── ui/
│   │       ├── Button.tsx         # Переиспользуемая кнопка (Framer Motion)
│   │       └── Input.tsx          # Поле ввода формы
│   ├── data/
│   │   └── services.ts            # Данные 8 услуг (иконки, заголовки, описания)
│   ├── sections/
│   │   ├── Header.tsx             # Шапка: лого, навигация, телефон, мессенджеры
│   │   ├── Hero.tsx               # Главный экран: H1, CTA-кнопки, метки
│   │   ├── WorkFormats.tsx        # Форматы работы: вкладки «С проектом / Без»
│   │   ├── Services.tsx           # Сетка 8 карточек услуг
│   │   ├── Timeline.tsx           # Этапы работы (анимированный таймлайн)
│   │   ├── LeadForm.tsx           # Форма заявки с валидацией
│   │   └── Footer.tsx             # Подвал: навигация, контакты, юр. информация
│   └── utils/
│       ├── sendTelegram.ts        # Отправка заявки в Telegram-бот
│       └── sendEmail.ts           # Отправка заявки через EmailJS
├── tailwind.config.ts             # Дизайн-система: цвета, шрифт, анимации
├── .env.local                     # ← СОЗДАТЬ ВРУЧНУЮ (секретные ключи)
└── README.md
```

---

## 🛠 Технологии

| Технология | Назначение |
|---|---|
| **Next.js 14** (App Router) | React-фреймворк, SSR, API-маршруты |
| **TypeScript** | Типизация |
| **Tailwind CSS** | Стилизация (тёмная тема) |
| **Framer Motion** | Анимации при скролле, hover-эффекты |
| **React Hook Form** | Валидация формы заявки |
| **Telegram Bot API** | Мгновенные уведомления о заявках в телефон |
| **EmailJS** | Дублирование заявок на email |

---

## ⚙️ Что нужно подключить перед запуском

### 1. Telegram-бот (для мгновенных заявок в телефон)

1. Откройте Telegram → найдите **@BotFather** → введите `/newbot`
2. Придумайте имя и username для бота → получите **токен** (вида `123456:ABC-DEF...`)
3. Напишите вашему новому боту любое сообщение (например, «/start»)
4. Откройте в браузере:
   ```
   https://api.telegram.org/bot8641084779:AAGlN8zBa-1LsnZ_8W1C3BrEfw_rDTCGDFI/getUpdates
   ```
5. В ответе найдите `"chat": { "id": 123456789 }` — это ваш **Chat ID**
517470121

### 2. EmailJS (резервный канал — письмо на email)

1. Зарегистрируйтесь на [emailjs.com](https://www.emailjs.com/) (есть бесплатный план)
2. **Email Services** → Add New Service → выберите Gmail / Outlook → подключите почту → скопируйте **Service ID**
3. **Email Templates** → Create New Template → настройте шаблон письма:
   ```
   От: {{from_name}}
   Телефон: {{phone}}
   Задача: {{message}}
   ```
   Скопируйте **Template ID**
4. **Account** → API Keys → скопируйте **Public Key** и **Private Key**

### 3. Заполните `.env.local`

Создайте файл `.env.local` в корне проекта `landing/`:

```env
# ---- Telegram ----
TELEGRAM_BOT_TOKEN=123456789:AAF-ваш-токен-от-BotFather
TELEGRAM_CHAT_ID=123456789

# ---- EmailJS ----
EMAILJS_SERVICE_ID=service_xxxxxxx
EMAILJS_TEMPLATE_ID=template_xxxxxxx
EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
EMAILJS_PRIVATE_KEY=xxxxxxxxxxxxxxx
```

> ⚠️ Файл `.env.local` **никогда не загружайте на GitHub** — он уже добавлен в `.gitignore`.
> Если хотя бы один канал (Telegram или EmailJS) не настроен — заявки всё равно придут через второй.

---

## 🚀 Локальный запуск (для разработки)

```bash
# 1. Установить зависимости
npm install

# 2. Создать файл с ключами (см. раздел выше)
# Скопировать .env.local.example → .env.local и заполнить

# 3. Запустить сервер разработки
npm run dev

# Сайт откроется на http://localhost:3000
```

---

## 📦 Деплой на сервер

### Вариант А — **Vercel** (рекомендуется, бесплатно)

Vercel — официальная платформа для Next.js, настройка занимает 5 минут.

1. **Загрузите код на GitHub:**
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/ВАШ_АККАУНТ/electromaster.git
   git push -u origin main
   ```

2. **Зайдите на [vercel.com](https://vercel.com)** → Sign Up (через GitHub аккаунт)

3. **New Project** → импортируйте репозиторий из GitHub

4. **Переменные окружения** — перед деплоем добавьте ключи:
   - В Vercel: **Settings → Environment Variables**
   - Добавьте все 6 переменных из `.env.local` (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID и т.д.)

5. Нажмите **Deploy** — сайт автоматически опубликуется на домене `*.vercel.app`

6. **Свой домен** (если есть):
   - Vercel: **Settings → Domains** → Add Domain → введите ваш домен
   - В настройках DNS у регистратора домена добавьте CNAME-запись:
     ```
     CNAME  www  cname.vercel-dns.com
     A      @    76.76.21.21
     ```

---

### Вариант Б — **VPS-сервер** (Linux, Ubuntu 22.04)

Если у вас есть собственный сервер (например, на timeweb.cloud, beget.com и т.д.):

```bash
# 1. Подключитесь к серверу по SSH
ssh root@ВАШ_IP

# 2. Установите Node.js 20 (если не установлен)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Клонируйте репозиторий
git clone https://github.com/ВАШ_АККАУНТ/electromaster.git /var/www/electromaster
cd /var/www/electromaster

# 4. Создайте файл с переменными окружения
nano .env.local
# Вставьте содержимое из раздела выше, сохраните (Ctrl+O, Ctrl+X)

# 5. Установите зависимости и соберите проект
npm install
npm run build

# 6. Установите pm2 (менеджер процессов)
npm install -g pm2

# 7. Запустите приложение через pm2
pm2 start npm --name "ValikLanding" -- start
pm2 save           # Сохранить список процессов
pm2 startup        # Автозапуск при перезагрузке сервера

# Сайт работает на порту 3000
```

**Настройка Nginx (обратный прокси + HTTPS):**

```bash
# Установить Nginx
sudo apt install nginx

# Создать конфиг для сайта
sudo nano /etc/nginx/sites-available/ValikLanding
```

Вставьте конфигурацию:
```nginx
server {
    listen 80;
    server_name ваш-домен.by www.ваш-домен.by;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

или новый 
   server {
    listen 80;
    server_name pinsk-elektrik.by www.pinsk-elektrik.by;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name pinsk-elektrik.by www.pinsk-elektrik.by;

    ssl_certificate /etc/letsencrypt/live/pinsk-elektrik.by/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pinsk-elektrik.by/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}


```bash
# Активировать конфиг
sudo ln -s /etc/nginx/sites-available/ValikLanding /etc/nginx/sites-enabled/
sudo nginx -t          # Проверить конфиг на ошибки
sudo systemctl reload nginx

# Установить SSL-сертификат (бесплатно через Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ваш-домен.by -d www.ваш-домен.by
# Следуйте инструкциям, сертификат обновляется автоматически
```

---

### Telegram Admin Bot — управление сервером из Telegram

В папке `telegram-admin-bot/` — отдельный сервис с кнопками для админа: статус сервера и приложения, перезапуск приложения, обновление (git pull + build + pm2 restart), перезапуск сервера. Подробная установка на сервер: **[telegram-admin-bot/README.md](telegram-admin-bot/README.md)**.

---

### Вариант В — **Обновление сайта** (после изменений в коде)

```bash
# На VPS — стянуть изменения и пересобрать
cd /var/www/electromaster
git pull
npm run build
pm2 restart ValikLanding
```
---

## 📝 Частые вопросы

**Заявки не приходят в Telegram?**
- Убедитесь, что написали боту хотя бы одно сообщение — иначе Chat ID не появится в getUpdates
- Проверьте правильность токена и Chat ID в `.env.local`
- На Vercel проверьте переменные в разделе Environment Variables

**Как изменить номер телефона?**
- Найдите `+375 (29) 164-53-88` через поиск в редакторе (Ctrl+Shift+F)
- Обновите также `href="tel:+375291645388"` и `href="viber://chat?number=375291645388"`

**Как добавить новую услугу?**
- Откройте `src/data/services.ts`
- Добавьте новый объект в массив `services` по образцу существующих

**Как изменить цвета сайта?**
- Откройте `tailwind.config.ts`
- Измените значения в секции `colors`: `primary` (жёлтый), `electric` (синий), `dark` (фон)

---

## 📞 Контакты проекта

**ИП Шугайло Валентин Георгиевич**  
УНП 291466464  
д. Берёзовичи, ул. Садовая, д. 38  
Тел.: +375 (29) 164-53-88




# ЭлектроМастер — Лендинг ИП Шугайло В.Г.

Сайт-лендинг для электрика в Пинске. Построен на **Next.js 14** (App Router), TypeScript, Tailwind CSS.

---

## Быстрый старт

```bash
npm install
npm run dev        # разработка → http://localhost:3000
npm run build      # сборка для продакшена
npm run start      # запуск собранного сайта
```

---

## Переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
# Полный URL сайта (без слеша в конце). ОБЯЗАТЕЛЬНО после получения домена!
NEXT_PUBLIC_SITE_URL=https://ваш-домен.by

# Пароль для /admin (управление ENV и SEO)
ADMIN_PANEL_PASSWORD=your-strong-password

# Код верификации Google Search Console (шаг 3 инструкции ниже)
NEXT_PUBLIC_GOOGLE_VERIFICATION=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Код верификации Яндекс.Вебмастер (шаг 4 инструкции ниже)
NEXT_PUBLIC_YANDEX_VERIFICATION=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Публичный CSV Google Sheets для страницы /prices
GOOGLE_SHEET_PRICES_URL=https://docs.google.com/spreadsheets/d/e/.../pub?output=csv

# (Опционально) интеграция SEO-аналитики из Search Console
GSC_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GSC_SITE_URL=https://ваш-домен.by
```

После запуска откройте `https://ваш-домен.by/admin`:
- вкладка `ENV` — Telegram/PM2 переменные + `GOOGLE_SHEET_PRICES_URL`;
- вкладка `SEO` — мета-теги, canonical, keywords, индексация, health-check и статус SEO аналитики.

Формат CSV для `/prices`:
`category,service,unit,price,note,updatedAt`

Если Google Sheets превращает цену в дату (в CSV это выглядит как `46xxx`), парсер на сайте автоматически восстанавливает значение цены.

---

## Что уже настроено для SEO

| Что | Где | Описание |
|---|---|---|
| Meta-теги | `src/app/layout.tsx` | title, description, keywords, robots |
| Open Graph | `src/app/layout.tsx` | Превью при репосте в соцсетях и мессенджерах |
| Twitter Card | `src/app/layout.tsx` | Превью при репосте в Twitter/X |
| Canonical URL | `src/app/layout.tsx` | Указывает основной URL страницы |
| OG-изображение | `src/app/opengraph-image.tsx` | Генерируется автоматически (1200×630) |
| robots.txt | `src/app/robots.ts` | Разрешает индексацию, указывает sitemap |
| sitemap.xml | `src/app/sitemap.ts` | Карта сайта для поисковиков |
| JSON-LD (LocalBusiness) | `src/components/JsonLd.tsx` | Структурированные данные для Google/Яндекс |
| Яндекс.Метрика | `src/components/YandexMetrika.tsx` | Счётчик посещений (ID: 107061110) |

После сборки и деплоя проверить:
- `https://ваш-сайт/robots.txt`
- `https://ваш-сайт/sitemap.xml`
- `https://ваш-сайт/opengraph-image.png`

---

## Инструкция: как добавить сайт в Google и Яндекс

### Шаг 1 — Получить домен и хостинг

1. Зарегистрируйте домен (например, `.by`, `.com`, `.ru`) у любого регистратора:
   - [reg.ru](https://reg.ru) — популярный российский
   - [hoster.by](https://hoster.by) — белорусский, домены `.by`
   - [nic.by](https://nic.by) — официальный регистратор `.by`
2. Задеплойте сайт (рекомендуется [Vercel](https://vercel.com) — бесплатно для Next.js):
   - Зарегистрируйтесь на vercel.com
   - Подключите GitHub-репозиторий
   - Vercel автоматически соберёт и задеплоит сайт
   - Привяжите свой домен в настройках проекта на Vercel
3. Установите в `.env.local` (и в настройках Vercel → Environment Variables):
   ```
   NEXT_PUBLIC_SITE_URL=https://ваш-домен.by
   ```

---

### Шаг 2 — Убедиться что сайт доступен

Откройте в браузере:
- `https://ваш-сайт/robots.txt` — должен показать текст с разрешениями
- `https://ваш-сайт/sitemap.xml` — должен показать XML с URL страниц

---

### Шаг 3 — Google Search Console

1. Перейдите на [search.google.com/search-console](https://search.google.com/search-console)
2. Нажмите **«Добавить ресурс»** → выберите **«Префикс URL»**
3. Введите полный URL: `https://ваш-домен.by`
4. Google предложит несколько способов верификации. Выберите **«HTML-тег»**:
   - Скопируйте значение из атрибута `content`, например:
     `abc123def456ghi789jkl012mno345pqr678stu901vwx234`
   - Вставьте его в `.env.local`:
     ```
     NEXT_PUBLIC_GOOGLE_VERIFICATION=abc123def456ghi789jkl012mno345pqr678stu901vwx234
     ```
   - Пересоберите и задеплойте сайт (`npm run build`)
   - Нажмите **«Подтвердить»** в Google Search Console
5. После верификации нажмите **«Сайтмап»** в левом меню → введите `sitemap.xml` → **«Отправить»**
6. Подождите 1–3 дня, пока Google проиндексирует сайт.

> **Совет:** В разделе «Покрытие» → «Действительные страницы» можно увидеть, какие страницы уже проиндексированы.

---

### Шаг 4 — Яндекс.Вебмастер

1. Перейдите на [webmaster.yandex.ru](https://webmaster.yandex.ru)
2. Нажмите **«+»** (добавить сайт) → введите URL сайта
3. Выберите способ верификации **«meta-тег»**:
   - Скопируйте значение из `content`, например: `a1b2c3d4e5f6g7h8i9j0`
   - Вставьте в `.env.local`:
     ```
     NEXT_PUBLIC_YANDEX_VERIFICATION=a1b2c3d4e5f6g7h8i9j0
     ```
   - Пересоберите и задеплойте сайт
   - Нажмите **«Проверить»** в Яндекс.Вебмастер
4. После верификации перейдите в **«Индексирование»** → **«Файл Sitemap»**:
   - Нажмите **«Добавить»**
   - Введите: `https://ваш-домен.by/sitemap.xml`
   - Нажмите **«Добавить»**
5. В разделе **«Проверка»** → **«Индексирование страниц»** нажмите **«Переобходить»** — Яндекс начнёт индексацию быстрее.

---

### Шаг 5 — Проверить структурированные данные (JSON-LD)

Убедитесь, что Google правильно видит бизнес-информацию:

1. Перейдите на [search.google.com/test/rich-results](https://search.google.com/test/rich-results)
2. Введите URL сайта
3. Нажмите **«Проверить URL»**
4. Вы должны увидеть **LocalBusiness** с зелёной галочкой

---

### Шаг 6 — Яндекс.Бизнес (дополнительно, очень рекомендуется)

Яндекс.Бизнес — это карточка на Яндекс Картах и в поиске. Сильно повышает видимость для локального бизнеса:

1. Перейдите на [business.yandex.ru](https://business.yandex.ru)
2. Нажмите **«Добавить организацию»**
3. Заполните:
   - Название: *ИП Шугайло — Электромонтажные работы*
   - Категория: *Электрик*
   - Адрес: *Брестская обл., Пинский р-н, д. Берёзовичи, ул. Садовая, 38*
   - Телефон: *+375 29 164-53-88*
   - Сайт: *https://ваш-домен.by*
   - Режим работы: *Пн–Вс: 8:00–21:00*
4. Добавьте фотографии выполненных работ из папки `public/works/`
5. Дождитесь модерации (1–5 дней)

---

### Шаг 7 — Google Мой бизнес (дополнительно)

Аналог Яндекс.Бизнеса от Google:

1. Перейдите на [business.google.com](https://business.google.com)
2. Нажмите **«Добавить компанию»**
3. Заполните аналогично шагу 6
4. Google пришлёт открытку с кодом верификации по почте (1–2 недели)

---

## Ожидаемые сроки индексации

| Поисковик | Первая индексация | Полное индексирование |
|---|---|---|
| Google | 1–7 дней | 2–4 недели |
| Яндекс | 1–3 дня | 1–2 недели |

> Новые сайты без истории могут индексироваться дольше. После появления первых посетителей процесс ускоряется.

---

## Структура проекта

```
src/
├── app/
│   ├── layout.tsx          ← SEO-метаданные, JSON-LD, шрифты
│   ├── page.tsx            ← Главная страница
│   ├── robots.ts           ← /robots.txt
│   ├── sitemap.ts          ← /sitemap.xml
│   └── opengraph-image.tsx ← /opengraph-image.png (OG-превью)
├── components/
│   ├── JsonLd.tsx          ← Структурированные данные (schema.org)
│   └── YandexMetrika.tsx   ← Яндекс.Метрика
└── sections/               ← Секции лендинга
```
