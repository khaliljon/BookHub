using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookHub.Migrations
{
    /// <inheritdoc />
    public partial class AddIsActiveToClubs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "phone",
                table: "clubs",
                newName: "phone_number");

            migrationBuilder.AddColumn<bool>(
                name: "is_active",
                table: "clubs",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "roles",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "description", "name" },
                values: new object[] { "Суперадминистратор - полный доступ ко всем функциям системы", "SuperAdmin" });

            migrationBuilder.UpdateData(
                table: "roles",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "description", "name" },
                values: new object[] { "Администратор - управление клубами, залами, местами, тарифами", "Admin" });

            migrationBuilder.UpdateData(
                table: "roles",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "description", "name" },
                values: new object[] { "Менеджер клуба - управление бронированиями по своему клубу", "Manager" });

            migrationBuilder.InsertData(
                table: "roles",
                columns: new[] { "id", "description", "is_active", "name" },
                values: new object[] { 4, "Обычный пользователь - бронирование мест", true, "User" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "roles",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.DropColumn(
                name: "is_active",
                table: "clubs");

            migrationBuilder.RenameColumn(
                name: "phone_number",
                table: "clubs",
                newName: "phone");

            migrationBuilder.UpdateData(
                table: "roles",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "description", "name" },
                values: new object[] { "Администратор системы", "Admin" });

            migrationBuilder.UpdateData(
                table: "roles",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "description", "name" },
                values: new object[] { "Менеджер клуба", "Manager" });

            migrationBuilder.UpdateData(
                table: "roles",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "description", "name" },
                values: new object[] { "Обычный пользователь", "User" });
        }
    }
}
