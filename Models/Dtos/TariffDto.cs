namespace BookHub.Models.Dtos
{
    public class TariffDto
    {
        public int Id { get; set; }
        public int ClubId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal PricePerHour { get; set; }
        public bool IsNightTariff { get; set; }
    }
}
