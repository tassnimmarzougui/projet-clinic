// Models/Doctor.cs
namespace MediClinic.API.Models
{
    public class Doctor
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = "default-doctor.png";

        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}
