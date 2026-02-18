using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;

namespace LMS.Models
{
    public class MenuMaster
    {
        [Display(Name = "Menu ID")]
        [Required(ErrorMessage = "Please enter Menu ID.")]
        [Range(1, int.MaxValue, ErrorMessage = "Please enter valid Menu ID.")]
        public int MenuId { get; set; }

        [Display(Name = "Menu Name")]
        [Required(ErrorMessage = "Please enter Menu Name.")]
        [StringLength(50, ErrorMessage = "Menu Name cannot exceed 50 characters.")]
        public string MenuName { get; set; }

        [Display(Name = "Display Name")]
        [Required(ErrorMessage = "Please enter Display Name.")]
        [StringLength(50, ErrorMessage = "Display Name cannot exceed 50 characters.")]
        public string DisplayName { get; set; }

        [Display(Name = "Menu Level")]
        [Range(1, int.MaxValue, ErrorMessage = "Please enter valid Menu Level.")]
        public int MenuLevel { get; set; }

        [Display(Name = "Parent Menu")]
        public int? ParentMenuId { get; set; }

        [Display(Name = "Menu URL")]
        [Required(ErrorMessage = "Please enter Menu URL.")]
        [StringLength(200, ErrorMessage = "Menu URL cannot exceed 200 characters.")]
        public string? MenuUrl { get; set; }

        [Display(Name = "Display Order")]
        [Range(1, int.MaxValue, ErrorMessage = "Please enter valid Display Order.")]
        public int DisplayOrder { get; set; }

        [Display(Name = "Active")]
        public bool IsActive { get; set; } = true;

        [ValidateNever]
        public string? ParentMenuName { get; set; }
    }
}
