using LMS_API.Models;

namespace LMS_API.Interfaces
{
    public interface ILoanRepository
    {
        /// <summary>
        /// Get loan list
        /// </summary>
        /// <param name="loanId">0 = all, -1 = active, >0 = specific</param>
        IEnumerable<LoanHeader> GetList(int loanId = 0);

        /// <summary>
        /// Create loan (Header + Details)
        /// </summary>
        string CreateLoan(LoanHeader loan);

        /// <summary>
        /// Delete loan
        /// </summary>
        string DeleteLoan(int loanId);

        /// <summary>
        /// Return loan (increase book qty)
        /// </summary>
        string ReturnLoan(int loanId);
    }
}
