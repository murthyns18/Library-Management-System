using LMS_API.Interfaces;
using LMS_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace LMS_API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class MenuController : BaseController
    {
        private readonly IMenuRepository _menuRepository;

        public MenuController(IMenuRepository menuRepository)
        {
            _menuRepository = menuRepository;
        }

        [HttpGet]
        public IActionResult MenuList(int menuId)
        {
            try
            {
                IEnumerable<MenuMaster> list = _menuRepository.GetList(menuId);
                return Ok(list);
            }
            catch
            {
                return StatusCode(500, new { message = "Unable to fetch menu list." });
            }
        }

        [HttpPost]
        public IActionResult SaveMenu(MenuMaster menu)
        {
            if (!ModelState.IsValid) return BadRequest(new { message = "Invalid data." });

            try
            {
                string message = _menuRepository.SaveMenu(menu);
                return Ok(new { message });
            }
                catch
            {
                return StatusCode(500, new { message = "Unable to save menu." });
            }
        }

        [HttpPost]
        public IActionResult DeleteMenu([FromBody] int menuId)
        {
            try
            {
                string message = _menuRepository.DeleteMenu(menuId);
                return Ok(new { message });
            }
            catch
            {
                return StatusCode(500, new { message = "Unable to delete menu." });
            }
        }
    }
}
