namespace MediClinic.API.Models;

public class Prescription {
    public int Id { get; set; }
    public string Medicines { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;
    public DateTime DateIssued { get; set; }
    public int AppointmentId { get; set; }
    public Appointment Appointment { get; set; } = null!;
}