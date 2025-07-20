@echo off
echo "Запуск API сервера..."
start "API Server" cmd /k "cd /d \"d:\Visual Studio\2022\Community\source\repos\OynaApi\" && dotnet run"

echo "Ожидание 10 секунд..."
timeout /t 10 /nobreak > nul

echo "Запуск React сервера..."
start "React Server" cmd /k "cd /d \"d:\Visual Studio\2022\Community\source\repos\OynaApi\admin-panel\" && npm start"

echo "Серверы запущены!"
echo "API: https://localhost:7183"
echo "React: http://localhost:3001"
pause
