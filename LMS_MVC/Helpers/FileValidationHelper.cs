using Microsoft.AspNetCore.Http;
using System.IO;
using System.Linq;

namespace LMS.Helpers
{
    public static class FileValidationHelper
    {
        private const long MaxAadharSize = 500 * 1024;

        private static readonly string[] ProfileAllowedExtensions =
        {
            ".jpg", ".jpeg", ".png"
        };

        private static readonly string[] AadharAllowedExtensions =
        {
            ".pdf"
        };

        public static string? ValidateProfile(IFormFile? file)
        {
            if (file == null)
                return "Please upload Profile Picture.";

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!ProfileAllowedExtensions.Contains(extension))
                return "Profile picture must be JPG or PNG format.";

            return null;
        }

        public static string? ValidateAadhar(IFormFile? file)
        {
            if (file == null)
                return "Please upload Aadhar document.";

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!AadharAllowedExtensions.Contains(extension))
                return "Aadhar document must be PDF only.";

            if (file.Length > MaxAadharSize)
                return "Aadhar document size must be less than 500 KB.";

            return null;
        }
    }
}
