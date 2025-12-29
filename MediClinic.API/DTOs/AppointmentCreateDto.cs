using System.ComponentModel.DataAnnotations; // <--- CETTE LIGNE MANQUE
namespace MediClinic.API.DTOs
{
    public class AppointmentCreateDto
{
    [Required(ErrorMessage = "PatientId is required")]
    public int PatientId { get; set; }
    
    [Required(ErrorMessage = "DoctorId is required")]
    public int DoctorId { get; set; }
    
    [Required(ErrorMessage = "AppointmentDate is required")]
    public DateTime AppointmentDate { get; set; }
    
    [Required(ErrorMessage = "Cost is required")]
    [Range(0, 10000, ErrorMessage = "Cost must be between 0 and 10000")]
    public decimal Cost { get; set; }
    
    [MaxLength(500, ErrorMessage = "Notes cannot exceed 500 characters")]
    public string? Notes { get; set; }
}
}