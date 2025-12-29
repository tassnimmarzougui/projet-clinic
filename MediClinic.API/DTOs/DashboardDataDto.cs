using System;
using System.Collections.Generic;

namespace MediClinic.API.DTOs
{
    public class AppointmentDashboardDto
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public decimal Cost { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        
        // Patient
        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string PatientEmail { get; set; } = string.Empty;
        public string PatientPhone { get; set; } = string.Empty;
        public DateTime PatientDateOfBirth { get; set; }
        public string PatientGender { get; set; } = string.Empty;
        
        // Doctor
        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public string DoctorSpecialization { get; set; } = string.Empty;
        public string DoctorEmail { get; set; } = string.Empty;
        public string DoctorPhone { get; set; } = string.Empty;
    }

    public class DashboardDataDto
    {
        // Statistiques générales
        public int TotalPatients { get; set; }
        public int TotalDoctors { get; set; }
        public int TotalAppointmentsToday { get; set; }
        public int TotalAppointmentsThisWeek { get; set; }
        public int TotalAppointmentsThisMonth { get; set; }
        public decimal TotalRevenueToday { get; set; }
        public decimal TotalRevenueThisWeek { get; set; }
        public decimal TotalRevenueThisMonth { get; set; }
        
        // Statistiques par statut
        public int PendingAppointments { get; set; }
        public int ConfirmedAppointments { get; set; }
        public int CompletedAppointments { get; set; }
        public int CancelledAppointments { get; set; }
        
        // Liste des rendez-vous
        public List<AppointmentDashboardDto> TodayAppointments { get; set; } = new();
        public List<AppointmentDashboardDto> UpcomingAppointments { get; set; } = new();
        public List<AppointmentDashboardDto> RecentAppointments { get; set; } = new();
        
        // Statistiques financières
        public decimal TotalPendingPayments { get; set; }
        public decimal TotalPaidPayments { get; set; }
        public decimal TotalOverduePayments { get; set; }
        
        // Derniers patients inscrits
        public List<PatientDto> RecentPatients { get; set; } = new();
        
        // Derniers docteurs ajoutés
        public List<DoctorDto> RecentDoctors { get; set; } = new();
    }

    // DTO pour les patients dans le dashboard
    public class PatientDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    // DTO pour les docteurs dans le dashboard
    public class DoctorDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? LicenseNumber { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}