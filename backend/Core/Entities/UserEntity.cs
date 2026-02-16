using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Product.Core.Entities;

[Table("Users")]
public class UserEntity
{
    [Key]
    public int UserId { get; set; }

    [Required]
    [MaxLength(50)]
    public required string Username { get; set; }

    [Required]
    [MaxLength(100)]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    public required string PasswordHash { get; set; }

    [Required]
    [MaxLength(20)]
    public required string Role { get; set; } // "Admin" or "User"
}