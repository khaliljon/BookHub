@echo off
echo Исправление базы данных BookHub...

REM Если у вас есть psql в PATH, раскомментируйте следующую строку:
REM psql -h localhost -p 5151 -U postgres -d BookHub -f fix_roles_table.sql

echo.
echo Если у вас установлен PostgreSQL, выполните вручную:
echo psql -h localhost -p 5151 -U postgres -d BookHub -f fix_roles_table.sql
echo.
echo Или скопируйте содержимое файла fix_roles_table.sql и выполните в pgAdmin
echo.

pause 