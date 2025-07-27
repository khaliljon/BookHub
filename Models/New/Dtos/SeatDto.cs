namespace BookHub.Models.New.Dtos
{
    public class SeatDto
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public string? Label { get; set; }
        public string? SeatType { get; set; }
        public bool IsActive { get; set; }
    }
}
