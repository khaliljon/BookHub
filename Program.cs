using Microsoft.EntityFrameworkCore;
using OynaApi.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using OynaApi.Helpers;

var builder = WebApplication.CreateBuilder(args);

// ��������� DbContext � PostgreSQL
builder.Services.AddDbContext<OynaDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ��������� �����������
builder.Services.AddControllers();

// ��������� Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ������������ ��� ������������� JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// ����������� JwtHelper ��� ������������� � ������������
builder.Services.AddScoped<JwtHelper>();

var app = builder.Build();

// ��������� ���������
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ��������� �������������� � �����������
app.UseAuthentication();
app.UseAuthorization();

// ������� ������������
app.MapControllers();

// ������ ����������
app.Run();
