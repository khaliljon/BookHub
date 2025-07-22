@echo off
echo "🚀 Запуск полной системы..."

echo "🔧 Запуск API сервера..."
start "API Server" cmd /k "cd /d \"d:\Visual Studio\2022\Community\source\repos\OynaApi\" && dotnet run"

timeout /t 10

echo "🌐 Запуск админ-панели..."
start "Admin Panel" cmd /k "cd /d \"d:\Visual Studio\2022\Community\source\repos\OynaApi\admin-panel\" && npm start"

echo "✅ Все сервисы запущены!"
echo "API: https://localhost:7183"
echo "Админ-панель: http://localhost:3001"
pause
