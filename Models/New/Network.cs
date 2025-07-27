using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace BookHub.Models.New
{
    public class Network
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("name")]
        public string? Name { get; set; }

        [MaxLength(500)]
        [Column("description")]
        public string? Description { get; set; }

        // Навигация: клубы
        public ICollection<Club>? Clubs { get; set; }

        // Метаданные (JSON)
        [Column("metadata_json")]
        public string? MetadataJson { get; set; }
    }
}
