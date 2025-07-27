@echo off
echo Применение тестовых данных к базе данных BookHub...

REM Проверяем, установлен ли psql
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: psql не найден в PATH
    echo Установите PostgreSQL или добавьте psql в PATH
    pause
    exit /b 1
)

REM Применяем тестовые данные
echo Применяем тестовые данные...
psql -h localhost -p 5151 -U postgres -d BookHub -f Scripts\test_data.sql

if %errorlevel% equ 0 (
    echo Тестовые данные успешно применены!
) else (
    echo ОШИБКА при применении тестовых данных
)

pause 