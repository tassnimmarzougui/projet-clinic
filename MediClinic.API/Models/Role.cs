using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MediClinic.API.Models
{
     public class Role
     {
         [Key]
         public int Id { get; set; }
         
         [Required]
         [MaxLength(50)]
         public string Name { get; set; }
         
         [MaxLength(200)]
         public string Description { get; set; }
         
         // Navigation
         public ICollection<User> Users { get; set; }
     }
}