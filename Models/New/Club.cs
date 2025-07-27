using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookHub.Models.New
{
public class Club
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

    // Внешний ключ на сеть/франшизу
    public int? NetworkId { get; set; }
    [ForeignKey("NetworkId")]
    public Network? Network { get; set; }

    // Внешний ключ на владельца клуба
    public int? OwnerId { get; set; }
    [ForeignKey("OwnerId")]
    public User? Owner { get; set; }

    // Навигация: залы, комнаты, сотрудники, бронирования
    public ICollection<Room>? Rooms { get; set; }
    public ICollection<User>? Staff { get; set; }
    public ICollection<Booking>? Bookings { get; set; }

    // Метаданные (JSON)
    [Column("metadata_json")]
    public string? MetadataJson { get; set; }
}
}
