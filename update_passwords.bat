@echo off
echo Обновление паролей пользователей...

REM Проверяем, установлен ли psql
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: psql не найден в PATH
    echo Установите PostgreSQL или добавьте psql в PATH
    pause
    exit /b 1
)

REM Обновляем пароли
echo Обновляем пароли...
psql -h localhost -p 5151 -U postgres -d BookHub -f Scripts\update_passwords.sql

if %errorlevel% equ 0 (
    echo Пароли успешно обновлены!
    echo Теперь можно войти с паролем: 123456
) else (
    echo ОШИБКА при обновлении паролей
)

pause 