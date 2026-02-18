using System.ComponentModel.DataAnnotations;

namespace LMS.Models
{
    public class Publisher
    {
        [Key]
        public int PublisherID { get; set; }

        [Display(Name = "Publisher Name")]
        [Required(ErrorMessage = "Please enter Publisher Name.")]
        [MinLength(3, ErrorMessage = "Publisher Name must be at least 3 characters long.")]
        [MaxLength(20, ErrorMessage = "Publisher Name must not exceed 20 characters.")]
        public string PublisherName { get; set; } = string.Empty;

        [Display(Name = "Status")]
        public bool IsActive { get; set; } = true;
    }
}
