using Dapper;
using LMS_API.Interfaces;
using LMS_API.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Data.Common;

namespace LMS_API.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly IDbConnection _db;

        public RoleRepository(string connectionString)
        {
            _db = new SqlConnection(connectionString);
        }

        public IEnumerable<Role> GetRoles(short roleId = 0)
        {
            DynamicParameters param = new();
            param.Add("@RoleID", roleId);

            return _db.Query<Role>(
                "Role_GetList",
                param,
                commandType: CommandType.StoredProcedure
            );
        }

        public string SaveRole(Role role)
        {
            DynamicParameters param = new();
            param.Add("@RoleID", role.RoleID);
            param.Add("@RoleName", role.RoleName);
            param.Add("@IsActive", role.IsActive);
            param.Add("@Result", dbType: DbType.String, direction: ParameterDirection.Output, size: 200);

            _db.Execute(
                "Role_InsertUpdate",
                param,
                commandType: CommandType.StoredProcedure
            );

            return param.Get<string>("@Result");
        }

        public string DeleteRole(int roleID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@roleID", roleID);

            return _db.QuerySingle<string>(
                "Role_Delete",
                parameters,
                commandType: CommandType.StoredProcedure,
                commandTimeout: 600
            );
        }
    }
}
