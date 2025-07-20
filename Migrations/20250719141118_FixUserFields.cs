using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OynaApi.Migrations
{
    /// <inheritdoc />
    public partial class FixUserFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "registration_date",
                table: "users",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "hashed_password",
                table: "users",
                newName: "password_hash");

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
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
                name: "updated_at",
                table: "users");

            migrationBuilder.DropColumn(
                name: "managed_club_id",
                table: "users");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "users",
                newName: "registration_date");

            migrationBuilder.RenameColumn(
                name: "password_hash",
                table: "users",
                newName: "hashed_password");
        }
    }
}
