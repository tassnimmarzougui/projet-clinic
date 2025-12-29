using Microsoft.EntityFrameworkCore;
using MediClinic.API.Models;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace MediClinic.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Invoice> Invoices { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Seed Doctors 
            // VÉRIFIE BIEN : Si ton modèle utilise "Specialty" ou "Specialization"
            modelBuilder.Entity<Doctor>().HasData(
                new Doctor { Id = 1, Name = "Dr. Sami Ben Ali", Specialization = "Cardiology", ImageUrl = "doc1.png" },
                new Doctor { Id = 2, Name = "Dr. Leila Fessi", Specialization = "Pediatrics", ImageUrl = "doc2.png" },
                new Doctor { Id = 3, Name = "Dr. Karim Mourad", Specialization = "Dermatology", ImageUrl = "doc3.png" }
            );

            // 2. Seed Patients
            modelBuilder.Entity<Patient>().HasData(
                new Patient { Id = 1, Name = "Ahmed Ammar", Gender = Gender.Male, Email = "ahmed@mail.com", Phone = "22111333", DateOfBirth = new DateTime(1990, 5, 10) },
                new Patient { Id = 2, Name = "Sara Ben Youssef", Gender = Gender.Female, Email = "sara@mail.com", Phone = "55444666", DateOfBirth = new DateTime(1995, 8, 20) }
            );

            // 3. Seed Appointments
            // Note: On met des IDs élevés ou on laisse l'auto-incrément gérer pour éviter les conflits
            modelBuilder.Entity<Appointment>().HasData(
                new Appointment { Id = 1, PatientId = 1, DoctorId = 1, AppointmentDate = new DateTime(2025, 10, 05, 10, 0, 0), Cost = 80, Status = AppointmentStatus.Completed, CreatedAt = DateTime.UtcNow },
                new Appointment { Id = 2, PatientId = 2, DoctorId = 2, AppointmentDate = new DateTime(2025, 11, 12, 14, 30, 0), Cost = 60, Status = AppointmentStatus.Completed, CreatedAt = DateTime.UtcNow },
                new Appointment { Id = 3, PatientId = 1, DoctorId = 3, AppointmentDate = new DateTime(2025, 11, 20, 09, 0, 0), Cost = 100, Status = AppointmentStatus.Completed, CreatedAt = DateTime.UtcNow }
            );

            // --- Configuration des Relations (Fluent API) ---

            // Relation Appointment -> Patient
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Cascade); // Important pour la suppression propre

            // Relation Appointment -> Doctor
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany(d => d.Appointments)
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relation Invoice -> Appointment
            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.Appointment)
                .WithMany()
                .HasForeignKey(i => i.AppointmentId);

            // Configuration pour le type Decimal (Évite les warnings SQL Server si tu changes de DB)
            modelBuilder.Entity<Appointment>()
                .Property(a => a.Cost)
                .HasColumnType("decimal(18,2)");
        }
    }
}