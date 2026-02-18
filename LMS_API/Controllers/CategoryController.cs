using LMS_API.Interfaces;
using LMS_API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace LMS_API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class CategoryController : BaseController
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        [HttpGet]
        public IActionResult CategoryList(int categoryID)
        {
            try
            {
                IEnumerable<Category> list = _categoryRepository.GetList(categoryID);
                return Ok(list);
            }
            catch
            {
                return StatusCode(500, new { message = "Unable to fetch category list." });
            }
        }

        [HttpPost]
        public IActionResult SaveCategory(Category category)
        {
            if (!ModelState.IsValid) return BadRequest(new { message = "Invalid data." });

            try
            {
                string message = _categoryRepository.SaveCategory(category);
                return Ok(new { message });
            }
            catch
            {
                return StatusCode(500, new { message = "Unable to save category." });
            }
        }

        [HttpPost]
        public IActionResult DeleteCategory([FromBody] dynamic data)
        {
            try
            {
                JsonElement json = (JsonElement)data;

                int categoryID = json.GetProperty("categoryID").GetInt32();
                bool forceDelete = json.GetProperty("forceDelete").GetBoolean();

                var result = _categoryRepository.DeleteCategory(categoryID, forceDelete);

                return Ok(new
                {
                    success = result.Success,
                    hasBooks = result.HasBooks,
                    message = result.Message?.ToString()
                });
            }
            catch
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Unable to delete category."
                });
            }
        }
    }
}
