-- Обновление паролей пользователей с правильными BCrypt хэшами
-- Пароль для всех пользователей: 123456

UPDATE users SET password_hash = '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE id = 1;
UPDATE users SET password_hash = '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE id = 2;
UPDATE users SET password_hash = '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE id = 3;
UPDATE users SET password_hash = '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE id = 4;
UPDATE users SET password_hash = '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE id = 5;

-- Проверка обновления
SELECT id, full_name, email, LEFT(password_hash, 20) as password_preview FROM users ORDER BY id; 