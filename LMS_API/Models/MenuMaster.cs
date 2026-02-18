namespace LMS_API.Models
{
    public class MenuMaster
    {
        public int MenuId { get; set; }
        public string MenuName { get; set; }
        public string DisplayName { get; set; }
        public int MenuLevel { get; set; }
        public int? ParentMenuId { get; set; }
        public string MenuUrl { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
    }
}
