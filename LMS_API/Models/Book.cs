namespace LMS_API.Models
{
    public class Book
    {
        public int BookID { get; set; }

        public string Title { get; set; }

        public int? CategoryId { get; set; }

        public int? PublisherId { get; set; }
        public string? PublisherName { get; set; }
        public string? CategoryName { get; set; }

        public decimal Price { get; set; }

        public string ISBN { get; set; }

        public int Quantity { get; set; }

        public bool IsActive { get; set; }
    }
}
