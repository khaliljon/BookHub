namespace OynaApi.Models
{
    public class ComputerSpec
    {
        public int Id { get; set; }
        public int SeatId { get; set; }
        public string CPU { get; set; }
        public string GPU { get; set; }
        public string RAM { get; set; }
        public string Storage { get; set; }
        public string Monitor { get; set; }
        public string Peripherals { get; set; }
    }
}
