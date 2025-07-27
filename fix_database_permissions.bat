@echo off
echo Исправление проблемы с полем permissions_json...

REM Проверяем, установлен ли psql
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: psql не найден в PATH
    echo Установите PostgreSQL или добавьте psql в PATH
    echo Альтернативно, выполните SQL скрипт вручную в pgAdmin
    pause
    exit /b 1
)

REM Применяем исправление
echo Применяем исправление базы данных...
psql -h localhost -p 5151 -U postgres -d BookHub -f Scripts\fix_permissions_field.sql

if %errorlevel% equ 0 (
    echo База данных успешно исправлена!
    echo Теперь API должен работать корректно
) else (
    echo ОШИБКА при исправлении базы данных
    echo Попробуйте выполнить SQL скрипт вручную в pgAdmin
)

pause 