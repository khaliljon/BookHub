using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using BookHub.Models;

namespace BookHub.Services
{
    public class JwtService
    {
        private readonly IConfiguration _config;

        public JwtService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(User user, List<string> roles)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured")));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email ?? user.PhoneNumber),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Используем стандартный claim для UserId
                new Claim("id", user.Id.ToString()),
                new Claim("fullName", user.FullName ?? ""),
                new Claim("email", user.Email ?? ""),
                new Claim("phone", user.PhoneNumber ?? "")
            };

            // Добавляем ManagedClubId для менеджеров
            if (user.ManagedClubId.HasValue)
            {
                claims.Add(new Claim("ManagedClubId", user.ManagedClubId.Value.ToString()));
            }

            // Добавляем роли
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(Convert.ToDouble(_config["Jwt:ExpiresInDays"] ?? "7")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Упрощенный метод для обратной совместимости
        public string GenerateToken(User user)
        {
            return GenerateToken(user, new List<string> { "User" });
        }
    }
}
