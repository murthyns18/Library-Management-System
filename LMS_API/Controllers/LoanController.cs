using LMS_API.Interfaces;
using LMS_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace LMS_API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class LoanController : BaseController
    {
        private readonly ILoanRepository _loanRepository;

        public LoanController(ILoanRepository loanRepository)
        {
            _loanRepository = loanRepository;
        }

        [HttpGet]
        public IActionResult LoanList(int loanId)
        {
            try
            {
                IEnumerable<LoanHeader> list = _loanRepository.GetList(loanId);
                return Ok(list);
            }
            catch
            {
                return StatusCode(500, new { message = "Unable to fetch loan list." });
            }
        }

        [HttpPost]
        public IActionResult CreateLoan([FromBody] LoanHeader loan)
        {
            if (!ModelState.IsValid) return BadRequest(new { message = "Invalid data." });

            try
            {
                string message = _loanRepository.CreateLoan(loan);
                return Ok(new { message });
            }
            catch
            {
                return StatusCode(500, new { message = "Unable to create loan." });
            }
        }

        [HttpPost]
        public IActionResult DeleteLoan([FromBody] int loanId)
        {
            try
            {
                string message = _loanRepository.DeleteLoan(loanId);
                return Ok(new { message });
            }
            catch
            {
                return StatusCode(500, new { message = "Unable to delete loan." });
            }
        }

        [HttpPost]
        public IActionResult ReturnLoan([FromBody] int loanId)
        {
            try
            {
                string message = _loanRepository.ReturnLoan(loanId);
                return Ok(new { message });
            }
            catch
            {
                return StatusCode(500, new { message = "Unable to return loan." });
            }
        }
    }
}
