namespace MediClinic.API.Models
{
    public class Invoice
    {
        public int Id { get; set; }
        public int AppointmentId { get; set; } // Marbout bel rdv
        public DateTime BillingDate { get; set; }
        public decimal TotalAmount { get; set; }
        public bool IsPaid { get; set; } // Khalset wala la?

        public virtual Appointment? Appointment { get; set; }
    }
}