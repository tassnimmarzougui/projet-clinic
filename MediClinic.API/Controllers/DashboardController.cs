using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MediClinic.API.Data;
using MediClinic.API.DTOs;
using MediClinic.API.Models;

namespace MediClinic.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("data")]
        public async Task<ActionResult<DashboardDataDto>> GetDashboardData()
        {
            var today = DateTime.Today;
            var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(7);
            
            // Récupérer tous les rendez-vous d'aujourd'hui avec les données liées
            var appointmentsToday = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .Where(a => a.AppointmentDate.Date == today)
                .OrderBy(a => a.AppointmentDate)
                .ToListAsync();

            // Récupérer les rendez-vous à venir (aujourd'hui et futur)
            var upcomingAppointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .Where(a => a.AppointmentDate >= today && a.Status != AppointmentStatus.Cancelled && a.Status != AppointmentStatus.Completed)
                .OrderBy(a => a.AppointmentDate)
                .Take(10) // Limiter à 10 rendez-vous à venir
                .ToListAsync();

            // Récupérer les rendez-vous de cette semaine
            var appointmentsThisWeek = await _context.Appointments
                .Where(a => a.AppointmentDate >= startOfWeek && a.AppointmentDate < endOfWeek)
                .ToListAsync();

            // Créer le DTO de réponse
            var dashboardData = new DashboardDataDto
            {
                TotalPatients = await _context.Patients.CountAsync(),
                TotalDoctors = await _context.Doctors.CountAsync(),
                TotalAppointmentsToday = appointmentsToday.Count,
                TotalAppointmentsThisWeek = appointmentsThisWeek.Count,
                TotalRevenueToday = appointmentsToday.Sum(a => a.Cost),
                TotalRevenueThisWeek = appointmentsThisWeek.Sum(a => a.Cost),
                TodayAppointments = appointmentsToday.Select(a => new AppointmentDashboardDto
                {
                    Id = a.Id,
                    AppointmentDate = a.AppointmentDate,
                    Cost = a.Cost,
                    Status = a.Status.ToString(),
                    PatientId = a.PatientId,
                    PatientName = a.Patient?.Name ?? "Patient inconnu",
                    PatientEmail = a.Patient?.Email ?? "",
                    PatientPhone = a.Patient?.Phone ?? "",
                    DoctorId = a.DoctorId,
                    DoctorName = a.Doctor?.Name ?? "Docteur inconnu",
                    DoctorSpecialization = a.Doctor?.Specialization ?? ""
                }).ToList(),
                UpcomingAppointments = upcomingAppointments.Select(a => new AppointmentDashboardDto
                {
                    Id = a.Id,
                    AppointmentDate = a.AppointmentDate,
                    Cost = a.Cost,
                    Status = a.Status.ToString(),
                    PatientId = a.PatientId,
                    PatientName = a.Patient?.Name ?? "Patient inconnu",
                    PatientEmail = a.Patient?.Email ?? "",
                    PatientPhone = a.Patient?.Phone ?? "",
                    DoctorId = a.DoctorId,
                    DoctorName = a.Doctor?.Name ?? "Docteur inconnu",
                    DoctorSpecialization = a.Doctor?.Specialization ?? ""
                }).ToList()
            };

            return Ok(dashboardData);
        }

        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetDashboardStats()
        {
            var today = DateTime.Today;
            var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(7);

            var stats = new
            {
                TotalPatients = await _context.Patients.CountAsync(),
                TotalDoctors = await _context.Doctors.CountAsync(),
                TotalAppointments = await _context.Appointments.CountAsync(),
                TodayAppointments = await _context.Appointments
                    .Where(a => a.AppointmentDate.Date == today)
                    .CountAsync(),
                PendingAppointments = await _context.Appointments
                    .Where(a => a.Status == AppointmentStatus.Pending)
                    .CountAsync(),
                ConfirmedAppointments = await _context.Appointments
                    .Where(a => a.Status == AppointmentStatus.Confirmed)
                    .CountAsync(),
                CompletedAppointments = await _context.Appointments
                    .Where(a => a.Status == AppointmentStatus.Completed)
                    .CountAsync(),
                CancelledAppointments = await _context.Appointments
                    .Where(a => a.Status == AppointmentStatus.Cancelled)
                    .CountAsync(),
                TotalRevenue = await _context.Appointments
                    .Where(a => a.Status == AppointmentStatus.Completed)
                    .SumAsync(a => a.Cost),
                WeeklyRevenue = await _context.Appointments
                    .Where(a => a.AppointmentDate >= startOfWeek && a.AppointmentDate < endOfWeek && a.Status == AppointmentStatus.Completed)
                    .SumAsync(a => a.Cost)
            };

            return Ok(stats);
        }
    }
}