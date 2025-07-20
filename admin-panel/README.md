# Oyna Admin Panel

Веб-интерфейс для администрирования системы Oyna с разграничением ролей.

## Требования

- Node.js 18.0.0 или выше
- npm 8.0.0 или выше

## Установка

1. **Установите Node.js и npm**
   
   Скачайте и установите Node.js с официального сайта: https://nodejs.org/
   
   Проверьте установку:
   ```bash
   node --version
   npm --version
   ```

2. **Установите зависимости**
   
   Перейдите в папку admin-panel и установите зависимости:
   ```bash
   cd admin-panel
   npm install
   ```

## Запуск приложения

### Режим разработки

```bash
npm start
```

Приложение будет доступно по адресу: http://localhost:3001

### Сборка для продакшена

```bash
npm run build
```

Собранное приложение будет находиться в папке `build/`

## Архитектура

### Структура проекта

```
admin-panel/
├── public/
│   └── index.html          # HTML шаблон
├── src/
│   ├── components/         # Переиспользуемые компоненты
│   ├── pages/             # Страницы приложения
│   │   ├── admin/         # Административные страницы
│   │   ├── LoginPage.tsx  # Страница входа
│   │   └── DashboardPage.tsx # Главная панель
│   ├── services/          # API сервисы
│   │   └── api.ts         # Клиент для работы с API
│   ├── types/             # TypeScript типы
│   │   └── index.ts       # Определения типов
│   ├── utils/             # Утилиты
│   │   └── AuthContext.tsx # Контекст авторизации
│   ├── App.tsx            # Главный компонент
│   └── index.tsx          # Точка входа
├── package.json           # Конфигурация npm
└── tsconfig.json          # Конфигурация TypeScript
```

### Используемые технологии

- **React 18** - UI библиотека
- **TypeScript** - Типизированный JavaScript
- **Material-UI (MUI)** - Компоненты интерфейса
- **React Router** - Маршрутизация
- **Axios** - HTTP клиент

## Роли и доступы

### SuperAdmin (Супер Администратор)
- Полный доступ ко всем функциям
- Управление пользователями и их ролями
- Просмотр системных логов и аудита
- Настройка системы

### Admin (Администратор)
- Управление пользователями (кроме SuperAdmin)
- Управление клубами и их настройками
- Просмотр и управление платежами
- Отправка уведомлений

### Manager (Менеджер)
- Управление бронированиями
- Просмотр клубов
- Отправка уведомлений пользователям
- Просмотр базовой статистики

### User (Пользователь)
- Доступ только к клиентской части (не к админке)

## Конфигурация API

В файле `src/services/api.ts` настройте базовый URL для подключения к API:

```typescript
const API_BASE_URL = 'https://localhost:7183/api'; // Замените на ваш API URL
```

## Основные компоненты

### AuthContext
Управляет состоянием авторизации, хранит информацию о текущем пользователе и его ролях.

### ProtectedRoute
Компонент для защиты маршрутов по ролям пользователя.

### ApiService
Централизованный сервис для работы с REST API бэкенда.

## Деплой

### Деплой на сервер

1. Соберите приложение:
   ```bash
   npm run build
   ```

2. Скопируйте содержимое папки `build/` на ваш веб-сервер

3. Настройте веб-сервер для SPA:
   - Все запросы должны возвращать `index.html`
   - Настройте CORS для API запросов

### Переменные окружения

Создайте файл `.env` в корне папки admin-panel:

```
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_ENV=production
```

## Разработка

### Добавление новых страниц

1. Создайте компонент в папке `src/pages/`
2. Добавьте маршрут в `src/App.tsx`
3. Добавьте пункт навигации в `src/pages/DashboardPage.tsx`

### Добавление API методов

1. Добавьте типы в `src/types/index.ts`
2. Добавьте методы в `src/services/api.ts`
3. Используйте в компонентах

### Стилизация

Используйте Material-UI компоненты и систему тем:

```typescript
import { styled } from '@mui/material/styles';

const StyledComponent = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));
```

## Troubleshooting

### Ошибки установки

1. **Cannot find module 'react'**
   ```bash
   npm install react react-dom @types/react @types/react-dom
   ```

2. **Cannot find module '@mui/material'**
   ```bash
   npm install @mui/material @emotion/react @emotion/styled
   npm install @mui/icons-material
   ```

3. **Cannot find module 'react-router-dom'**
   ```bash
   npm install react-router-dom @types/react-router-dom
   ```

4. **Axios import errors**
   ```bash
   npm install axios
   ```

### Проблемы с CORS

Если API возвращает ошибки CORS, настройте прокси в `package.json`:

```json
{
  "name": "admin-panel",
  "proxy": "https://localhost:7183",
  ...
}
```

### Ошибки авторизации

Проверьте:
1. Правильность API URL
2. Формат JWT токенов
3. Настройки CORS на бэкенде
4. Время жизни токенов

## Поддержка

Для получения помощи или сообщения об ошибках:
1. Проверьте логи в консоли браузера
2. Проверьте сетевые запросы в DevTools
3. Проверьте логи API сервера
