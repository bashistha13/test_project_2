using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Product.Core.Entities;

public class ProductEntity
{
    [Key]
    public int ProductId { get; set; }

    [Required]
    [MaxLength(100)]
    public string ProductName { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }

    // --- FIX: REMOVED THE [Column] MAPPING ---
    // If your database column is named 'Quantity', this is all you need.
    public int Quantity { get; set; }

    public int CategoryId { get; set; }
    public CategoryEntity? Category { get; set; }

    public bool IsDeleted { get; set; } = false; 
}