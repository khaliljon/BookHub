namespace OynaApi.Models.Dtos
{
    public class ClubPhotoDto
    {
        public int Id { get; set; }
        public int ClubId { get; set; }
        public string PhotoUrl { get; set; }
        public string Description { get; set; }
        public DateTime UploadedAt { get; set; }
    }
}
