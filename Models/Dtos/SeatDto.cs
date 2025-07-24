namespace BookHub.Models.Dtos
{
    public class SeatDto
    {
        public int Id { get; set; }
        public int HallId { get; set; }
        public string SeatNumber { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public bool IsDeleted { get; set; }
    }
}
