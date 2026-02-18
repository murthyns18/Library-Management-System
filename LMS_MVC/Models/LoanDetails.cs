namespace LMS.Models
{
    public class LoanDetails
    {
        public int LoanId { get; set; }
        public int BookId { get; set; }
        public int Qty { get; set; } = 1;
    }
}
