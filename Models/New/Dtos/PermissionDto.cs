namespace BookHub.Models.New.Dtos
{
    public class PermissionDto
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public string Section { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public bool Allowed { get; set; }
    }
}
