using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Product.Services.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Product.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly IEmailService _emailService;

    public EmailController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    // DTO class
    public class EmailRequest
    {
        [Required, EmailAddress]
        public string ToEmail { get; set; } = string.Empty;
        
        [Required]
        public string Subject { get; set; } = string.Empty;
        
        [Required]
        public string Message { get; set; } = string.Empty;

        // Optional File Attachment
        public IFormFile? Attachment { get; set; } 
    }

    // POST: api/email/send
    [Authorize(Roles = "Admin")]
    [HttpPost("send")]
    public async Task<IActionResult> SendEmail([FromForm] EmailRequest request) // Use [FromForm] for files
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            await _emailService.SendEmailAsync(
                request.ToEmail, 
                request.Subject, 
                request.Message, 
                request.Attachment
            );

            return Ok(new { message = "Email sent successfully!" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to send email.", error = ex.Message });
        }
    }
}