
using LMS.Common;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;

public class EncryptedActionParameterFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        try
        {
            var request = context.HttpContext.Request;

            if (!request.Query.ContainsKey("q"))
                return;

            // Get encrypted query string
            var encryptedQuery = request.Query["q"].ToString().Replace(" ", "+");
            if (string.IsNullOrWhiteSpace(encryptedQuery))
                return;

            // Decrypt
            string decryptedString = CommonUtilities.DecryptStringAES(encryptedQuery);

            // Split into key=value pairs
            var pairs = decryptedString.Split('&', StringSplitOptions.RemoveEmptyEntries);

            foreach (var pair in pairs)
            {
                var kv = pair.Split('=');
                if (kv.Length != 2) continue;

                var key = kv[0];
                var value = kv[1];

                // Only assign if action has this parameter
                //if (!context.ActionArguments.ContainsKey(key))
                //    continue;

                // Get the expected parameter type
                var paramDescriptor = context.ActionDescriptor.Parameters
                    .FirstOrDefault(p => p.Name == key);

                if (paramDescriptor == null) continue;

                var targetType = paramDescriptor.ParameterType;

                // Handle nullable types
                var underlyingType = Nullable.GetUnderlyingType(targetType) ?? targetType;

                // Convert string to the target type
                object convertedValue = Convert.ChangeType(value, underlyingType);

                context.ActionArguments[key] = convertedValue;
            }
        }
        catch (Exception ex)
        {

            return; // Preserve stack trace
        }
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        
    }
}
