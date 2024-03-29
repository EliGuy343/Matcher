using System.Text;
using System.Text.Json;
using API.Data;
using API.Entities;
using API.Errors;
using API.Extensions;
using API.Interfaces;
using API.Services;
using API.signalR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using static System.Net.Mime.MediaTypeNames;



var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddCors();
builder.Services.AddIdentityServices(builder.Configuration);
// Learn more about configuring Swagger/OpenAPI
// at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddSignalR();
var app = builder.Build();

//Helper Method for Seeding users
async void SeedUsers()
{
    using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            var context = services.GetRequiredService<DataContext>();
            var roleManager = services
                .GetRequiredService<RoleManager<AppRole>>();
            var userManager = services
                .GetRequiredService<UserManager<AppUser>>();
            await context.Database.MigrateAsync();
            await Seed.SeedUsers(userManager, roleManager);
        } 
} 

app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;

        // using static System.Net.Mime.MediaTypeNames;
        context.Response.ContentType = "application/json";
            var exceptionHandlerPF =
            context.Features.Get<IExceptionHandlerPathFeature>();
        ApiException response;
        if(app.Environment.IsDevelopment())
        {
            response = new ApiException(context.Response.StatusCode,
                exceptionHandlerPF.Error.Message, exceptionHandlerPF.Error.StackTrace);
        }
        else
        {
            response = new ApiException(context.Response.StatusCode,
                exceptionHandlerPF.Error.Message);
        }

        var options = new JsonSerializerOptions{
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
        var json = JsonSerializer.Serialize(response, options);
        await context.Response.WriteAsync(json);
    });
});

SeedUsers();
app.UseHsts();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors(policy => 
    policy
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .WithOrigins("http://localhost:4200"));

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<PressenceHub>("");
app.Run();
