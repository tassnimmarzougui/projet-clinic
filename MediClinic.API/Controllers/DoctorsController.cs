// Controllers/DoctorsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MediClinic.API.Data;
using MediClinic.API.Models;

namespace MediClinic.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DoctorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Doctors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetDoctors()
        {
            var doctors = await _context.Doctors
                .Select(d => new
                {
                    id = d.Id,
                    name = d.Name,
                    specialty = d.Specialization,
                    imageUrl = d.ImageUrl,
                    totalAppointments = d.Appointments.Count,
                    pendingAppointments = d.Appointments.Count(a => a.Status == AppointmentStatus.Pending)
                })
                .ToListAsync();

            return Ok(doctors);
        }

        // GET: api/Doctors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetDoctor(int id)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Appointments)
                .ThenInclude(a => a.Patient)
                .Where(d => d.Id == id)
                .Select(d => new
                {
                    id = d.Id,
                    name = d.Name,
                    specialty = d.Specialization,
                    imageUrl = d.ImageUrl,
                    appointments = d.Appointments.Select(a => new
                    {
                        id = a.Id,
                        appointmentDate = a.AppointmentDate,
                        patientName = a.Patient != null ? a.Patient.Name : "Anonyme",
                        status = a.Status.ToString()
                    })
                })
                .FirstOrDefaultAsync();

            if (doctor == null)
                return NotFound(new { message = "Médecin non trouvé" });

            return Ok(doctor);
        }

        // POST: api/Doctors
        [HttpPost]
        public async Task<ActionResult<Doctor>> PostDoctor([FromBody] Doctor doctor)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDoctor), new { id = doctor.Id }, doctor);
        }

        // PUT: api/Doctors/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDoctor(int id, [FromBody] Doctor doctor)
        {
            if (id != doctor.Id) return BadRequest(new { message = "ID mismatch" });

            _context.Entry(doctor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Doctors.Any(e => e.Id == id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Doctors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Appointments)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (doctor == null) return NotFound();

            if (doctor.Appointments.Any())
            {
                return BadRequest(new
                {
                    message = "Impossible de supprimer un médecin ayant des rendez-vous."
                });
            }

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Médecin supprimé avec succès" });
        }
    }
}