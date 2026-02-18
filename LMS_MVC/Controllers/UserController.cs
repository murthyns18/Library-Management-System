using LMS.Helpers;
using LMS.Models;
using LMS.Services;
using LMS_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http.Headers;

namespace LMS.Controllers
{
    [ServiceFilter(typeof(EncryptedActionParameterFilter))]
    public class UserController : Controller
    {
        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        private IEnumerable<SelectListItem> GetRoleSelectList()
        {
            try
            {
                string response = API.Get("Role/GetRoles", HttpContext.Session.GetString("Token"), "roleId=0");

                List<Role> roles = JsonConvert.DeserializeObject<List<Role>>(response) ?? new();
                return roles.Select(r => new SelectListItem
                {
                    Text = r.RoleName,
                    Value = r.RoleID.ToString()
                });
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                return new List<SelectListItem>();
            }
        }

        [HttpGet]
        public IActionResult AddUser()
        {
            try
            {
                return View(new User
                {
                    RoleList = GetRoleSelectList()
                });
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                return View();
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult AddUser(User model, IFormFile ProfilePic, IFormFile AadharDoc)
        {
            try
            {
                model.RoleList = GetRoleSelectList();
                bool isEdit = model.UserID > 0;

                if (isEdit)
                {
                    ModelState.Remove(nameof(model.Password));
                    ModelState.Remove(nameof(model.ConfirmPassword));
                }

                if (!isEdit)
                {
                    string? profileError = FileValidationHelper.ValidateProfile(ProfilePic);
                    if (profileError != null)
                        ModelState.AddModelError("ProfilePic", profileError);

                    string? aadharError = FileValidationHelper.ValidateAadhar(AadharDoc);
                    if (aadharError != null)
                        ModelState.AddModelError("AadharDoc", aadharError);
                }

                if (!model.TermsAccepted)
                    ModelState.AddModelError(nameof(model.TermsAccepted), "Please accept Terms & Conditions.");

                if (!ModelState.IsValid)
                    return View(model);

                string? profilePath = null;
                string? aadharPath = null;

                if (ProfilePic != null)
                {
                    string profileDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/profile");
                    Directory.CreateDirectory(profileDir);

                    string originalName = Path.GetFileName(ProfilePic.FileName);
                    string fileName = $"{Guid.NewGuid()}_{originalName}";
                    string fullPath = Path.Combine(profileDir, fileName);

                    using FileStream fs = new FileStream(fullPath, FileMode.Create);
                    ProfilePic.CopyTo(fs);

                    profilePath = "/uploads/profile/" + fileName;
                }

                if (AadharDoc != null)
                {
                    string aadharDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/aadhar");
                    Directory.CreateDirectory(aadharDir);

                    string originalName = Path.GetFileName(AadharDoc.FileName);
                    string fileName = $"{Guid.NewGuid()}_{originalName}";
                    string fullPath = Path.Combine(aadharDir, fileName);

                    using FileStream fs = new FileStream(fullPath, FileMode.Create);
                    AadharDoc.CopyTo(fs);

                    aadharPath = "/uploads/aadhar/" + fileName;
                }

                MultipartFormDataContent form = new MultipartFormDataContent();

                void Add(string key, string? value)
                {
                    if (!string.IsNullOrWhiteSpace(value))
                        form.Add(new StringContent(value), key);
                }

                Add("UserID", model.UserID.ToString());
                Add("UserName", model.UserName);
                Add("Email", model.Email);
                Add("MobileNumber", model.MobileNumber);
                Add("Address", model.Address);
                Add("RoleID", model.RoleID?.ToString());
                Add("Gender", model.Gender);
                Add("CountryId", model.CountryId?.ToString());
                Add("StateId", model.StateId?.ToString());
                Add("CityId", model.CityId?.ToString());
                Add("DOB", model.DOB?.ToString("yyyy-MM-dd"));
                Add("Status", model.Status.ToString());
                Add("TermsAccepted", model.TermsAccepted.ToString());
                Add("Password", model.Password);

                Add("ProfilePicPath", profilePath);
                Add("AadharPath", aadharPath);
                Add("LoggedInUserId", HttpContext.Session.GetString("UserId"));

                Add("LanguagesKnownCsv", model.LanguagesKnownCsv);
                Add("InterestedCategoriesCsv", model.InterestedCategoriesCsv);

                string result = API.PostMultipart(
                    "User/SaveUser",
                    HttpContext.Session.GetString("Token"),
                    form
                );

                string? message = JObject.Parse(result)["message"]?.ToString();

                if (message == "Email already exists.")
                {
                    ModelState.AddModelError(nameof(model.Email), message);
                    return View(model);
                }

                TempData["Message"] = message ?? "User saved successfully";
                TempData["Type"] = "success";

                return RedirectToAction("ListUser");
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                TempData["Message"] = "Something went wrong.";
                TempData["Type"] = "error";
                return View(model);
            }
        }

        [HttpGet]
        public IActionResult ListUser()
        {
            try
            {
                ViewBag.Roles = GetRoleSelectList();
                return View();
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                return View();
            }
        }

        [HttpGet]
        public IActionResult EditUser(int userID)
        {
            try
            {
                var user = JsonConvert.DeserializeObject<List<User>>(
                    API.Get("User/UserList", HttpContext.Session.GetString("Token"), $"userId={userID}")
                )?.FirstOrDefault();

                if (user == null)
                    return NotFound();

                user.RoleList = GetRoleSelectList();
                return View("AddUser", user);
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                return RedirectToAction("ListUser");
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteUser(int userID)
        {
            try
            {
                string response = API.Post($"User/DeleteUser?userID={userID}", HttpContext.Session.GetString("Token"), new { });

                JObject json = JObject.Parse(response);

                return Json(new
                {
                    success = json["success"].Value<bool>(),
                    message = json["message"].ToString()
                });
            }
            catch
            {
                return Json(new { success = false, message = "Unable to delete user." });
            }
        }

    }
}
