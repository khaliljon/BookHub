using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookHub.Models
{
    [Table("tariffs")]
    public class Tariff
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("club_id")]
        public int ClubId { get; set; }

        [ForeignKey("ClubId")]
        public Club Club { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("price_per_hour")]
        public decimal PricePerHour { get; set; }

        [Column("is_night_tariff")]
        public bool IsNightTariff { get; set; }

        public ICollection<Booking> Bookings { get; set; }
    }
}
