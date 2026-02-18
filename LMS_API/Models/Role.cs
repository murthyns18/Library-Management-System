namespace LMS_API.Models
{
    public class Role
    {
        public short RoleID { get; set; }
        public string RoleName { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
