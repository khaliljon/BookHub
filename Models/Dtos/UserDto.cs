using System;
using System.Collections.Generic;

namespace OynaApi.Models.Dtos
{
    public class UserDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public decimal Balance { get; set; }
        public int Points { get; set; }
        public bool IsDeleted { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
    }
}
