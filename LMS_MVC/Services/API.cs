using LMS.Models;
using System.Net.Http.Headers;
using System.Net.Sockets;

namespace LMS.Services
{
    // Centralized API helper class
    // Used by MVC to communicate with Web API
    public static class API
    {
        // Base API URL loaded from appsettings.json during application startup
        static string apiBaseURL = AppSettings.APIDetails.URL;

        /// <summary>
        /// Sends HTTP POST request to Web API
        /// </summary>
        /// <param name="URL">API endpoint (without base URL)</param>
        /// <param name="token">JWT token for authorization (optional)</param>
        /// <param name="myobject">Request body object</param>
        /// <returns>API response as string</returns>
        public static string Post(string URL, string? token, dynamic myobject)
        {
            try
            {
                // HttpClient is used to send HTTP requests to the API
                HttpClient client = new HttpClient();

                // Attach JWT Bearer token to request header if provided
                // This allows secured API endpoints to validate the request
                if (!string.IsNullOrEmpty(token))
                    client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);

                // Converts C# object into JSON automatically
                // Also sets Content-Type: application/json
                // This ensures API model binding works correctly
                // Prevents issues like: "bookID is null"
                JsonContent content = JsonContent.Create(myobject);

                // Send POST request synchronously to API
                var response = client
                    .PostAsync(apiBaseURL + URL, content)
                    .GetAwaiter()
                    .GetResult();

                // Handle success response
                if (response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    // Read and return response content
                    var responseMessage =
                        response.Content.ReadAsStringAsync()
                        .GetAwaiter()
                        .GetResult();

                    return responseMessage;
                }
                // Handle unauthorized (token expired or invalid)
                else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    return "token expired";
                }
                // Handle all other HTTP errors
                else
                {
                    var responseMessage =
                        response.Content.ReadAsStringAsync()
                        .GetAwaiter()
                        .GetResult();

                    return responseMessage;
                }
            }
            // Handle network-level errors (API unreachable, no internet, timeout, etc.)
            catch (HttpRequestException httpEx)
                when (httpEx.InnerException is SocketException socketEx)
            {
                switch (socketEx.SocketErrorCode)
                {
                    case SocketError.NetworkDown:
                        return "The network is down. Please check your network connection.";

                    case SocketError.NetworkUnreachable:
                        return "Network unreachable. Please ensure you have a working internet connection.";

                    case SocketError.HostUnreachable:
                        return "The remote host is unreachable. Please try again later.";

                    case SocketError.ConnectionRefused:
                        return "The connection was refused by the server. Please check if the server is running.";

                    case SocketError.ConnectionReset:
                        return "The connection was reset by the server. Please try again.";

                    case SocketError.TimedOut:
                        return "The connection attempt timed out. Please try again later.";

                    default:
                        return "A network issue occurred. Please try again.";
                }
            }
            // Catch any unexpected runtime exception
            catch (Exception ex)
            {
                return ex.Message;
            }
        }


        /// <summary>
        /// Sends HTTP GET request to Web API
        /// </summary>
        /// <param name="URL">API endpoint</param>
        /// <param name="token">JWT token (optional)</param>
        /// <param name="queryParameters">Query string parameters</param>
        /// <returns>API response as string</returns>
        public static string Get(string URL, string? token, string? queryParameters = null)
        {
            try
            {
                // Create HttpClient to call API
                HttpClient client = new HttpClient();

                // Attach authorization token if available
                if (!string.IsNullOrEmpty(token))
                    client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);

                // Append query parameters if provided
                URL = URL + (!string.IsNullOrEmpty(queryParameters)
                    ? "?" + queryParameters
                    : string.Empty);

                // Send GET request synchronously
                var response = client
                    .GetAsync(apiBaseURL + URL)
                    .GetAwaiter()
                    .GetResult();

                // Success response
                if (response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    var responseMessage =
                        response.Content.ReadAsStringAsync()
                        .GetAwaiter()
                        .GetResult();

                    return responseMessage;
                }
                // Token expired or unauthorized
                else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    return "token expired";
                }
                // Other HTTP errors
                else
                {
                    var responseMessage =
                        response.Content.ReadAsStringAsync()
                        .GetAwaiter()
                        .GetResult();

                    return responseMessage;
                }
            }
            // Network-related exception handling
            catch (HttpRequestException httpEx)
                when (httpEx.InnerException is SocketException socketEx)
            {
                switch (socketEx.SocketErrorCode)
                {
                    case SocketError.NetworkDown:
                        return "The network is down. Please check your network connection.";

                    case SocketError.NetworkUnreachable:
                        return "Network unreachable. Please ensure you have a working internet connection.";

                    case SocketError.HostUnreachable:
                        return "The remote host is unreachable. Please try again later.";

                    case SocketError.ConnectionRefused:
                        return "The connection was refused by the server. Please check if the server is running.";

                    case SocketError.ConnectionReset:
                        return "The connection was reset by the server. Please try again.";

                    case SocketError.TimedOut:
                        return "The connection attempt timed out. Please try again later.";

                    default:
                        return "A network issue occurred. Please try again.";
                }
            }
            // General exception handling
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        public static string PostMultipart(
           string URL,
           string? token,
           MultipartFormDataContent formData)
        {
            try
            {
                HttpClient client = new HttpClient();

                if (!string.IsNullOrEmpty(token))
                {
                    client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);
                }

                var response = client
                    .PostAsync(apiBaseURL + URL, formData)
                    .GetAwaiter()
                    .GetResult();

                var responseMessage = response.Content
                    .ReadAsStringAsync()
                    .GetAwaiter()
                    .GetResult();

                return responseMessage;
            }
            catch (HttpRequestException httpEx)
                when (httpEx.InnerException is SocketException socketEx)
            {
                return socketEx.SocketErrorCode switch
                {
                    SocketError.NetworkDown => "The network is down.",
                    SocketError.NetworkUnreachable => "Network unreachable.",
                    SocketError.HostUnreachable => "Host unreachable.",
                    SocketError.ConnectionRefused => "Connection refused.",
                    SocketError.TimedOut => "Connection timed out.",
                    _ => "Network error occurred."
                };
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
