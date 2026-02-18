namespace LMS.Models
{
    public class Menu
    {
        public int MenuID { get; set; }
        public string MenuName { get; set; }
        public string DisplayName { get; set; }
        public int MenuLevel { get; set; }
        public int ParentMenuId { get; set; }
        public int DisplayOrder { get; set; }
        public string MenuURL { get; set; }
        public string Icon { get; set; }
        public bool IsRead { get; set; }
        public bool IsWrite { get; set; }
    }
}