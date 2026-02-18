using Dapper;
using LMS_API.Interfaces;
using LMS_API.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.Json;

namespace LMS_API.Repositories
{
    public class LoanRepository : ILoanRepository
    {
        private readonly IDbConnection dbConnection;

        public LoanRepository(string? connectionString)
        {
            dbConnection = new SqlConnection(connectionString);
        }

        public IEnumerable<LoanHeader> GetList(int loanId = 0)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@LoanId", loanId);

            return dbConnection.Query<LoanHeader>(
                "Loan_GetList",
                parameters,
                commandType: CommandType.StoredProcedure,
                commandTimeout: 600
            );
        }
        public string CreateLoan(LoanHeader loan)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@UserId", loan.UserId);

            parameters.Add(
                "@LoanDetailsJson",
                JsonSerializer.Serialize(
                    loan.LoanDetails.Select(x => new { x.BookId })
                )
            );

            parameters.Add(
                "@Result",
                dbType: DbType.String,
                direction: ParameterDirection.Output,
                size: 200
            );

            dbConnection.Execute(
                "Loan_Insert",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return parameters.Get<string>("@Result");
        }

        public string DeleteLoan(int loanId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@LoanId", loanId);

            return dbConnection.QuerySingle<string>(
                "Loan_Delete",
                parameters,
                commandType: CommandType.StoredProcedure,
                commandTimeout: 600
            );

        }

        public string ReturnLoan(int loanId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@LoanId", loanId);

            parameters.Add(
                "@Result",
                dbType: DbType.String,
                direction: ParameterDirection.Output,
                size: 200
            );

            dbConnection.Execute(
                "Loan_Return",
                parameters,
                commandType: CommandType.StoredProcedure,
                commandTimeout: 600
            );

            return parameters.Get<string>("@Result");
        }
    }
}
