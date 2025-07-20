#!/bin/bash

echo "Настройка базы данных OynaApi..."
echo

read -p "Введите пользователя PostgreSQL (по умолчанию: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -p "Введите название базы данных (по умолчанию: oyna_db): " DB_NAME
DB_NAME=${DB_NAME:-oyna_db}

read -p "Введите хост (по умолчанию: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Введите порт (по умолчанию: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

echo
echo "Выполняем SQL скрипт..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f Scripts/setup_database.sql

if [ $? -eq 0 ]; then
    echo
    echo "✅ База данных успешно настроена!"
    echo
    echo "Теперь можете запустить проект командой: dotnet run"
else
    echo
    echo "❌ Ошибка при настройке базы данных"
    echo "Проверьте параметры подключения и попробуйте снова"
fi

echo
read -p "Нажмите Enter для продолжения..."
