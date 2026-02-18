using LMS_API.Models;

namespace LMS_API.Interfaces
{
    public interface IRoleRepository
    {
        /// <summary>
        /// To get role list or role by id
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns>Returns role list</returns>
        IEnumerable<Role> GetRoles(short roleId = 0);

        /// <summary>
        /// To add or update role
        /// </summary>
        /// <param name="role">0, >0 , -1</param>
        /// <returns>Returns success message</returns>
        string SaveRole(Role role);

        /// <summary>
        /// To delete role
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns>Returns delete success message</returns>
        string DeleteRole(int roleId);
    }
}
