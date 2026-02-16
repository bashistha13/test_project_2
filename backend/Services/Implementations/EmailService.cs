using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Product.Services.Interfaces;

namespace Product.Services.Implementations;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string message, IFormFile? attachment = null)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress(_config["EmailSettings:DisplayName"], _config["EmailSettings:FromEmail"]));
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = subject;

        // 1. Create a BodyBuilder (Handles Text + Attachments)
        var builder = new BodyBuilder();
        
        // Set the HTML body
        builder.HtmlBody = message;

        // 2. Check and Add Attachment
        if (attachment != null && attachment.Length > 0)
        {
            using (var stream = attachment.OpenReadStream())
            {
                // We must copy to a MemoryStream because MimeKit needs a seekable stream
                using (var memoryStream = new MemoryStream())
                {
                    await stream.CopyToAsync(memoryStream);
                    var fileBytes = memoryStream.ToArray();

                    // Add to email
                    builder.Attachments.Add(attachment.FileName, fileBytes, ContentType.Parse(attachment.ContentType));
                }
            }
        }

        email.Body = builder.ToMessageBody();

        // 3. Send Email
        using var smtp = new SmtpClient();
        try
        {
            await smtp.ConnectAsync(_config["EmailSettings:Host"], int.Parse(_config["EmailSettings:Port"]), SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_config["EmailSettings:FromEmail"], _config["EmailSettings:Password"]);
            await smtp.SendAsync(email);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending email: {ex.Message}");
            throw;
        }
        finally
        {
            await smtp.DisconnectAsync(true);
        }
    }
}