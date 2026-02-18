namespace LMS.Models
{
    public class AppSettings
    {
        public static APIConfig APIDetails { get; set; } = new APIConfig();
    }

    public class APIConfig
    {
        public string URL { get; set; }
    }
}
