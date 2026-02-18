using LMS.Models;
using LMS.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace LMS.Controllers
{
    [ServiceFilter(typeof(EncryptedActionParameterFilter))]
    public class MenuController : Controller
    {
        private readonly ILogger<MenuController> _logger;

        public MenuController(ILogger<MenuController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult MenuList()
        {
            try
            {
                return View();
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                TempData["Error"] = "Unable to load menu list.";
                return RedirectToAction("Index", "Home");
            }
        }

        [HttpGet]
        public IActionResult AddMenu()
        {
            try
            {
                return View(new MenuMaster());
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                TempData["Error"] = "Unable to load Add Menu page.";
                return RedirectToAction("MenuList");
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult AddMenu(MenuMaster model)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, errors = ModelState.Where(x => x.Value.Errors.Count > 0).ToDictionary(x => x.Key, x => x.Value.Errors.First().ErrorMessage) });
            }

            try
            {
                string result = API.Post("Menu/SaveMenu", HttpContext.Session.GetString("Token"), model);
                string? message = JObject.Parse(result)["message"]?.ToString();

                if (message == "Menu already exists")
                {
                    return Json(new { success = false, errors = new Dictionary<string, string> { { "MenuName", message } } });
                }

                return Json(new { success = true, message });
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                return Json(new { success = false, errors = new Dictionary<string, string> { { "", "Unable to save menu." } } });
            }
        }

        [HttpGet]
        public IActionResult EditMenu(int menuId)
        {
            try
            {
                MenuMaster? menu = JsonConvert.DeserializeObject<List<MenuMaster>>(API.Get("Menu/MenuList", HttpContext.Session.GetString("Token"), $"menuId={menuId}"))?.FirstOrDefault();
                if (menu == null) return NotFound();
                return Json(menu);
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                return StatusCode(500);
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteMenu([FromForm] int menuId)
        {
            try
            {
                string result = API.Post("Menu/DeleteMenu", HttpContext.Session.GetString("Token"), menuId);
                string? message = JObject.Parse(result)["message"]?.ToString();
                return Json(new { success = true, message });
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                return Json(new { success = false, errors = new Dictionary<string, string> { { "", "Unable to delete menu." } } });
            }
        }
    }
}
