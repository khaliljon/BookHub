@echo off
echo.
echo 🎯 === БЫСТРЫЙ СТАРТ OYNA GAMING SYSTEM ===
echo.
echo 📋 Пошаговая инструкция для запуска системы:
echo.
echo 1️⃣  ЗАГРУЗИТЬ ТЕСТОВЫЕ ДАННЫЕ:
echo    Выполните: load_test_data.bat
echo    Это создаст красивые тестовые данные для демонстрации
echo.
echo 2️⃣  ЗАПУСТИТЬ СИСТЕМУ:
echo    Выполните: start-all.ps1 или start-all.bat
echo    Это запустит API (порт 7183) и админ-панель (порт 3001)
echo.
echo 3️⃣  ОТКРЫТЬ АДМИН-ПАНЕЛЬ:
echo    Перейдите по адресу: http://localhost:3001
echo.
echo 🔐 ТЕСТОВЫЕ АККАУНТЫ:
echo    Суперадмин: khalych.kz@gmail.com / Burbik27092004
echo    Админ: aleksey.petrov@email.com / 123456
echo    Менеджер: maria.sidorova@email.com / 123456
echo    Пользователь: ivan.sokolov@email.com / 123456
echo.
echo 🎮 ЧТО МОЖНО ПОСМОТРЕТЬ:
echo    • Красивый дашборд с живой статистикой
echo    • Управление пользователями с ролями
echo    • 5 игровых клубов в разных городах
echo    • 20 тестовых бронирований
echo    • 10 пользователей с разными ролями
echo    • Современный Material UI дизайн
echo.
echo 💡 ПОЛЕЗНЫЕ ССЫЛКИ:
echo    API документация: https://localhost:7183/swagger
echo    Админ-панель: http://localhost:3001
echo    База данных: PostgreSQL (localhost:5432/BookHub)
echo.
echo 🚀 ГОТОВЫ НАЧАТЬ? Нажмите любую клавишу...
pause >nul

echo.
echo 🔄 Хотите загрузить тестовые данные? (y/n)
set /p choice="Ваш выбор: "
if /i "%choice%"=="y" (
    echo.
    echo 📊 Загружаем тестовые данные...
    call load_test_data.bat
)

echo.
echo 🚀 Хотите запустить систему? (y/n)
set /p choice2="Ваш выбор: "
if /i "%choice2%"=="y" (
    echo.
    echo 🎯 Запускаем систему...
    start "" cmd /c "powershell -ExecutionPolicy Bypass -File start-all.ps1"
    
    echo.
    echo ⏳ Ждем 5 секунд и открываем браузер...
    timeout /t 5 >nul
    start "" "http://localhost:3001"
)

echo.
echo ✨ Приятной работы с Oyna Gaming System!
echo 📞 При возникновении вопросов - проверьте README.md
echo.
pause
