using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MediClinic.API.Data;
using MediClinic.API.Models;

namespace MediClinic.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // التثبت من اسم الـ Context (حسب صورتك هو ApplicationDbContext)
        public PrescriptionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/Prescriptions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetPrescriptions()
        {
            var prescriptions = await _context.Prescriptions
                .Include(p => p.Appointment)
                    .ThenInclude(a => a.Patient)
                .Include(p => p.Appointment)
                    .ThenInclude(a => a.Doctor)
                .Select(p => new {
                    p.Id,
                    p.DateIssued, // تأكد من وجودها في Prescription.cs
                    p.Medicines,  // تأكد من وجودها في Prescription.cs
                    p.Instructions, // تأكد من وجودها في Prescription.cs
                    PatientName = p.Appointment.Patient.Name,
                    DoctorName = p.Appointment.Doctor.Name,
                    Specialization = p.Appointment.Doctor.Specialization
                })
                .OrderByDescending(p => p.DateIssued)
                .ToListAsync();

            return Ok(prescriptions);
        }

        // 2. GET: api/Prescriptions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetPrescription(int id)
        {
            var prescription = await _context.Prescriptions
                .Include(p => p.Appointment)
                    .ThenInclude(a => a.Patient)
                .Include(p => p.Appointment)
                    .ThenInclude(a => a.Doctor)
                .Where(p => p.Id == id)
                .Select(p => new {
                    p.Id,
                    p.DateIssued,
                    p.Medicines,
                    p.Instructions,
                    PatientName = p.Appointment.Patient.Name,
                    DoctorName = p.Appointment.Doctor.Name,
                    DoctorSpecialization = p.Appointment.Doctor.Specialization
                })
                .FirstOrDefaultAsync();

            if (prescription == null) return NotFound();

            return Ok(prescription);
        }

        // 3. POST: api/Prescriptions
        [HttpPost]
        public async Task<ActionResult<Prescription>> PostPrescription(Prescription prescription)
        {
            // التثبت من وجود الموعد قبل إضافة الوصفة
            var appointmentExists = await _context.Appointments.AnyAsync(a => a.Id == prescription.AppointmentId);
            if (!appointmentExists)
            {
                return BadRequest("L'ID du rendez-vous n'existe pas.");
            }

            // إسناد تاريخ اليوم أوتوماتيكياً
            prescription.DateIssued = DateTime.Now;

            _context.Prescriptions.Add(prescription);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPrescription), new { id = prescription.Id }, prescription);
        }

        // 4. DELETE: api/Prescriptions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrescription(int id)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);
            if (prescription == null) return NotFound();

            _context.Prescriptions.Remove(prescription);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}