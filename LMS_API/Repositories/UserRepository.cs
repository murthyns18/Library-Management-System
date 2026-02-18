using Dapper;
using LMS_API.Interfaces;
using LMS_API.Models;
using Microsoft.Data.SqlClient;
using System;
using System.Data;

namespace LMS_API.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IDbConnection dbConnection;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserRepository(string? connectionString, IHttpContextAccessor httpContextAccessor)
        {
            dbConnection = new SqlConnection(connectionString);
            _httpContextAccessor = httpContextAccessor;
        }

        public IEnumerable<User> GetList(int userId = 0)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("UserID", userId);

            return dbConnection.Query<User>(
                "User_GetList",
                parameters,
                commandType: CommandType.StoredProcedure,
                commandTimeout: 600
            );
        }

        public string SaveUser(User user)
        {
            DynamicParameters p = new DynamicParameters();

            string? hashedPassword = null;

            if (!string.IsNullOrWhiteSpace(user.Password))
            {
                hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
            }

            p.Add("UserID", user.UserID);
            p.Add("UserName", user.UserName);
            p.Add("Email", user.Email);
            p.Add("MobileNumber", user.MobileNumber);
            p.Add("Address", user.Address);
            p.Add("RoleID", user.RoleID);
            p.Add("Gender", user.Gender);
            p.Add("LanguagesKnown", string.Join(",", user.LanguagesKnown));
            p.Add("CountryId", user.CountryId);
            p.Add("StateId", user.StateId);
            p.Add("CityId", user.CityId);
            p.Add("DOB", user.DOB);
            p.Add("LoggedInUserId", _httpContextAccessor.HttpContext?.Session.GetString("UserName"));
            p.Add("InterestedCategories", string.Join(",", user.InterestedCategories));
            p.Add("TermsAccepted", user.TermsAccepted);
            p.Add("Status", user.Status);

            p.Add("Password", hashedPassword);

            p.Add("ProfilePicPath", user.ProfilePicPath);
            p.Add("AadharPath", user.AadharPath);

            p.Add("Result", dbType: DbType.String,
                direction: ParameterDirection.Output, size: 500);

            dbConnection.Execute("User_InsertUpdate", p,
                commandType: CommandType.StoredProcedure);

            return p.Get<string>("Result");
        }


        public string DeleteUser(int userId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("UserID", userId);

            return dbConnection.QuerySingle<string>(
                "User_Delete",
                parameters,
                commandType: CommandType.StoredProcedure,
                commandTimeout: 600
            );
        }

        public Tuple<User, IEnumerable<Menu>> AuthenticateUser(AuthenticateUser authenticateUser)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Email", authenticateUser.Email);

            SqlMapper.GridReader result = dbConnection.QueryMultiple(
                "User_AuthenticateUser",
                parameters,
                commandType: CommandType.StoredProcedure,
                commandTimeout: 600
            );

            User? user = result.ReadSingleOrDefault<User>();
            IEnumerable<Menu> menus = result.Read<Menu>();

            if (user == null)
                return null;

            // BCrypt password verification
            bool isValidPassword = BCrypt.Net.BCrypt.Verify(authenticateUser.Password, user.Password );

            if (!isValidPassword)
                return null;

            return new Tuple<User, IEnumerable<Menu>>(user, menus);
        }

        public IEnumerable<User> GetCountries()
        {
            return dbConnection.Query<User>(
                "GetCountries",
                commandType: CommandType.StoredProcedure,
                commandTimeout: 600
            );
        }

        public IEnumerable<User> GetStatesByCountry(int countryId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("CountryId", countryId);

            return dbConnection.Query<User>(
                "GetStatesByCountry",
                parameters,
                commandType: CommandType.StoredProcedure,
                commandTimeout: 600
            );
        }

        public IEnumerable<User> GetCitiesByState(int stateId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("StateId", stateId);

            return dbConnection.Query<User>(
                "GetCitiesByState",
                parameters,
                commandType: CommandType.StoredProcedure,
                commandTimeout: 600
            );
        }


        public string GenerateResetToken(string email)
        {
            string token = Guid.NewGuid().ToString();

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("Email", email);
            parameters.Add("Token", token);

            dbConnection.Execute(
                "User_ForgotPassword",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return token; 
        }


        public bool ResetPassword(string email, string token, string newPassword)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("Email", email);
            parameters.Add("Token", token);
            parameters.Add("NewPassword", BCrypt.Net.BCrypt.HashPassword(newPassword));

            int result = dbConnection.QuerySingle<int>(
                "User_ResetPassword",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return result == 1;
        }


    }
}
