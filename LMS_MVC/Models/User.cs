using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;

namespace LMS.Models
{
    public class User
    {
   

        [Key]
        public int UserID { get; set; }

        [Display(Name = "Name")]
        [Required(ErrorMessage = "Please enter Name.")]
        [MinLength(3, ErrorMessage = "Name must be at least 3 characters.")]
        [MaxLength(50, ErrorMessage = "Name must not exceed 50 characters.")]
        public string UserName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Please enter Email.")]
        [EmailAddress(ErrorMessage = "Please enter a valid Email.")]
        public string Email { get; set; } = string.Empty;

        [Display(Name = "Mobile Number")]
        [Required(ErrorMessage = "Please enter Mobile Number.")]
        [RegularExpression(@"^[6-9]\d{9}$",
            ErrorMessage = "Please enter a valid 10-digit Mobile Number.")]
        public string MobileNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Please enter Address.")]
        public string Address { get; set; } = string.Empty;


        [Display(Name = "Role")]
        [Required(ErrorMessage = "Please select Role.")]
        public short? RoleID { get; set; }

        [ValidateNever]
        public string? RoleName { get; set; }

        [ValidateNever]
        public IEnumerable<SelectListItem> RoleList { get; set; }
            = new List<SelectListItem>();


        [Required(ErrorMessage = "Please select at least one Language.")]
        public string? LanguagesKnownCsv { get; set; }

        [Required(ErrorMessage = "Please select at least one Category.")]
        public string? InterestedCategoriesCsv { get; set; }

        [ValidateNever]
        public List<string> LanguagesKnown =>
            string.IsNullOrWhiteSpace(LanguagesKnownCsv)? new() : LanguagesKnownCsv.Split(',').Select(x => x.Trim()).ToList();

        [ValidateNever]
        public List<string> InterestedCategories =>
            string.IsNullOrWhiteSpace(InterestedCategoriesCsv) ? new() : InterestedCategoriesCsv.Split(',').Select(x => x.Trim()).ToList();


        [Required(ErrorMessage = "Please select Gender.")]
        public string? Gender { get; set; }

        [Required(ErrorMessage = "You must accept Terms & Conditions.")]
        public bool TermsAccepted { get; set; }


        [Display(Name = "Country")]
        [Required(ErrorMessage = "Please select Country.")]
        public int? CountryId { get; set; }

        [ValidateNever]
        public string? CountryName { get; set; }

        [Display(Name = "State")]
        [Required(ErrorMessage = "Please select State.")]
        public int? StateId { get; set; }

        [ValidateNever]
        public string? StateName { get; set; }

        [Display(Name = "City")]
        [Required(ErrorMessage = "Please select City.")]
        public int? CityId { get; set; }

        [ValidateNever]
        public string? CityName { get; set; }

  
        [ValidateNever]
        public IFormFile? ProfilePic { get; set; }

        [ValidateNever]
        public IFormFile? AadharDoc { get; set; }

        public string? ProfilePicPath { get; set; }

        public string? AadharPath { get; set; }

     
        [Display(Name = "Date of Birth")]
        [Required(ErrorMessage = "Please select Date of Birth.")]
        [DataType(DataType.Date)]
        public DateTime? DOB { get; set; }


        [Required(ErrorMessage = "Please select Status.")]
        public bool Status { get; set; } = true;

        

        [Required(ErrorMessage = "Please enter Password.")]
        [StringLength(20, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 20 characters.")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        [Display(Name = "Confirm Password")]
        [Required(ErrorMessage = "Please enter Confirm Password.")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Password and Confirm Password do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
