using LMS.Models;
using LMS.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace LMS.Controllers
{
    public class MenuPermissionController : Controller
    {
        private readonly ILogger<MenuPermissionController> _logger;

        public MenuPermissionController(ILogger<MenuPermissionController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult MenuPermissionList()
        {
            try
            {
                return View("PermissionList");
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                TempData["Error"] = "Unable to load menu permission list.";
                return RedirectToAction("Index", "Home");
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult SavePermission(MenuPermission model)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, errors = ModelState.Where(x => x.Value.Errors.Count > 0).ToDictionary(x => x.Key, x => x.Value.Errors.First().ErrorMessage) });
            }

            try
            {
                string result = API.Post("MenuPermission/SavePermission", HttpContext.Session.GetString("Token"), model);
                string? message = JObject.Parse(result)["message"]?.ToString();

                if (message == "Menu Id does not exist")
                {
                    return Json(new { success = false, errors = new Dictionary<string, string> { { "MenuId", message } } });
                }

                return Json(new { success = true, message });
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                return Json(new { success = false, errors = new Dictionary<string, string> { { "", "An error occurred while saving Menu Permission." } } });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult DeletePermission(int menuRolePermissionId)
        {
            try
            {
                string result = API.Post("MenuPermission/DeletePermission", HttpContext.Session.GetString("Token"), menuRolePermissionId);
                string? message = JObject.Parse(result)["message"]?.ToString();
                return Json(new { success = true, message });
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                return Json(new { success = false, message = "Unable to delete menu permission." });
            }
        }
    }
}
