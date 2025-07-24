using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace BookHub.Helpers
{
    public static class AuthorizationHelper
    {
        /// <summary>
        /// Получает ID текущего пользователя из JWT токена
        /// </summary>
        public static int GetCurrentUserId(ClaimsPrincipal user)
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out int userId) ? userId : 0;
        }

        /// <summary>
        /// Получает ID клуба, которым управляет текущий пользователь (для менеджеров)
        /// </summary>
        public static int? GetManagedClubId(ClaimsPrincipal user)
        {
            var clubIdClaim = user.FindFirst("ManagedClubId")?.Value;
            return int.TryParse(clubIdClaim, out int clubId) ? clubId : null;
        }

        /// <summary>
        /// Проверяет, является ли пользователь SuperAdmin
        /// </summary>
        public static bool IsSuperAdmin(ClaimsPrincipal user)
        {
            return user.IsInRole("SuperAdmin");
        }

        /// <summary>
        /// Проверяет, является ли пользователь Admin или SuperAdmin
        /// </summary>
        public static bool IsAdminOrHigher(ClaimsPrincipal user)
        {
            return user.IsInRole("SuperAdmin") || user.IsInRole("Admin");
        }

        /// <summary>
        /// Проверяет, является ли пользователь Manager, Admin или SuperAdmin
        /// </summary>
        public static bool IsManagerOrHigher(ClaimsPrincipal user)
        {
            return user.IsInRole("SuperAdmin") || user.IsInRole("Admin") || user.IsInRole("Manager");
        }

        /// <summary>
        /// Проверяет, может ли пользователь управлять указанным клубом
        /// </summary>
        public static bool CanManageClub(ClaimsPrincipal user, int clubId)
        {
            // SuperAdmin и Admin могут управлять любым клубом
            if (IsAdminOrHigher(user))
                return true;

            // Manager может управлять только своим клубом
            if (user.IsInRole("Manager"))
            {
                var managedClubId = GetManagedClubId(user);
                return managedClubId.HasValue && managedClubId.Value == clubId;
            }

            return false;
        }

        /// <summary>
        /// Проверяет, может ли пользователь просматривать данные другого пользователя
        /// </summary>
        public static bool CanViewUser(ClaimsPrincipal user, int targetUserId)
        {
            var currentUserId = GetCurrentUserId(user);
            
            // Может просматривать свой профиль
            if (currentUserId == targetUserId)
                return true;

            // SuperAdmin и Admin могут просматривать любого
            return IsAdminOrHigher(user);
        }

        /// <summary>
        /// Проверяет, может ли пользователь редактировать данные другого пользователя
        /// </summary>
        public static bool CanEditUser(ClaimsPrincipal user, int targetUserId)
        {
            var currentUserId = GetCurrentUserId(user);
            
            // Может редактировать свой профиль
            if (currentUserId == targetUserId)
                return true;

            // SuperAdmin и Admin могут редактировать любого
            return IsAdminOrHigher(user);
        }

        /// <summary>
        /// Проверяет, может ли пользователь просматривать бронирование
        /// </summary>
        public static bool CanViewBooking(ClaimsPrincipal user, int bookingUserId, int? clubId = null)
        {
            var currentUserId = GetCurrentUserId(user);
            
            // Может просматривать своё бронирование
            if (currentUserId == bookingUserId)
                return true;

            // SuperAdmin и Admin могут просматривать любые бронирования
            if (IsAdminOrHigher(user))
                return true;

            // Manager может просматривать бронирования своего клуба
            if (user.IsInRole("Manager") && clubId.HasValue)
            {
                return CanManageClub(user, clubId.Value);
            }

            return false;
        }

        /// <summary>
        /// Возвращает ActionResult для случая недостаточных прав
        /// </summary>
        public static ForbidResult CreateForbidResult(string message = "Недостаточно прав для выполнения этой операции")
        {
            return new ForbidResult(message);
        }
    }
}
