namespace BookHub.Models.New.Dtos
{
    public class AnalyticsDto
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string? Action { get; set; }
        public string? Data { get; set; }
        public string? Timestamp { get; set; }
    }
}
