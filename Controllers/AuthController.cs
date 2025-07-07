using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OynaApi.Data;
using OynaApi.Models;

namespace OynaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly OynaDbContext _context;

        public AuthController(OynaDbContext context)
        {
            _context = context;
        }

        // GET: api/Auth
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuthModel>>> GetAuthModels()
        {
            return await _context.AuthModels.ToListAsync();
        }

        // GET: api/Auth/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AuthModel>> GetAuthModel(int id)
        {
            var authModel = await _context.AuthModels.FindAsync(id);

            if (authModel == null)
            {
                return NotFound();
            }

            return authModel;
        }

        // PUT: api/Auth/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAuthModel(int id, AuthModel authModel)
        {
            if (id != authModel.Id)
            {
                return BadRequest();
            }

            _context.Entry(authModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AuthModelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Auth
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AuthModel>> PostAuthModel(AuthModel authModel)
        {
            _context.AuthModels.Add(authModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAuthModel", new { id = authModel.Id }, authModel);
        }

        // DELETE: api/Auth/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthModel(int id)
        {
            var authModel = await _context.AuthModels.FindAsync(id);
            if (authModel == null)
            {
                return NotFound();
            }

            _context.AuthModels.Remove(authModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AuthModelExists(int id)
        {
            return _context.AuthModels.Any(e => e.Id == id);
        }
    }
}
