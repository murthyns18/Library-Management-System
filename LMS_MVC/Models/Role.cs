using System.ComponentModel.DataAnnotations;

namespace LMS_API.Models
{
    public class Role
    {
        [Key]
        public short RoleID { get; set; }

        [Display(Name = "Role Name")]
        [Required(ErrorMessage = "Please enter Role Name.")]
        [MinLength(3, ErrorMessage = "Role Name must be at least 3 characters long.")]
        [MaxLength(20, ErrorMessage = "Role Name must not exceed 20 characters.")]
        public string RoleName { get; set; }

        [Display(Name = "Status")]
        public bool IsActive { get; set; } = true;
    }
}
