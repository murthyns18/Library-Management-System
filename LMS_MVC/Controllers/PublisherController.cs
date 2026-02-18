using LMS.Models;
using LMS.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace LMS.Controllers
{
    [ServiceFilter(typeof(EncryptedActionParameterFilter))]
    public class PublisherController : Controller
    {
        private readonly ILogger<PublisherController> _logger;

        public PublisherController(ILogger<PublisherController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult AddPublisher()
        {
            try
            {
                return View(new Publisher());
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                TempData["Error"] = "Unable to load Add Publisher page.";
                return RedirectToAction("PublisherList");
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult AddPublisher(Publisher model)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, errors = ModelState.Where(x => x.Value.Errors.Count > 0).ToDictionary(x => x.Key, x => x.Value.Errors.First().ErrorMessage) });
            }

            try
            {
                string result = API.Post("Publisher/SavePublisher", HttpContext.Session.GetString("Token"), model);
                string? message = JObject.Parse(result)["message"]?.ToString();
                return Json(new { success = true, message });
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                return Json(new { success = false, errors = new Dictionary<string, string> { { "", "An error occurred while saving the publisher. Please try again." } } });
            }
        }

        [HttpGet]
        public IActionResult PublisherList()
        {
            try
            {
                return View();
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                TempData["Error"] = "Unable to load publisher list.";
                return RedirectToAction("Index", "Home");
            }
        }

        [HttpGet]
        public IActionResult EditPublisher(int publisherID)
        {
            try
            {
                Publisher? publisher = JsonConvert.DeserializeObject<List<Publisher>>(API.Get("Publisher/PublisherList", HttpContext.Session.GetString("Token"), $"publisherID={publisherID}"))
                    ?.FirstOrDefault();

                if (publisher == null) return NotFound();
                return Json(publisher);
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                return StatusCode(500);
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult DeletePublisher(int publisherID, bool forceDelete)
        {
            try
            {
                string response = API.Post("Publisher/DeletePublisher", HttpContext.Session.GetString("Token"),
                    new { publisherID, forceDelete }
                );

                JObject json = JObject.Parse(response);

                return Json(new
                {
                    success = json["success"].Value<bool>(),
                    hasBooks = json["hasBooks"]?.Value<bool>() ?? false,
                    message = json["message"].ToString()
                });
            }
            catch
            {
                return Json(new { success = false, message = "Unable to delete publisher." });
            }
        }

    }
}
