using Microsoft.EntityFrameworkCore;
using MediClinic.API.Data;
using System.Text.Json.Serialization;
using MediClinic.API.Models;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Configuration
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Controllers & JSON Options
builder.Services.AddControllers()
    .AddJsonOptions(options => 
    {
        // Utilise camelCase pour le JSON (important pour la compatibilité React)
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        // Permet de convertir les Enums (Status) en texte ou nombre proprement
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        // Évite les erreurs de boucles infinies lors de la récupération des données
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    })
    .ConfigureApiBehaviorOptions(options =>
    {
        // TRÈS IMPORTANT : Mettre à false pour voir l'erreur exacte dans l'onglet Network
        options.SuppressModelStateInvalidFilter = false; 
    });

// 3. CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin() // Ou .WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Auto-création de la base de données au démarrage
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
}

// Swagger pour le test de l'API
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware Pipeline
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

// Redirection automatique vers Swagger pour tester facilement
app.MapGet("/", (context) => {
    context.Response.Redirect("/swagger");
    return Task.CompletedTask;
});

app.Run();