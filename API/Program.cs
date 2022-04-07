using System.Text;
using System.Text.Json;
using API.Data;
using API.Errors;
using API.Extensions;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
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
var app = builder.Build();


 

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
app.UseHsts();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors(policy => policy.AllowAnyHeader()
    .AllowAnyMethod().WithOrigins("http://localhost:4200"));

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
