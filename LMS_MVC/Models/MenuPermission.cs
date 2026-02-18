using System.ComponentModel.DataAnnotations;

namespace LMS.Models
{
    public class MenuPermission
    {
        [Display(Name = "Menu Permission ID")]
        [Range(1, int.MaxValue, ErrorMessage = "Please enter valid Menu Permission ID.")]
        public int MenuRolePermissionID { get; set; }

        [Display(Name = "Menu")]
        [Range(1, int.MaxValue, ErrorMessage = "Please select Menu.")]
        public int MenuId { get; set; }

        [Display(Name = "Role")]
        [Range(1, int.MaxValue, ErrorMessage = "Please select Role.")]
        public int RoleID { get; set; }

        public bool IsRead { get; set; }
        public bool IsWrite { get; set; }
    }
}
