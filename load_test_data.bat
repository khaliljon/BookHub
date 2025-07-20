@echo off
echo 🎮 Загрузка тестовых данных для Oyna Gaming System...
echo.

REM Настройки подключения к базе данных
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=oyna_db
set DB_USER=postgres

echo 📊 Подключение к базе данных...
echo Хост: %DB_HOST%:%DB_PORT%
echo База: %DB_NAME%
echo Пользователь: %DB_USER%
echo.

REM Проверяем, существует ли psql
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ОШИБКА: PostgreSQL psql не найден в PATH
    echo Убедитесь, что PostgreSQL установлен и добавлен в PATH
    echo Обычно psql находится в: C:\Program Files\PostgreSQL\[версия]\bin\
    pause
    exit /b 1
)

echo 🚀 Загружаем тестовые данные...
psql -h %DB_HOST% -p %DB_PORT% -d %DB_NAME% -U %DB_USER% -f test_data.sql

if %errorlevel% equ 0 (
    echo.
    echo ✅ Тестовые данные успешно загружены!
    echo.
    echo 📋 Что было создано:
    echo   • 5 игровых клубов в разных городах
    echo   • 9 игровых залов с разными тематиками  
    echo   • Автоматически созданные места в залах
    echo   • 9 различных тарифов
    echo   • 10 тестовых пользователей с разными ролями
    echo   • 20 тестовых бронирований
    echo   • Уведомления для пользователей
    echo.
    echo 🎯 Тестовые аккаунты:
    echo   Админ: aleksey.petrov@email.com (пароль: 123456)
    echo   Менеджер: maria.sidorova@email.com (пароль: 123456)
    echo   Пользователь: ivan.sokolov@email.com (пароль: 123456)
    echo.
    echo 🌟 Теперь вы можете:
    echo   1. Зайти в админ-панель http://localhost:3001
    echo   2. Посмотреть красивую статистику
    echo   3. Управлять пользователями и клубами
    echo   4. Тестировать все функции системы
    echo.
) else (
    echo.
    echo ❌ ОШИБКА при загрузке тестовых данных
    echo Проверьте подключение к базе данных и права доступа
)

echo Нажмите любую клавишу для завершения...
pause >nul
