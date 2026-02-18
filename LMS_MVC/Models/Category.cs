using System.ComponentModel.DataAnnotations;

namespace LMS.Models
{
    public class Category
    {
        [Key]
        public int CategoryID { get; set; }

        [Display(Name = "Category Name")]
        [Required(ErrorMessage = "Please enter Category Name.")]
        [StringLength(100, ErrorMessage = "Category name must not exceed 100 characters.")]
        public string CategoryName { get; set; } = string.Empty;

        [Display(Name = "Status")]
        public bool IsActive { get; set; } = true;
    }
}
