using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MediClinic.API.Models
{
     public class User
     {
         [Key]
         public int Id { get; set; }
         
         [Required]
         [EmailAddress]
         public string Email { get; set; }
         
         [Required]
         public string PasswordHash { get; set; }
         
         [Required]
         public string FirstName { get; set; }
         
         [Required]
         public string LastName { get; set; }
         
         public string Phone { get; set; }
         
         public string ProfileImage { get; set; }
         
         public bool IsActive { get; set; } = true;
         
         public DateTime CreatedAt { get; set; } = DateTime.Now;
         public DateTime? LastLogin { get; set; }
         
         // Foreign Key
         public int RoleId { get; set; }
         
         [ForeignKey("RoleId")]
         public Role Role { get; set; }
         
         // Navigation properties
         public Patient Patient { get; set; }
         public Doctor Doctor { get; set; }
     }
}