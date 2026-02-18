namespace LMS_API.Models
{
    public class MenuPermission
    {
        public int MenuRolePermissionID { get; set; }
        public int MenuId { get; set; }
        public int RoleID { get; set; }
        public bool IsRead { get; set; }
        public bool IsWrite { get; set; }
    }
}
