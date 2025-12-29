using System;

namespace MediClinic.API.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        
        // استعمل الـ Enums
        public PaymentStatus Status { get; set; } 
        public PaymentMethod Method { get; set; }

        // الربط مع الموعد (Foreign Key)
        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; } = null!;
    }
}