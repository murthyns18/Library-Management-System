using System.Diagnostics;

public static class SerilogErrorHelper
{
    public static void LogDetailedError(ILogger logger, Exception ex, HttpContext context)
    {
        var stackTrace = new StackTrace(ex, true);

        var frame = stackTrace.GetFrames()?.FirstOrDefault(f => f.GetMethod()?.DeclaringType?.Namespace?.StartsWith("LMS") == true);

        var method = frame?.GetMethod();

        logger.LogError(
        $@"ErrorType    : {ex.GetType().Name}
        Message      : {ex.Message}

        Class        : {method?.DeclaringType?.Name}
        Method       : {method?.Name}
        Namespace    : {method?.DeclaringType?.Namespace}
        LineNumber   : {frame?.GetFileLineNumber()}

        RequestId    : {context.TraceIdentifier}
        Url          : {context.Request.Path}
        HttpMethod   : {context.Request.Method}");
    }

}
