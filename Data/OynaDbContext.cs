using Microsoft.EntityFrameworkCore;
using OynaApi.Models;
using System;

namespace OynaApi.Data
{
    public class OynaDbContext : DbContext
    {
        public OynaDbContext(DbContextOptions<OynaDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
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
    }
}
