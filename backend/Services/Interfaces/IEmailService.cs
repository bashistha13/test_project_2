using Microsoft.AspNetCore.Http; // Required for IFormFile

namespace Product.Services.Interfaces;

public interface IEmailService
{
    // Now accepts an optional attachment
    Task SendEmailAsync(string toEmail, string subject, string message, IFormFile? attachment = null);
}