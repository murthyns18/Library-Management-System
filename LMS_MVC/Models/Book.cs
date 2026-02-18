using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;

namespace LMS.Models
{
    public class Book
    {
        [Key]
        public int BookId { get; set; }

        [Display(Name = "Book Title")]
        [Required(ErrorMessage = "Please enter Book Title.")]
        [StringLength(20, MinimumLength = 3, ErrorMessage = "Book Title must be between 3 and 20 characters.")]
        public string Title { get; set; } = string.Empty;


        [Display(Name = "Category")]
        [Required(ErrorMessage = "Please select Category.")]
        public int CategoryID { get; set; }

        [ValidateNever]
        public string CategoryName { get; set; } = string.Empty;

        [ValidateNever]
        public IEnumerable<SelectListItem> CategoryList { get; set; }  = new List<SelectListItem>();

        [Display(Name = "Publisher")]
        [Required(ErrorMessage = "Please select Publisher.")]
        public int PublisherID { get; set; }

        [ValidateNever]
        public string PublisherName { get; set; } = string.Empty;

        [ValidateNever]
        public IEnumerable<SelectListItem> PublisherList { get; set; } = new List<SelectListItem>();

        [Display(Name = "Price")]
        [Required(ErrorMessage = "Please enter Price.")]
        [Range(0.1, 1000, ErrorMessage = "Please enter a valid Price.")]
        public decimal Price { get; set; }

        [Display(Name = "Quantity")]
        [Required(ErrorMessage = "Please enter Quantity.")]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }

 
        [Display(Name = "ISBN")]
        [Required(ErrorMessage = "Please enter ISBN.")]
        [StringLength(13, ErrorMessage = "ISBN must not exceed 13 characters.")]
        public string ISBN { get; set; } = string.Empty;

  
        [Display(Name = "Status")]
        public bool IsActive { get; set; } = true;
    }
}
