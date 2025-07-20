@echo off
echo Настройка базы данных OynaApi...
echo.

set /p DB_USER="Введите пользователя PostgreSQL (по умолчанию: postgres): "
if "%DB_USER%"=="" set DB_USER=postgres

set /p DB_NAME="Введите название базы данных (по умолчанию: oyna_db): "
if "%DB_NAME%"=="" set DB_NAME=oyna_db

set /p DB_HOST="Введите хост (по умолчанию: localhost): "
if "%DB_HOST%"=="" set DB_HOST=localhost

set /p DB_PORT="Введите порт (по умолчанию: 5432): "
if "%DB_PORT%"=="" set DB_PORT=5432

echo.
echo Выполняем SQL скрипт...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f Scripts/setup_database.sql

if %errorlevel% equ 0 (
    echo.
    echo ✅ База данных успешно настроена!
    echo.
    echo Теперь можете запустить проект командой: dotnet run
) else (
    echo.
    echo ❌ Ошибка при настройке базы данных
    echo Проверьте параметры подключения и попробуйте снова
)

echo.
pause
