using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using BookHub.Data;
using BookHub.Models;
using BookHub.Models.Dtos;
using BookHub.Helpers;

namespace BookHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TariffsController : ControllerBase
    {
        private readonly BookHubDbContext _context;

        public TariffsController(BookHubDbContext context)
        {
            _context = context;
        }

        // GET: api/Tariffs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TariffDto>>> GetTariffs()
        {
            var tariffs = await _context.Tariffs.ToListAsync();

            var dtos = tariffs.Select(t => new TariffDto
            {
                Id = t.Id,
                ClubId = t.ClubId,
                Name = t.Name,
                Description = t.Description,
                PricePerHour = t.PricePerHour,
                IsNightTariff = t.IsNightTariff
            }).ToList();

            return dtos;
        }

        // GET: api/Tariffs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TariffDto>> GetTariff(int id)
        {
            var tariff = await _context.Tariffs.FindAsync(id);

            if (tariff == null)
                return NotFound();

            var dto = new TariffDto
            {
                Id = tariff.Id,
                ClubId = tariff.ClubId,
                Name = tariff.Name,
                Description = tariff.Description,
                PricePerHour = tariff.PricePerHour,
                IsNightTariff = tariff.IsNightTariff
            };

            return dto;
        }

        // PUT: api/Tariffs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTariff(int id, TariffDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID в URL не совпадает с ID объекта.");
            var tariff = await _context.Tariffs.FindAsync(id);
            if (tariff == null)
                return NotFound();
            // Проверка разрешения на редактирование тарифа
            bool canEdit = AuthorizationHelper.HasPermission(User, "Тарифы", "Изменение", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            // Менеджер может редактировать только тарифы своего клуба
            if (User.IsInRole("Manager") && tariff.ClubId != AuthorizationHelper.GetManagedClubId(User))
                canEdit = false;
            if (!canEdit)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для редактирования тарифа");
            tariff.ClubId = dto.ClubId;
            tariff.Name = dto.Name;
            tariff.Description = dto.Description;
            tariff.PricePerHour = dto.PricePerHour;
            tariff.IsNightTariff = dto.IsNightTariff;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TariffExists(id))
                    return NotFound();
                else
                    throw;
            }
            return NoContent();
        }

        // POST: api/Tariffs
        [HttpPost]
        public async Task<ActionResult<TariffDto>> PostTariff(TariffDto dto)
        {
            // Проверка разрешения на создание тарифа
            bool canCreate = AuthorizationHelper.HasPermission(User, "Тарифы", "Создание", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            // Менеджер может создавать тарифы только для своего клуба
            if (User.IsInRole("Manager") && dto.ClubId != AuthorizationHelper.GetManagedClubId(User))
                canCreate = false;
            if (!canCreate)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для создания тарифа");
            var tariff = new Tariff
            {
                ClubId = dto.ClubId,
                Name = dto.Name,
                Description = dto.Description,
                PricePerHour = dto.PricePerHour,
                IsNightTariff = dto.IsNightTariff
            };
            _context.Tariffs.Add(tariff);
            await _context.SaveChangesAsync();
            dto.Id = tariff.Id;
            return CreatedAtAction(nameof(GetTariff), new { id = tariff.Id }, dto);
        }

        // DELETE: api/Tariffs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTariff(int id)
        {
            var tariff = await _context.Tariffs.FindAsync(id);
            if (tariff == null)
                return NotFound();
            // Проверка разрешения на удаление тарифа
            bool canDelete = AuthorizationHelper.HasPermission(User, "Тарифы", "Удаление", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            // Менеджер может удалять только тарифы своего клуба
            if (User.IsInRole("Manager") && tariff.ClubId != AuthorizationHelper.GetManagedClubId(User))
                canDelete = false;
            if (!canDelete)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для удаления тарифа");
            _context.Tariffs.Remove(tariff);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool TariffExists(int id)
        {
            return _context.Tariffs.Any(e => e.Id == id);
        }
    }
}
