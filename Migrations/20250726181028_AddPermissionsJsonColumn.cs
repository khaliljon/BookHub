using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookHubApi.Migrations
{
    /// <inheritdoc />
    public partial class AddPermissionsJsonColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "permissions_json",
                table: "roles",
                type: "jsonb",
                nullable: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "permissions_json",
                table: "roles"
            );
        }
    }
}
