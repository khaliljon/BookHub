using System.ComponentModel.DataAnnotations.Schema;

namespace OynaApi.Models
{
    [Table("auth_models")]
    public class AuthModel
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("username")]
        public string Username { get; set; }

        [Column("password")]
        public string Password { get; set; }
    }
}

