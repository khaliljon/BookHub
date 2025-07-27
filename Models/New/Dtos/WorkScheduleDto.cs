namespace BookHub.Models.New.Dtos
{
    public class WorkScheduleDto
    {
        public int Id { get; set; }
        public int VenueId { get; set; }
        public string? DayOfWeek { get; set; }
        public string? OpenTime { get; set; }
        public string? CloseTime { get; set; }
    }
}
