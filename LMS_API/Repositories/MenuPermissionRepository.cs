using Dapper;
using LMS_API.Interfaces;
using LMS_API.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace LMS_API.Repositories
{
    public class MenuPermissionRepository : IMenuPermissionRepository
    {
        private readonly IDbConnection dbConnection;

        public MenuPermissionRepository(string? connectionString)
        {
            dbConnection = new SqlConnection(connectionString);
        }

        public IEnumerable<MenuPermission> GetList(int roleId = 0)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@RoleId", roleId);

            return dbConnection.Query<MenuPermission>(
                "MenuPermission_GetList",
                parameters,
                commandType: CommandType.StoredProcedure,
                commandTimeout: 600
            );
        }

        public string SavePermission(MenuPermission permission)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@MenuRolePermissionID", permission.MenuRolePermissionID);
            parameters.Add("@MenuId", permission.MenuId);
            parameters.Add("@RoleId", permission.RoleID);
            parameters.Add("@IsRead", permission.IsRead);
            parameters.Add("@IsWrite", permission.IsWrite);

            parameters.Add(
                "@Result",
                dbType: DbType.String,
                direction: ParameterDirection.Output,
                size: 200
            );

            dbConnection.Execute(
                "MenuPermission_InsertUpdate",
                parameters,
                commandType: CommandType.StoredProcedure,
                commandTimeout: 600
            );

            return parameters.Get<string>("@Result");
        }

        public string DeletePermission(int menuRolePermissionId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@MenuRolePermissionID", menuRolePermissionId);

            parameters.Add(
                "@Result",
                dbType: DbType.String,
                direction: ParameterDirection.Output,
                size: 200
            );

            dbConnection.Execute(
                "MenuPermission_Delete",
                parameters,
                commandType: CommandType.StoredProcedure,
                commandTimeout: 600
            );

            return parameters.Get<string>("@Result");
        }
    }
}
