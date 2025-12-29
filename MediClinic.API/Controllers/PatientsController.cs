using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MediClinic.API.Data;
using MediClinic.API.Models;

namespace MediClinic.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PatientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/Patients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetPatients()
        {
            try 
            {
                var patients = await _context.Patients
                    .Include(p => p.Appointments)
                    .Select(p => new {
                        p.Id,
                        p.Name,
                        p.Email,
                        p.Phone,
                        Gender = p.Gender.ToString(),
                        // Calcul de l'âge
                        Age = DateTime.Now.Year - p.DateOfBirth.Year,
                        TotalAppointments = p.Appointments != null ? p.Appointments.Count : 0
                    })
                    .ToListAsync();

                return Ok(patients);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la récupération des patients", detail = ex.Message });
            }
        }

        // 2. GET: api/Patients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetPatient(int id)
        {
            var patient = await _context.Patients
                .Include(p => p.Appointments)
                    .ThenInclude(a => a.Doctor)
                .Where(p => p.Id == id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Email,
                    p.Phone,
                    p.DateOfBirth,
                    Gender = p.Gender.ToString(),
                    History = p.Appointments.OrderByDescending(a => a.AppointmentDate).Select(a => new {
                        a.Id,
                        a.AppointmentDate,
                        DoctorName = a.Doctor != null ? a.Doctor.Name : "N/A",
                        Status = a.Status.ToString(),
                        a.Cost
                    })
                })
                .FirstOrDefaultAsync();

            if (patient == null) return NotFound(new { message = "Patient non trouvé" });

            return Ok(patient);
        }

        // 3. POST: api/Patients (Ajouter un nouveau patient)
        [HttpPost]
        public async Task<ActionResult<Patient>> PostPatient([FromBody] Patient patient)
        {
            // Vérifie si le modèle envoyé par React est correct
            if (!ModelState.IsValid) 
            {
                return BadRequest(new { 
                    message = "Données invalides", 
                    errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) 
                });
            }

            try 
            {
                // Validation métier : Date de naissance
                if (patient.DateOfBirth > DateTime.Now)
                    return BadRequest(new { message = "La date de naissance ne peut pas être dans le futur" });

                _context.Patients.Add(patient);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patient);
            }
            catch (Exception ex)
            {
                // Log de l'erreur interne pour le debug
                var innerMessage = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { message = "Erreur lors de la création du patient", detail = innerMessage });
            }
        }

        // 4. PUT: api/Patients/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatient(int id, [FromBody] Patient patient)
        {
            if (id != patient.Id) return BadRequest(new { message = "ID mismatch" });

            _context.Entry(patient).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // 5. DELETE: api/Patients/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound();

            try 
            {
                _context.Patients.Remove(patient);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Patient supprimé avec succès" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Impossible de supprimer le patient car il possède des rendez-vous", detail = ex.Message });
            }
        }

        private bool PatientExists(int id)
        {
            return _context.Patients.Any(e => e.Id == id);
        }
    }
}