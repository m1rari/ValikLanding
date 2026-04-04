# Telegram Admin Bot — управление сервером из Telegram

Отдельный сервис: тот же (или новый) Telegram-бот с кнопками для админа — статус сервера/приложения, перезапуск приложения, обновление кода, перезапуск сервера (вне Docker).

## Docker Compose (профиль `admin`)

Если сайт крутится через **Docker Compose** из корня репозитория (см. основной README), поднимите бота так:

```bash
docker compose -f docker/docker-compose.yml --profile admin up -d
```

В контейнер передаётся `USE_DOCKER_DEPLOY=1`: команды идут через **`docker compose -f docker/docker-compose.yml`** в каталоге проекта на хосте (том `/workspace`), перезапускаются сервисы **web** и **nginx**, обновление делает `git pull` → `build web` → `up -d web nginx`. Перезагрузка **всего сервера** из бота отключена — используйте SSH или панель хостинга.

Если продакшен поднимаете с **HTTPS-оверлеем**, в корневом `.env` задайте для бота ту же связку файлов, что и вручную:

```env
DOCKER_COMPOSE_ARGS=-f docker/docker-compose.yml -f docker/docker-compose.https.yml
```

Иначе по умолчанию бот использует только `docker/docker-compose.yml` (для `restart` и `ps` этого достаточно; для **`up` после обновления** с TLS лучше указать оба `-f`, как выше).

Переменные **`TELEGRAM_BOT_TOKEN`** и **`TELEGRAM_ADMIN_CHAT_ID`** (или `TELEGRAM_CHAT_ID`) задайте в корневом **`.env`**, который уже подключается к сервису `admin-bot`.

## Кнопки (классический PM2 на хосте)

| Кнопка | Действие |
|--------|----------|
| Статус сервера | `uptime`, `free -m`, `df -h /` |
| Статус приложения | `pm2 list` |
| Перезапуск приложения | `pm2 restart` |
| Обновить приложение | `git fetch`, `git pull`, `npm run build`, `pm2 restart` |
| Перезапуск сервера | подтверждение → `sudo reboot` |

## Кнопки (режим Docker)

| Кнопка | Действие |
|--------|----------|
| Статус сервера | `docker compose -f docker/docker-compose.yml ps`, диск |
| Статус приложения | `docker compose -f docker/docker-compose.yml ps web` |
| Перезапуск приложения | `docker compose … restart web nginx` |
| Обновить приложение | `git pull`, `docker compose … build web`, `up -d web nginx` |
| Перезапуск сервера | недоступно (сообщение в чате) |

Доступ только у чата с **TELEGRAM_ADMIN_CHAT_ID**.

## Установка на сервере (Ubuntu)

Бот должен работать **на самом сервере**, чтобы выполнять команды (`pm2`, `git`, `reboot`).

### 1. Скопировать бота на сервер

Из папки проекта на ПК (где уже есть `telegram-admin-bot/`):

```bash
# Вариант А: репозиторий уже клонирован на сервере в /var/www/ValikLanding
# Тогда папка telegram-admin-bot уже есть внутри проекта.

# Вариант Б: скопировать только папку бота на сервер
scp -r telegram-admin-bot root@185.40.4.165:/var/www/ValikLanding/
```

### 2. На сервере: установка и настройка

```bash
ssh root@185.40.4.165
cd /var/www/ValikLanding/telegram-admin-bot

# Зависимости
npm install

```

Если в корне проекта уже есть **.env.local** с `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`, их **дублировать не нужно** — бот читает этот файл автоматически.

Создайте **.env** в папке `telegram-admin-bot/` только если нужно задать переменные бота (иначе возьмутся значения по умолчанию):

```env
# Опционально: путь к проекту и имя в PM2 (если не заданы — см. значения по умолчанию ниже)
APP_DIR=/var/www/ValikLanding
PM2_APP_NAME=ValikLanding
BUILD_SCRIPT=build
```

- **TELEGRAM_BOT_TOKEN** и **TELEGRAM_CHAT_ID** — берутся из `../.env.local` (тот же файл, что и для сайта).
- **APP_DIR** — по умолчанию `/var/www/ValikLanding`.
- **PM2_APP_NAME** — по умолчанию `all`; укажите имя приложения из `pm2 list` (например `ValikLanding`).
- **BUILD_SCRIPT** — по умолчанию `build`; при необходимости можно задать `build:dev`.

### 3. Запуск через PM2

```bash
cd /var/www/ValikLanding/telegram-admin-bot
pm2 start index.js --name telegram-admin-bot
pm2 save
pm2 startup
```

Проверка: в Telegram напишите боту `/start` — должно прийти сообщение с кнопками.

### 4. Перезапуск сервера (опционально)

Чтобы кнопка «Перезапуск сервера» работала, пользователь `root` (или пользователь, под которым запущен бот) должен иметь право выполнять `reboot` без пароля:

```bash
sudo visudo
```

Добавьте строку (замените `root` на пользователя, если бот запущен не от root):

```
root ALL=(ALL) NOPASSWD: /sbin/reboot
```

Сохраните и выйдите. После этого кнопка «Перезапуск сервера» выполнит `sudo reboot`.

## Безопасность

- Никому не передавайте **TELEGRAM_BOT_TOKEN** и **TELEGRAM_ADMIN_CHAT_ID**.
- Управление возможно только из чата с указанным `TELEGRAM_ADMIN_CHAT_ID`; остальные запросы игнорируются.
- Рекомендуется сменить пароль от сервера, если он где-то передавался в открытом виде.

## Обновление бота после изменений в коде

На сервере:

```bash
cd /var/www/ValikLanding
git pull
cd telegram-admin-bot
npm install
pm2 restart telegram-admin-bot
```
