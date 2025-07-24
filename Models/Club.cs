using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookHub.Models
{
    [Table("clubs")]
    public class Club
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("city")]
        public string City { get; set; } = "Караганда";

        [Column("address")]
        public string Address { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("phone_number")]
        public string Phone { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("opening_hours")]
        public string OpeningHours { get; set; }

        [Column("is_deleted")]
        public bool IsDeleted { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; }

        public ICollection<Hall> Halls { get; set; }
        public ICollection<Tariff> Tariffs { get; set; }
        public ICollection<ClubPhoto> ClubPhotos { get; set; }
    }
}
