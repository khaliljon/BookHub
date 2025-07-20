@echo off
chcp 65001 > nul
echo =====================================================
echo CLEANUP ROLES SCRIPT FOR OYNA API
echo =====================================================
echo.

set PGPASSWORD=your_password_here

echo Подключение к базе данных для очистки ролей...
echo.

psql -h localhost -d oyna_db -U postgres -f cleanup_roles.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =====================================================
    echo ✅ Роли успешно удалены!
    echo =====================================================
) else (
    echo.
    echo =====================================================
    echo ❌ Ошибка при удалении ролей
    echo =====================================================
)

echo.
echo Нажмите любую клавишу для выхода...
pause > nul
