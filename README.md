# ⚡ ЭлектроМастер — Landing Page

Одностраничный сайт (Landing Page) для ИП Шугайло Валентин Георгиевич — электромонтажные работы в Пинске и Пинском районе.

---

## 🗂 Структура проекта

```
ValikLanding/
├── src/
│   ├── app/
│   │   ├── api/contact/route.ts   # API-маршрут: приём заявок с формы
│   │   ├── globals.css            # Глобальные стили + Tailwind
│   │   ├── layout.tsx             # Корневой макет (Header, Footer, мета-теги)
│   │   └── page.tsx               # Главная страница — сборка всех секций
│   ├── components/
│   ├── data/
│   ├── sections/
│   └── utils/
├── docker/
│   └── nginx/
│       └── default.conf           # Nginx → прокси на контейнер Next.js
├── Dockerfile                     # Сборка Next.js (режим standalone)
├── docker-compose.yml             # web + nginx (+ admin-bot по профилю admin)
├── telegram-admin-bot/            # Опциональный бот администратора
├── tailwind.config.ts
├── .env.local                     # Локальная разработка (секреты, не в git)
├── .env.example                   # Шаблон переменных (в т.ч. для Docker на VPS)
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
4. Откройте в браузере (подставьте **ваш** токен от BotFather):
   ```
   https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
   ```
5. В ответе найдите `"chat": { "id": … }` — это ваш **Chat ID**

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

### 3. Переменные окружения

**Локальная разработка:** создайте `.env.local` в корне репозитория (файл в `.gitignore`).

**Docker на своём сервере:** скопируйте шаблон и заполните секреты в файле `.env` (тоже не коммитьте):

```bash
cp .env.example .env
```

Пример содержимого (имена переменных совпадают с `.env.example`):

```env
# Публичные (для SEO и канонического URL). Для Docker — важно до сборки образа.
NEXT_PUBLIC_SITE_URL=https://ваш-домен.by
NEXT_PUBLIC_GOOGLE_VERIFICATION=
NEXT_PUBLIC_YANDEX_VERIFICATION=

# Заявки с формы
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
EMAILJS_PRIVATE_KEY=
```

> ⚠️ Секреты не публикуйте в git. Если не настроен Telegram или EmailJS, второй канал всё равно может доставить заявку.
>
> Для **Docker**: переменные `NEXT_PUBLIC_*` «вшиваются» при **`docker compose build`**; после смены домена или кодов верификации выполните `docker compose build web` снова.

---

## 🚀 Локальный запуск (для разработки)

```bash
# 1. Установить зависимости
npm install

# 2. Создать файл с ключами (см. раздел выше)
# Создайте .env.local и заполните (см. раздел «Переменные окружения»)

# 3. Запустить сервер разработки
npm run dev

# Сайт откроется на http://localhost:3000
```

---

## 📦 Деплой на сервер

### Вариант А — Vercel (быстро, бесплатный тариф)

Vercel — официальная платформа для Next.js.

1. Загрузите репозиторий на GitHub и импортируйте проект на [vercel.com](https://vercel.com).
2. В **Settings → Environment Variables** добавьте переменные из раздела «Переменные окружения» выше (включая `NEXT_PUBLIC_*`, Telegram, EmailJS).
3. **Deploy**. При необходимости привяжите домен в **Settings → Domains** и настройте DNS у регистратора (CNAME на `cname.vercel-dns.com` и т.п. — подскажет мастер Vercel).

---

### Вариант Б — свой VPS с Docker Compose (рекомендуемый вариант для Linux)

На сервере нужны только **Docker** и **Docker Compose v2** (плагин `docker compose`).

```bash
# Пример: Ubuntu — установка Docker (один раз)
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker "$USER"   # перелогиньтесь, чтобы группа применилась
```

**Развёртывание проекта:**

```bash
sudo mkdir -p /var/www && sudo chown "$USER":"$USER" /var/www
git clone https://github.com/ВАШ_АККАУНТ/ValikLanding.git /var/www/ValikLanding
cd /var/www/ValikLanding

cp .env.example .env
nano .env   # заполните секреты и NEXT_PUBLIC_SITE_URL под ваш домен

docker compose build web
docker compose up -d
```

Сайт слушает **порт 80** на хосте: контейнер **nginx** проксирует запросы в контейнер **web** (Next.js внутри сети Compose).

**Проверка:** `curl -I http://127.0.0.1` на сервере или откройте IP/домен в браузере.

**HTTPS (редирект на 443 и Let’s Encrypt, как в типичном конфиге на хосте)**  
У вас в Nginx на хосте указано `proxy_pass http://localhost:3000`. В Docker **контейнерный** Nginx должен ходить на сервис **`web:3000`**, а не на `localhost`. Пути к сертификатам в файле конфигурации можно оставить те же (`/etc/letsencrypt/...`), если смонтировать каталог с хоста в контейнер.

1. Скопируйте пример и при необходимости замените домен `pinsk-elektrik.by` на свой:
   ```bash
   cp docker/nginx/prod-https.example.conf docker/nginx/prod-https.conf
   ```
