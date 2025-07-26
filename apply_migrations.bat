@echo off
echo Применение миграций к базе данных BookHub...

REM Проверяем, установлен ли psql
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: psql не найден в PATH
    echo Установите PostgreSQL или добавьте psql в PATH
    pause
    exit /b 1
)

REM Применяем миграции
echo Применяем миграции...
psql -h localhost -p 5151 -U postgres -d BookHub -f Scripts\apply_migrations.sql

if %errorlevel% equ 0 (
    echo Миграции успешно применены!
) else (
    echo ОШИБКА при применении миграций
)

pause 