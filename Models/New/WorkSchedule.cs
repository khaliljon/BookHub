using System;

namespace BookHub.Models.New
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("work_schedules")]
    public class WorkSchedule
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("venue_id")]
        public int VenueId { get; set; }

        [Column("day_of_week")]
        public string? DayOfWeek { get; set; }

        [Column("open_time")]
        public TimeSpan OpenTime { get; set; }

        [Column("close_time")]
        public TimeSpan CloseTime { get; set; }

        [Column("data")]
        public string? WorkScheduleJson { get; set; }
    }
}
