Write-Host "Применение миграций к базе данных BookHub..." -ForegroundColor Green

# Проверяем, есть ли dotnet ef
try {
    $efVersion = dotnet ef --version
    Write-Host "EF Core CLI найден: $efVersion" -ForegroundColor Green
} catch {
    Write-Host "ОШИБКА: dotnet ef не найден" -ForegroundColor Red
    Write-Host "Установите EF Core CLI: dotnet tool install --global dotnet-ef" -ForegroundColor Yellow
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

# Применяем миграции
Write-Host "Применяем миграции..." -ForegroundColor Yellow
dotnet ef database update --project BookHub.csproj

if ($LASTEXITCODE -eq 0) {
    Write-Host "Миграции успешно применены!" -ForegroundColor Green
} else {
    Write-Host "ОШИБКА при применении миграций" -ForegroundColor Red
}

Read-Host "Нажмите Enter для выхода" 