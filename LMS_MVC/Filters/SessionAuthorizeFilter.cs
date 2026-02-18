using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace LMS.Filters
{
    public class SessionAuthorizeFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            var controller = context.RouteData.Values["controller"]?.ToString();

            // Allow Login controller
            if (controller == "Login")
                return;

            var token = context.HttpContext.Session.GetString("Token");

            if (string.IsNullOrEmpty(token))
            {
                context.Result = new RedirectToActionResult("Login", "Login", null);
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
        }
    }

}