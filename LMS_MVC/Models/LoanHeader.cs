namespace LMS.Models
{
    public class LoanHeader
    {
        public int LoanId { get; set; }
        public int UserId { get; set; }
        public int TotalQty { get; set; }

        public string? Status { get; set; } = "Active";


        public DateTime LoanDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? ReturnDate { get; set; }

        public List<LoanDetails> LoanDetails { get; set; } = new();
    }
}
