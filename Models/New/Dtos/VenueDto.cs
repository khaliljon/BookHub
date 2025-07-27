namespace BookHub.Models.New.Dtos
{
    public class VenueDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Location { get; set; }
        public int? OwnerId { get; set; }
    }
}
