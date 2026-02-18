using LMS.Models;
using LMS.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace LMS.Controllers
{
    public class LoginController : Controller
    {
        private readonly ILogger<LoginController> _logger;

        public LoginController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Login()
        {
            try
            {
                return View();
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                return View();
            }
        }

        [HttpPost]
        public IActionResult Login(LoginViewModel loginViewModel)
        {
            try
            {
                string response = API.Post("Token", null, loginViewModel);

                if (string.IsNullOrEmpty(response))
                {
                    TempData["Message"] = "Invalid email or password!";
                    TempData["Messageclass"] = "alert-danger";
                    return View(loginViewModel);
                }

                var data = JsonConvert.DeserializeAnonymousType(response, new
                {
                    user = new User(),
                    access_token = string.Empty,
                    menuDetails = new List<Menu>()
                });

                HttpContext.Session.SetString("Token", data.access_token);
                HttpContext.Session.SetString("MenuDetails", JsonConvert.SerializeObject(data.menuDetails));

                HttpContext.Session.SetString("UserName", data.user.UserName);
            
                HttpContext.Session.SetString("UserId", data.user.UserID.ToString());

                return RedirectToAction("BookList", "Book");
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                TempData["Message"] = "Invalid email or password!";
                TempData["Messageclass"] = "alert-danger";
                return View(loginViewModel);
            }
        }

        [HttpGet]
        public IActionResult Logout()
        {
            try
            {
                HttpContext.Session.Clear();
                return RedirectToAction("Login", "Login");
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                return RedirectToAction("Login", "Login");
            }
        }

        [HttpGet]
        public IActionResult ForgotPassword()
        {
            try
            {
                return View();
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                return View();
            }
        }

        [HttpPost]
        public IActionResult ForgotPassword(ForgotPasswordViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return View(model);

                API.Post("Account/ForgotPassword", null, model);

                TempData["Message"] = "Please check your email, reset link has been sent.";
                TempData["Messageclass"] = "alert-success";

                return View();
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                TempData["Message"] = "Something went wrong. Please try again.";
                TempData["Messageclass"] = "alert-danger";
                return View(model);
            }
        }

        [HttpGet]
        public IActionResult ResetPassword(string email, string token)
        {
            try
            {
                return View(new ResetPasswordViewModel
                {
                    Email = email,
                    Token = token
                });
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                return View();
            }
        }

        [HttpPost]
        public IActionResult ResetPassword(ResetPasswordViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return View(model);

                string response = API.Post("Account/ResetPassword", null, model);

                if (string.IsNullOrEmpty(response))
                {
                    TempData["Message"] = "Invalid or expired reset link";
                    TempData["Messageclass"] = "alert-danger";
                    return View(model);
                }

                TempData["Message"] = "Password reset successful";
                TempData["Messageclass"] = "alert-success";

                return RedirectToAction("Login");
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                TempData["Message"] = "Something went wrong. Please try again.";
                TempData["Messageclass"] = "alert-danger";
                return View(model);
            }
        }

    }
}
