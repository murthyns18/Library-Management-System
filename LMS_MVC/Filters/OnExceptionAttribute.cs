using LMS.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

namespace LMS.Filters
{
    public class OnExceptionAttribute : IExceptionFilter
    {
        private readonly ILogger<OnExceptionAttribute> _logger;

        public OnExceptionAttribute(ILogger<OnExceptionAttribute> logger)
        {
            _logger = logger;
        }

        public void OnException(ExceptionContext context)
        {
            var exception = context.Exception;

            SerilogErrorHelper.LogDetailedError(_logger,exception,context.HttpContext);

            context.ExceptionHandled = true;

            // If request expects JSON (AJAX / API)
            if (context.HttpContext.Request.Headers["X-Requested-With"] == "XMLHttpRequest")
            {
                context.Result = new JsonResult(new
                {
                    success = false,
                    message = "Something went wrong. Please try again."
                })
                {
                    StatusCode = 500
                };
                return;
            }

            // Normal MVC request → Error view
            context.Result = new ViewResult
            {
                ViewName = "Error", ViewData = new ViewDataDictionary( new EmptyModelMetadataProvider(),new ModelStateDictionary())
                {
                    {
                        "ErrorMessage",exception?.Message ?? "An unexpected error occurred."
                    }
                }
            };
        }

    }
}
