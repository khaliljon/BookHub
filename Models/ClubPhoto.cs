using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookHub.Models
{
    [Table("club_photos")]
    public class ClubPhoto
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("club_id")]
        public int ClubId { get; set; }

        [ForeignKey("ClubId")]
        public Club Club { get; set; }

        [Column("photo_url")]
        public string PhotoUrl { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("uploaded_at")]
        public DateTime UploadedAt { get; set; }
    }
}
