using LMS_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BaseController : ControllerBase
    {
        public User UserInfo
        {
            get
            {
                User account = new User();
                ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;
                IEnumerable<Claim> claims = identity.Claims;
                account.UserID = Convert.ToInt32(claims.FirstOrDefault(c => c.Type == "UserID")?.Value);
                return account;
            }
        }
    }
}
