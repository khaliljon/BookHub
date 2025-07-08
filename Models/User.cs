using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace OynaApi.Models
{
    [Table("users")]
    public class User
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("full_name")]
        public string FullName { get; set; }

        [Column("phone_number")]
        public string PhoneNumber { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("hashed_password")]
        public string HashedPassword { get; set; }

        [Column("registration_date")]
        public DateTime RegistrationDate { get; set; }

        [Column("balance")]
        public decimal Balance { get; set; }

        [Column("points")]
        public int Points { get; set; }

        [Column("is_deleted")]
        public bool IsDeleted { get; set; }
    }
}
