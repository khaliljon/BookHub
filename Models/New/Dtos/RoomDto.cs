namespace BookHub.Models.New.Dtos
{
    public class RoomDto
    {
        public int Id { get; set; }
        public int VenueId { get; set; }
        public string? Name { get; set; }
        public string? RoomType { get; set; }
    }
}
