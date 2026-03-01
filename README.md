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

### Вариант В — **Обновление сайта** (после изменений в коде)

```bash
# На VPS — стянуть изменения и пересобрать
cd /var/www/ValikLanding
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
