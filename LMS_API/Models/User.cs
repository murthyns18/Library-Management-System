using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;

namespace LMS_API.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string UserName { get; set; } = "";
        public string Email { get; set; } = "";
        public string MobileNumber { get; set; } = "";
        public string Address { get; set; } = "";
        public short? RoleID { get; set; }
        public string? RoleName { get; set; } = "";
        public bool Status { get; set; }
        public string? Password { get; set; }
        public string? Gender { get; set; }
        public bool TermsAccepted { get; set; }
        public int? CountryId { get; set; }
        public string? CountryName { get; set; }
        public int? StateId { get; set; }
        public string? StateName { get; set; }
        public int? CityId { get; set; }
        public string? CityName { get; set; }
        public IFormFile? ProfilePic { get; set; }
        public IFormFile? AadharDoc { get; set; }
        public string? ProfilePicPath { get; set; }
        public string? AadharPath { get; set; }
        public DateTime? DOB { get; set; }
        public string? LanguagesKnownCsv { get; set; }
        public string? InterestedCategoriesCsv { get; set; }

        [ValidateNever]
        public List<string> LanguagesKnown =>
            string.IsNullOrWhiteSpace(LanguagesKnownCsv)
                ? new()
                : LanguagesKnownCsv.Split(',').Select(x => x.Trim()).ToList();

        [ValidateNever]
        public List<string> InterestedCategories =>
            string.IsNullOrWhiteSpace(InterestedCategoriesCsv)
                ? new()
                : InterestedCategoriesCsv.Split(',').Select(x => x.Trim()).ToList();
    }
}
