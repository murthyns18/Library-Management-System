using System.ComponentModel.DataAnnotations;

namespace LMS.Models
{
    public class ForgotPasswordViewModel
    {
        [Required(ErrorMessage = "Please  enter Email")]
        [EmailAddress(ErrorMessage = "Please enter valid email address")]
        public string Email { get; set; }
    }
}
