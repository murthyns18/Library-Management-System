using Dapper;
using LMS_API.Interfaces;
using LMS_API.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace LMS_API.Repositories
{
    public class MenuRepository : IMenuRepository
    {
        private readonly IDbConnection dbConnection;

        public MenuRepository(string? connectionString)
        {
            dbConnection = new SqlConnection(connectionString);
        }

        public IEnumerable<MenuMaster> GetList(int menuId = 0)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@MenuId", menuId);

            return dbConnection.Query<MenuMaster>(
                "MenuMaster_GetList",
                parameters,
                commandType: CommandType.StoredProcedure,
                commandTimeout: 600
            );
        }

        public string SaveMenu(MenuMaster menu)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@MenuId", menu.MenuId);
            parameters.Add("@MenuName", menu.MenuName);
            parameters.Add("@DisplayName", menu.DisplayName);
            parameters.Add("@MenuLevel", menu.MenuLevel);
            parameters.Add("@ParentMenuId", menu.ParentMenuId);
            parameters.Add("@MenuUrl", menu.MenuUrl);
            parameters.Add("@DisplayOrder", menu.DisplayOrder);
            parameters.Add("@IsActive", menu.IsActive);

            parameters.Add(
                "@Result",
                dbType: DbType.String,
                direction: ParameterDirection.Output,
                size: 200
            );

            dbConnection.Execute(
                "MenuMaster_InsertUpdate",
                parameters,
                commandType: CommandType.StoredProcedure,
                commandTimeout: 600
            );

            return parameters.Get<string>("@Result");
        }

        public string DeleteMenu(int menuId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@MenuId", menuId);

            parameters.Add(
                "@Result",
                dbType: DbType.String,
                direction: ParameterDirection.Output,
                size: 200
            );

            dbConnection.Execute(
                "MenuMaster_Delete",
                parameters,
                commandType: CommandType.StoredProcedure,
                commandTimeout: 600
            );

            return parameters.Get<string>("@Result");
        }
    }
}