2. На сервере в `/etc/letsencrypt/` должны лежать файлы от Certbot (`fullchain.pem`, `privkey.pem`, `options-ssl-nginx.conf`, `ssl-dhparams.pem`).
3. Запуск с TLS:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.https.yml up -d
   ```

`docker/nginx/prod-https.conf` в репозиторий не коммитится (см. `.gitignore`).

**Без Nginx в Docker:** можно опубликовать только `web` на `127.0.0.1:3000` и оставить **ваш текущий системный** Nginx с `proxy_pass http://127.0.0.1:3000` и SSL — тогда отдельный compose-файл HTTPS не нужен.

**Обновление после `git push`:**

```bash
cd /var/www/ValikLanding
git pull
docker compose build web
docker compose -f docker-compose.yml -f docker-compose.https.yml up -d web nginx
```

Если работаете только по HTTP из compose — последняя команда без `-f docker-compose.https.yml`.

Если менялись только `NEXT_PUBLIC_*`, обязательно пересоберите образ `web` (см. выше). Секреты в `.env` подхватятся при следующем `up` без пересборки, если не трогали билд-аргументы.

**Admin-бот в Docker (опционально):** профиль `admin` поднимает контейнер с доступом к Docker-сокету для команд «перезапуск / обновление» через Compose. Задайте в `.env` как минимум `TELEGRAM_BOT_TOKEN` и `TELEGRAM_ADMIN_CHAT_ID` (или `TELEGRAM_CHAT_ID`). Запуск:

```bash
docker compose --profile admin up -d
```

В Docker-режиме кнопка перезагрузки **всего сервера** отключена; перезапуск приложения делается через перезапуск контейнеров `web` и `nginx`. Подробнее: [telegram-admin-bot/README.md](telegram-admin-bot/README.md).

---

### Вариант В — VPS без Docker (Node + PM2 + системный Nginx)

Если Docker не используете, можно по-прежнему собирать проект на сервере: установите Node.js 20, выполните `npm ci`, `npm run build`, запуск через `pm2 start npm --name ValikLanding -- start`, а Nginx настройте как обратный прокси на `http://127.0.0.1:3000`. Пошагово это дублирует стандартные гайды по Next.js + PM2; в текущем репозитории основная инструкция ориентирована на **Docker Compose**.

---

## 🔍 Что уже настроено для SEO

| Что | Где | Описание |
|---|---|---|
| Meta-теги | `src/app/layout.tsx` | title, description, keywords, robots |
| Open Graph / Twitter | `src/app/layout.tsx` | Превью в соцсетях |
| Canonical URL | `src/app/layout.tsx` | Основной URL страницы |
| OG-изображение | `src/app/opengraph-image.tsx` | 1200×630 |
| robots.txt | `src/app/robots.ts` | Индексация, sitemap |
| sitemap.xml | `src/app/sitemap.ts` | Карта сайта |
| JSON-LD (LocalBusiness) | `src/components/JsonLd.tsx` | Разметка для поисковиков |
| Яндекс.Метрика | `src/components/YandexMetrika.tsx` | Счётчик посещений |

После деплоя проверьте в браузере: `/robots.txt`, `/sitemap.xml`, `/opengraph-image.png`.

---

## 📌 Индексация: Google и Яндекс

### Шаг 1 — Домен и продакшен-URL

Укажите в `.env.local` (или в Vercel / в `.env` на сервере) переменную `NEXT_PUBLIC_SITE_URL=https://ваш-домен.by` и пересоберите приложение.

### Шаг 2 — Доступность

Откройте `https://ваш-сайт/robots.txt` и `https://ваш-сайт/sitemap.xml` — ответы должны быть успешными.

### Шаг 3 — Google Search Console

1. [search.google.com/search-console](https://search.google.com/search-console) → ресурс по префиксу URL.
2. Верификация через meta-тег: значение `content` вставьте в `NEXT_PUBLIC_GOOGLE_VERIFICATION`, пересоберите и задеплойте сайт, затем подтвердите в кабинете Google.
3. Раздел «Сайтмапы» → добавьте `sitemap.xml`.

### Шаг 4 — Яндекс.Вебмастер

1. [webmaster.yandex.ru](https://webmaster.yandex.ru) → добавить сайт.
2. Верификация meta-тегом → `NEXT_PUBLIC_YANDEX_VERIFICATION`, пересборка и деплой.
3. Индексирование → Sitemap: `https://ваш-домен.by/sitemap.xml`.

### Шаг 5 — Rich Results

[search.google.com/test/rich-results](https://search.google.com/test/rich-results) — проверка типа **LocalBusiness**.

### Шаг 6 — Яндекс.Бизнес и Google «Мой бизнес» (по желанию)

Карточки на картах и в локальном поиске: [business.yandex.ru](https://business.yandex.ru), [business.google.com](https://business.google.com). Укажите сайт `https://ваш-домен.by`, телефон и адрес из подвала сайта.

**Ориентиры по срокам индексации:** Google — часто от нескольких дней до нескольких недель; Яндекс — обычно быстрее на старте. Новые сайты могут индексироваться дольше.

---

## 📝 Частые вопросы

**Заявки не приходят в Telegram?**
- Убедитесь, что написали боту хотя бы одно сообщение — иначе Chat ID не появится в getUpdates
- Проверьте токен и Chat ID в `.env.local` (разработка) или в `.env` / настройках Vercel (продакшен)
- После смены переменных на VPS с Docker выполните `docker compose up -d web` (пересборка `web` не нужна, если менялись только серверные env)

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
