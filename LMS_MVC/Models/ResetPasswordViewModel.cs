namespace LMS.Models
{
    using System.ComponentModel.DataAnnotations;

    public class ResetPasswordViewModel
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Token { get; set; }

        [Display(Name = "New Password")]
        [Required(ErrorMessage = "Please enter New Password.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string NewPassword { get; set; }

        [Display(Name = "Confirm Password")]
        [Compare("NewPassword", ErrorMessage = "Passwords do not match")]
        [Required(ErrorMessage = "Please enter Confirm Password.")]
        public string ConfirmPassword { get; set; }
    }

}