namespace BookHub.Models.New.Dtos
{
    public class ClubDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int? NetworkId { get; set; }
        public int? OwnerId { get; set; }
        public string? MetadataJson { get; set; }
    }
}
