using LMS.Models;
using LMS.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace LMS.Controllers
{
    public class LoanController : Controller
    {
        private readonly ILogger<LoanController> _logger;

        public LoanController(ILogger<LoanController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult LoanList()
        {
            try
            {
                return View();
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                TempData["Error"] = "Unable to load loan list.";
                return RedirectToAction("Index", "Home");
            }
        }

        [HttpGet]
        public IActionResult AddLoan()
        {
            try
            {
                return View(new LoanHeader { LoanDetails = new List<LoanDetails>() });
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                TempData["Error"] = "Unable to load Add Loan page.";
                return RedirectToAction("LoanList");
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult CreateLoan(LoanHeader loan)
        {
            try
            {
                if (loan == null || loan.LoanDetails == null || !loan.LoanDetails.Any())
                {
                    TempData["Error"] = "Please select at least one book";
                    return RedirectToAction("AddLoan");
                }

                loan.LoanDetails.ForEach(b => b.Qty = 1);
                string response = API.Post("Loan/CreateLoan", HttpContext.Session.GetString("Token"), loan);

                if (string.IsNullOrEmpty(response))
                {
                    TempData["Error"] = "Loan creation failed";
                    return RedirectToAction("AddLoan");
                }

                string? message = JObject.Parse(response)["message"]?.ToString();
                TempData["Message"] = message;
                return RedirectToAction("LoanList");
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                TempData["Error"] = "Error occurred while creating loan.";
                return RedirectToAction("AddLoan");
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteLoan(int loanId)
        {
            try
            {
                string result = API.Post("Loan/DeleteLoan", HttpContext.Session.GetString("Token"), loanId);
                string? message = JObject.Parse(result)["message"]?.ToString();
                return Ok(new { message });
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                return Ok(new { message = "Unable to delete loan." });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult ReturnLoan(int loanId)
        {
            try
            {
                string response = API.Post("Loan/ReturnLoan", HttpContext.Session.GetString("Token"), loanId);
                return Ok(new { message = JsonConvert.DeserializeAnonymousType(response, new { message = string.Empty }).message });
            }
            catch (Exception ex)
            {
                SerilogErrorHelper.LogDetailedError(_logger, ex, HttpContext);
                return Ok(new { message = "Unable to return loan." });
            }
        }
    }
}
