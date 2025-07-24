using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookHub.Migrations
{
    /// <inheritdoc />
    public partial class AddSuperAdminRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.DropColumn(
            //     name: "assigned_by",
            //     table: "user_roles");

            // migrationBuilder.RenameColumn(
            //     name: "registration_date",
            //     table: "users",
            //     newName: "updated_at");

            migrationBuilder.RenameColumn(
                name: "hashed_password",
                table: "users",
                newName: "password_hash");

            migrationBuilder.RenameColumn(
                name: "time_start",
                table: "bookings",
                newName: "start_time");

            migrationBuilder.RenameColumn(
                name: "time_end",
                table: "bookings",
                newName: "end_time");

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "users",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "managed_club_id",
                table: "users",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_managed_club_id",
                table: "users",
                column: "managed_club_id");

            migrationBuilder.AddForeignKey(
                name: "FK_users_clubs_managed_club_id",
                table: "users",
                column: "managed_club_id",
                principalTable: "clubs",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_users_clubs_managed_club_id",
                table: "users");

            migrationBuilder.DropIndex(
                name: "IX_users_managed_club_id",
                table: "users");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "users");

            migrationBuilder.DropColumn(
                name: "managed_club_id",
                table: "users");

            // migrationBuilder.RenameColumn(
            //     name: "updated_at",
            //     table: "users",
            //     newName: "registration_date");

            migrationBuilder.RenameColumn(
                name: "password_hash",
                table: "users",
                newName: "hashed_password");

            migrationBuilder.RenameColumn(
                name: "start_time",
                table: "bookings",
                newName: "time_start");

            migrationBuilder.RenameColumn(
                name: "end_time",
                table: "bookings",
                newName: "time_end");

            migrationBuilder.AddColumn<int>(
                name: "assigned_by",
                table: "user_roles",
                type: "integer",
                nullable: true);
        }
    }
}
