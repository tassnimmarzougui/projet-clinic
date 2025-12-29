using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MediClinic.API.Data;
using MediClinic.API.Models;

namespace MediClinic.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PaymentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/Payments (قائمة الخلاصات الكل مع تفاصيل المريض)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetPayments()
        {
            var payments = await _context.Payments
                .Include(p => p.Appointment)
                .ThenInclude(a => a.Patient)
                .Select(p => new {
                    p.Id,
                    p.Amount,
                    p.PaymentDate,
                    Method = p.Method.ToString(), // Cash, Card, etc.
                    Status = p.Status.ToString(), // Paid, Pending
                    PatientName = p.Appointment.Patient.Name,
                    AppointmentId = p.AppointmentId
                })
                .OrderByDescending(p => p.PaymentDate)
                .ToListAsync();

            return Ok(payments);
        }

        // 2. GET: api/Payments/stats (إحصائيات سريعة للـ Dashboard)
        [HttpGet("stats")]
        public async Task<IActionResult> GetPaymentStats()
        {
            var totalRevenue = await _context.Payments
                .Where(p => p.Status == PaymentStatus.Paid)
                .SumAsync(p => p.Amount);

            var paymentsByMethod = await _context.Payments
                .GroupBy(p => p.Method)
                .Select(g => new { Method = g.Key.ToString(), Count = g.Count() })
                .ToListAsync();

            return Ok(new {
                TotalRevenue = totalRevenue,
                MethodsBreakdown = paymentsByMethod
            });
        }

        // 3. POST: api/Payments (تسجيل عملية دفع جديدة)
        [HttpPost]
        public async Task<ActionResult<Payment>> PostPayment(Payment payment)
        {
            // نثبتوا أن الموعد موجود
            var appointment = await _context.Appointments.FindAsync(payment.AppointmentId);
            if (appointment == null) return BadRequest("Appointment not found");

            payment.PaymentDate = DateTime.Now;
            _context.Payments.Add(payment);

            // بمجرد الخلاص، نحدث حالة الموعد أوتوماتيكيا (اختياري)
            appointment.Status = AppointmentStatus.Completed;

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPayments", new { id = payment.Id }, payment);
        }

        // 4. DELETE: api/Payments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return NotFound();

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}