# TourGuide-React

Разработка веб-приложения и Telegram-бота для туристов, которые помогают находить достопримечательности, получать рекомендации на основе местоположения и записываться на экскурсии от местных гидов. Приложение объединяет туристов и экскурсоводов в одной платформе, где можно оценивать, бронировать и делиться впечатлениями.

## Структура ветвления Git

```text
main
 │
 └── dev
      ├── front
      │     ├── frontend/feature-login-page
      │     └── frontend/feature-user-profile
      │
      └── back
            ├── backend/feature-auth
            └── backend/feature-order-processing
```

## Структура проекта

```text
tourist-guide/
├── backend/                  # Django проект
│   ├── config/               # Основные настройки проекта (корневой Django проект)
│   ├── apps/                 # Приложения Django
│   │   ├── attractions/      # Достопримечательности
│   │   ├── users/            # Пользователи и аутентификация
│   │   ├── tours/            # Экскурсии и бронирования
│   │   ├── reviews/          # Отзывы и рейтинги
│   │   └── zones/            # Геозоны
│   ├── static/               # Статические файлы (если нужно)
│   ├── media/                # Загружаемые файлы (фото достопримечательностей)
│   ├── manage.py
│   └── requirements.txt      # Зависимости Python
└── frontend/                 # React приложение
    ├── public/               # Статические файлы (index.html и т.д.)
    ├── src/
    │   ├── api/              # API клиент (axios)
    │   ├── components/       # React компоненты
    │   ├── pages/            # Страницы приложения
    │   ├── styles/           # Глобальные стили
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── .env                  # Настройки фронтенда
```
