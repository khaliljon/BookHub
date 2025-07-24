using Microsoft.EntityFrameworkCore;
using BookHub.Models;
using System;

namespace BookHub.Data
{
    public class BookHubDbContext : DbContext
    {
        public BookHubDbContext(DbContextOptions<BookHubDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Club> Clubs { get; set; }
        public DbSet<Hall> Halls { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<ComputerSpec> ComputerSpecs { get; set; }
        public DbSet<ClubPhoto> ClubPhotos { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<Tariff> Tariffs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Настройка связи многие-ко-многим для User-Role
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);

            // Настройка связи многие-ко-многим через UserRole
            modelBuilder.Entity<User>()
                .HasMany(u => u.Roles)
                .WithMany(r => r.Users)
                .UsingEntity<UserRole>();

            // Заполнение базовых ролей
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "SuperAdmin", Description = "Суперадминистратор - полный доступ ко всем функциям системы", IsActive = true },
                new Role { Id = 2, Name = "Admin", Description = "Администратор - управление клубами, залами, местами, тарифами", IsActive = true },
                new Role { Id = 3, Name = "Manager", Description = "Менеджер клуба - управление бронированиями по своему клубу", IsActive = true },
                new Role { Id = 4, Name = "User", Description = "Обычный пользователь - бронирование мест", IsActive = true }
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}