using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace OynaApi.Models
{
    [Table("computer_specs")]
    public class ComputerSpec
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("seat_id")]
        public int SeatId { get; set; }

        [ForeignKey("SeatId")]
        public Seat Seat { get; set; }

        [Column("cpu")]
        public string CPU { get; set; }

        [Column("gpu")]
        public string GPU { get; set; }

        [Column("ram")]
        public string RAM { get; set; }

        [Column("monitor")]
        public string Monitor { get; set; }

        [Column("peripherals")]
        public string Peripherals { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
}
