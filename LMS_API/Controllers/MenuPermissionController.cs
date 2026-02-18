using LMS_API.Interfaces;
using LMS_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace LMS_API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class MenuPermissionController : BaseController
    {
        private readonly IMenuPermissionRepository _permissionRepository;

        public MenuPermissionController(IMenuPermissionRepository permissionRepository)
        {
            _permissionRepository = permissionRepository;
        }

        [HttpGet]
        public IActionResult PermissionList(int roleId)
        {
            try
            {
                IEnumerable<MenuPermission> list = _permissionRepository.GetList(roleId);
                return Ok(list);
            }
            catch
            {
                return StatusCode(500, new { message = "Unable to fetch permission list." });
            }
        }

        [HttpPost]
        public IActionResult SavePermission(MenuPermission permission)
        {
            if (!ModelState.IsValid) return BadRequest(new { message = "Invalid data." });

            try
            {
                string message = _permissionRepository.SavePermission(permission);
                return Ok(new { message });
            }
            catch
            {
                return StatusCode(500, new { message = "Unable to save permission." });
            }
        }

        [HttpPost]
        public IActionResult DeletePermission([FromBody] int menuRolePermissionId)
        {
            try
            {
                string message = _permissionRepository.DeletePermission(menuRolePermissionId);
                return Ok(new { message });
            }
            catch
            {
                return StatusCode(500, new { message = "Unable to delete permission." });
            }
        }
    }
}
