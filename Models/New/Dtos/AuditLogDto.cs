namespace BookHub.Models.New.Dtos
{
    public class AuditLogDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Action { get; set; } = string.Empty;
        public string? Entity { get; set; }
        public int? EntityId { get; set; }
        public string? Details { get; set; }
        public string? CreatedAt { get; set; }
    }
}
