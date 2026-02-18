using LMS_API.Interfaces;
using LMS_API.Models;
using LMS_API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUserRepository userRepository;
        private readonly IEmailService emailService;
        private readonly IConfiguration configuration;

        public AccountController( IUserRepository userRepository,  IEmailService emailService, IConfiguration configuration)
        {
            this.userRepository = userRepository;
            this.emailService = emailService;
            this.configuration = configuration;
        }

        [HttpPost("ForgotPassword")]
        public IActionResult ForgotPassword(ForgotPasswordRequest model)
        {
            string token = userRepository.GenerateResetToken(model.Email);

            string resetLink = $"{configuration["AppUrl"]}/Login/ResetPassword" + $"?email={Uri.EscapeDataString(model.Email)}&token={token}";
            string body = $@"
                            <p>Hello,</p>
                            <p>Click the link below to reset your password:</p>
                            <p><a href='{resetLink}'>Reset Password</a></p>
                            <p>This link expires in 30 minutes.</p>";

            emailService.SendEmail(model.Email, "Reset your password", body);

            return Ok(new { message = "Please check your email, reset link has been sent." });
        }

        [HttpPost("ResetPassword")]
        public IActionResult ResetPassword(ResetPasswordRequest model)
        {
            bool success = userRepository.ResetPassword(model.Email, model.Token, model.NewPassword );

            if (!success)
                return BadRequest("Invalid or expired token");

            return Ok("Password updated");
        }
    }
}
