-- Создание роли SuperAdmin, если её нет
INSERT INTO "roles" ("name", "description", "is_active", "created_at", "updated_at")
SELECT 'SuperAdmin', 'Супер администратор с полными правами', true, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "roles" WHERE "name" = 'SuperAdmin'
);

-- Назначение роли SuperAdmin пользователю khalych.kz@gmail.com
INSERT INTO "user_roles" ("user_id", "role_id", "assigned_at")
SELECT u.id, r.id, NOW()
FROM "users" u, "roles" r
WHERE u.email = 'khalych.kz@gmail.com' 
  AND r.name = 'SuperAdmin'
  AND NOT EXISTS (
    SELECT 1 FROM "user_roles" ur 
    WHERE ur.user_id = u.id AND ur.role_id = r.id
  );

-- Проверим результат
SELECT 
    u.email,
    u.full_name,
    r.name as role_name,
    r.description as role_description
FROM "users" u
JOIN "user_roles" ur ON u.id = ur.user_id
JOIN "roles" r ON r.id = ur.role_id
WHERE u.email = 'khalych.kz@gmail.com';
