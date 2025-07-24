namespace BookHub.Models.Dtos
{
    public class ClubDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string OpeningHours { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsActive { get; set; }
        public List<HallDto> Halls { get; set; } = new();
    }
}
