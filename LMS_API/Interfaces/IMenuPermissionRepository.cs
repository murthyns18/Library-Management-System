using LMS_API.Models;

namespace LMS_API.Interfaces
{
    public interface IMenuPermissionRepository
    {
        /// <summary>
        /// 0 = All roles, >0 = Specific role
        /// </summary>
        IEnumerable<MenuPermission> GetList(int roleId = 0);

        /// <summary>
        /// Insert or Update permission
        /// </summary>
        string SavePermission(MenuPermission permission);

        /// <summary>
        /// Delete permission
        /// </summary>
        string DeletePermission(int menuRolePermissionId);
    }
}
