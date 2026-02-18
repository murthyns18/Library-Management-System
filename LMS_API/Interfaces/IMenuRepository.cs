using LMS_API.Models;

namespace LMS_API.Interfaces
{
    public interface IMenuRepository
    {
        /// <summary>
        /// 0 = All, -1 = Active, >0 = Specific
        /// </summary>
        IEnumerable<MenuMaster> GetList(int menuId = 0);

        /// <summary>
        /// Insert or Update menu
        /// </summary>
        string SaveMenu(MenuMaster menu);

        /// <summary>
        /// Delete menu and related permissions
        /// </summary>
        string DeleteMenu(int menuId);
    }
}
