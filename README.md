# AFK Bot for Minecraft

Бот для Minecraft на mineflayer. Подключается к серверу, иногда двигается и смотрит в разные стороны.

> Используйте только на своём сервере или там, где это разрешено правилами сервера.

## Файлы

```text
afk-bot/
├── index.js
├── keep_alive.js
├── config.json
├── config.example.json
├── package.json
├── Procfile
├── README.md
└── .gitignore
```

## Установка

```bash
npm install
```

## Настройка

Откройте `config.json`:

```json
{
  "ip": "your-server.example.com",
  "port": 25565,
  "name": "your_bot_name",
  "version": "1.20.1"
}
```

Если не знаете версию, можно оставить:

```json
"version": false
```

## Запуск

```bash
npm start
```

## GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ВАШ_НИК/НАЗВАНИЕ_РЕПО.git
git push -u origin main
```

## Важно

Не загружайте папку `node_modules/` на GitHub.

Если репозиторий публичный и вы не хотите светить IP сервера/ник бота, добавьте `config.json` в `.gitignore`, а в репозитории оставьте только `config.example.json`.
