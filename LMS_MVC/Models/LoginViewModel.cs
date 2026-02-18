using System.ComponentModel.DataAnnotations;

namespace LMS.Models
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Please enter email.")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Please enter password.")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
