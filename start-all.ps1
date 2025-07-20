# Запуск API сервера
Write-Host "🚀 Запуск API сервера..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-Command", "cd 'd:\Visual Studio\2022\Community\source\repos\OynaApi'; dotnet run" -WindowStyle Normal

# Ждем 10 секунд для запуска API
Start-Sleep -Seconds 10

# Запуск админ-панели
Write-Host "🌐 Запуск админ-панели..." -ForegroundColor Green  
Start-Process powershell -ArgumentList "-Command", "cd 'd:\Visual Studio\2022\Community\source\repos\OynaApi\admin-panel'; npm start" -WindowStyle Normal

Write-Host "✅ Все сервисы запущены!" -ForegroundColor Green
Write-Host "API: https://localhost:7183" -ForegroundColor Yellow
Write-Host "Админ-панель: http://localhost:3001" -ForegroundColor Yellow

Read-Host "Нажмите Enter для завершения..."
