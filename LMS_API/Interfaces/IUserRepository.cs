using LMS_API.Models;
using System.Collections.Generic;

namespace LMS_API.Interfaces
{
    public interface IUserRepository
    {
        /// <summary>
        /// To get user list or user by id
        /// </summary>
        /// <param name="userId">0, -1, >0</param>
        /// <returns>Returns user list</returns>
        IEnumerable<User> GetList(int userId = 0);

        /// <summary>
        /// To add or update user
        /// </summary>
        /// <param name="user"></param>
        /// <returns>Returns success message</returns>
        string SaveUser(User user);

        /// <summary>
        /// To delete user
        /// </summary>
        /// <param name="userId"></param>
        string DeleteUser(int userId);
        /// <summary>
        /// To get the list of valid user details & respective menu details
        /// </summary>
        /// <param name="authenticateUser"></param>
        /// <returns></returns>
        Tuple<User, IEnumerable<Menu>> AuthenticateUser(AuthenticateUser authenticateUser);


        /// <summary>
        /// to get countries
        /// </summary>
        /// <returns>returns countries</returns>
        IEnumerable<User> GetCountries();

        /// <summary>
        /// to get states by country
        /// </summary>
        /// <param name="countryId"></param>
        /// <returns>returns sates</returns>
        IEnumerable<User> GetStatesByCountry(int countryId);

        /// <summary>
        /// to get cities by state
        /// </summary>
        /// <param name="stateId"></param>
        /// <returns>returns cities</returns>
        IEnumerable<User> GetCitiesByState(int stateId);

        /// <summary>
        /// to generate reset token for forgot password
        /// </summary>
        /// <param name="email"></param>
        /// <returns>return token</returns>
        string GenerateResetToken(string email);


        /// <summary>
        /// to reset the password
        /// </summary>
        /// <param name="email"></param>
        /// <param name="token"></param>
        /// <param name="newPassword"></param>
        /// <returns></returns>
        bool ResetPassword(string email, string token, string newPassword);
        
    }
}
