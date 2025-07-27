using System.Security.Claims;
using BookHub.Models.New;
using Microsoft.AspNetCore.Mvc;

namespace BookHub.Helpers
{
    /// <summary>
    /// Хелпер для проверки прав доступа. Единая точка для всех контроллеров.
    /// </summary>
    public static class AuthorizationHelper
    {
        /// <summary>
        /// Проверяет право пользователя по матрице или дефолтным значениям.
        /// </summary>
        public static bool HasPermission(ClaimsPrincipal user, string group, string action, Func<int, Role?> getRoleByUserId)
        {
            if (user == null) return false;
        if (IsSuperAdmin(user)) return true;
            int userId = GetCurrentUserId(user);
            var role = getRoleByUserId(userId);
            if (role == null)
                return false;
            // В новой архитектуре проверяем только по имени роли
            return GetDefaultPermission(role.Name, group, action);
        }

        /// <summary>
        /// Дефолтные права для ролей (если нет матрицы).
        /// </summary>
        private static bool GetDefaultPermission(string roleName, string group, string action)
        {
            if (string.IsNullOrEmpty(roleName)) return false;
            switch (roleName)
            {
                case "SuperAdmin": return true;
                case "Admin": return action != "delete";
                case "Manager": return action != "delete" && group != "АудитЛоги";
                case "User": return action == "read" || action == "update";
                default: return false;
            }
        }

        /// <summary>
        /// Получить ID текущего пользователя.
        /// </summary>
        public static int GetCurrentUserId(ClaimsPrincipal user)
        {
            var userIdClaim = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out int userId) ? userId : 0;
        }

        /// <summary>
        /// Получить ID клуба, которым управляет менеджер.
        /// </summary>
        public static int? GetManagedClubId(ClaimsPrincipal user)
        {
            var clubIdClaim = user?.FindFirst("ManagedClubId")?.Value;
            return int.TryParse(clubIdClaim, out int clubId) ? clubId : null;
        }

        /// <summary>
        /// Проверка роли SuperAdmin.
        /// </summary>
        public static bool IsSuperAdmin(ClaimsPrincipal user) => user?.IsInRole("SuperAdmin") ?? false;

        /// <summary>
        /// Проверка роли Admin или выше.
        /// </summary>
        public static bool IsAdminOrHigher(ClaimsPrincipal user) => user?.IsInRole("SuperAdmin") == true || user?.IsInRole("Admin") == true;

        /// <summary>
        /// Проверка роли Manager или выше.
        /// </summary>
        public static bool IsManagerOrHigher(ClaimsPrincipal user) => user?.IsInRole("SuperAdmin") == true || user?.IsInRole("Admin") == true || user?.IsInRole("Manager") == true;

        /// <summary>
        /// Может ли пользователь управлять клубом.
        /// </summary>
        public static bool CanManageClub(ClaimsPrincipal user, int clubId)
        {
            if (IsAdminOrHigher(user)) return true;
            if (user?.IsInRole("Manager") == true)
            {
                var managedClubId = GetManagedClubId(user);
                return managedClubId.HasValue && managedClubId.Value == clubId;
            }
            return false;
        }

        /// <summary>
        /// Может ли пользователь просматривать другого пользователя.
        /// </summary>
        public static bool CanViewUser(ClaimsPrincipal user, int targetUserId)
        {
            var currentUserId = GetCurrentUserId(user);
            return currentUserId == targetUserId || IsAdminOrHigher(user);
        }

        /// <summary>
        /// Может ли пользователь редактировать другого пользователя.
        /// </summary>
        public static bool CanEditUser(ClaimsPrincipal user, int targetUserId)
        {
            var currentUserId = GetCurrentUserId(user);
            return currentUserId == targetUserId || IsAdminOrHigher(user);
        }

        /// <summary>
        /// Может ли пользователь просматривать бронирование.
        /// </summary>
        public static bool CanViewBooking(ClaimsPrincipal user, int bookingUserId, int? clubId = null)
        {
            var currentUserId = GetCurrentUserId(user);
            if (currentUserId == bookingUserId) return true;
            if (IsAdminOrHigher(user)) return true;
            if (user?.IsInRole("Manager") == true && clubId.HasValue)
                return CanManageClub(user, clubId.Value);
            return false;
        }

        /// <summary>
        /// Возвращает результат 403 с сообщением.
        /// </summary>
        public static IActionResult CreateForbidResult(string message = "Недостаточно прав для выполнения этой операции")
        {
            return new ObjectResult(new { error = message }) { StatusCode = 403 };
        }
    }
}
