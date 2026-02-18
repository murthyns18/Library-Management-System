using LMS_API.Interfaces;
using LMS_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace LMS_API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class BookController : BaseController
    {
        private readonly IBookRepository _bookRepository;

        public BookController(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        [HttpGet]
        public IActionResult BookList(int bookID)
        {
            try
            {
                IEnumerable<Book> list = _bookRepository.GetList(bookID);
                return Ok(list);
            }
            catch
            {
                return StatusCode(500, new { message = "Unable to fetch book list." });
            }
        }

        [HttpGet]
        public IActionResult GetBooksByPublisher(int publisherId)
        {
            try
            {
                IEnumerable<Book> list = _bookRepository.GetByPublisher(publisherId);
                return Ok(list);
            }
            catch
            {
                return StatusCode(500, new { message = "Unable to fetch books by publisher." });
            }
        }

        [HttpPost]
        public IActionResult SaveBook(Book book)
        {
            if (!ModelState.IsValid) return BadRequest(new { message = "Invalid data." });

            try
            {
                string message = _bookRepository.SaveBook(book);
                return Ok(new { message });
            }
            catch
            {
                return StatusCode(500, new { message = "Unable to save book." });
            }
        }

        [HttpPost]
        public IActionResult DeleteBook([FromBody] int bookID)
        {
            try
            {
                string message = _bookRepository.DeleteBook(bookID);
                bool success = message.Contains("successfully");

                return success ? Ok(new { success = true, message }) : BadRequest(new { success = false, message });
            }
            catch
            {
                return StatusCode(500, new { success = false, message = "Unable to delete book." });
            }
        }

    }
}
