using System.ComponentModel.DataAnnotations.Schema;

namespace OynaApi.Models
{
    [Table("halls")]
    public class Hall
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("club_id")]
        public int ClubId { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("is_deleted")]
        public bool IsDeleted { get; set; }
    }
}
