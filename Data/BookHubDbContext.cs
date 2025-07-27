using Microsoft.EntityFrameworkCore;
using BookHub.Models;
using BookHub.Models.New;
using System;
using System.Collections.Generic;
using System.Text.Json;

namespace BookHub.Data
{
    public class BookHubDbContext : DbContext
    {
        public BookHubDbContext(DbContextOptions<BookHubDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<Venue> Venues { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<WorkSchedule> WorkSchedules { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Analytics> Analytics { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Настройка ключа для UserRole
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            // Seed ролей согласно новой архитектуре
            var fixedDate = new DateTime(2025, 07, 26, 18, 00, 00, DateTimeKind.Utc);
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "SystemAdmin", Description = "Полный доступ ко всей системе", CreatedAt = fixedDate },
                new Role { Id = 2, Name = "NetworkOwner", Description = "Владелец сети/франшизы клубов", CreatedAt = fixedDate },
                new Role { Id = 3, Name = "ClubManager", Description = "Управление клубом", CreatedAt = fixedDate },
                new Role { Id = 4, Name = "User", Description = "Обычный пользователь", CreatedAt = fixedDate }
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}
