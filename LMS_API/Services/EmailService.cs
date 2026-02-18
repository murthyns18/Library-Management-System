using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace LMS_API.Services
{
    public interface IEmailService
    {
        void SendEmail(string to, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void SendEmail(string to, string subject, string body)
        {
            IConfigurationSection smtp = _configuration.GetSection("Smtp");

            SmtpClient client = new SmtpClient(smtp["Host"], int.Parse(smtp["Port"]))
            {
                Credentials = new NetworkCredential(
                    smtp["User"],
                    smtp["Password"]
                ),
                EnableSsl = true
            };

            MailMessage mail = new MailMessage
            {
                From = new MailAddress(smtp["From"]),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mail.To.Add(to);
            client.Send(mail);
        }
    }
}
