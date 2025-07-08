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
    public class ComputerSpecsController : ControllerBase
    {
        private readonly OynaDbContext _context;

        public ComputerSpecsController(OynaDbContext context)
        {
            _context = context;
        }

        // GET: api/ComputerSpecs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ComputerSpec>>> GetComputerSpecs()
        {
            return await _context.ComputerSpecs.ToListAsync();
        }

        // GET: api/ComputerSpecs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ComputerSpec>> GetComputerSpec(int id)
        {
            var computerSpec = await _context.ComputerSpecs.FindAsync(id);

            if (computerSpec == null)
            {
                return NotFound();
            }

            return computerSpec;
        }

        // PUT: api/ComputerSpecs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutComputerSpec(int id, ComputerSpec computerSpec)
        {
            if (id != computerSpec.Id)
            {
                return BadRequest();
            }

            _context.Entry(computerSpec).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ComputerSpecExists(id))
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

        // POST: api/ComputerSpecs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ComputerSpec>> PostComputerSpec(ComputerSpec computerSpec)
        {
            _context.ComputerSpecs.Add(computerSpec);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetComputerSpec", new { id = computerSpec.Id }, computerSpec);
        }

        // DELETE: api/ComputerSpecs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComputerSpec(int id)
        {
            var computerSpec = await _context.ComputerSpecs.FindAsync(id);
            if (computerSpec == null)
            {
                return NotFound();
            }

            _context.ComputerSpecs.Remove(computerSpec);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ComputerSpecExists(int id)
        {
            return _context.ComputerSpecs.Any(e => e.Id == id);
        }
    }
}
