using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Product.Core.Entities;

[Table("Products")] // Matches the plural table name in DBeaver
public class ProductEntity
{
    [Key]
    public int ProductId { get; set; } // Matches DB Column

    [Required]
    [MaxLength(100)]
    public required string ProductName { get; set; } // Renamed from Name

    [MaxLength(500)]
    public string? Description { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    public int Quantity { get; set; } // Renamed from StockQuantity

    // Foreign Key
    public int CategoryId { get; set; }

    // Navigation Property
    [ForeignKey("CategoryId")]
    public CategoryEntity? Category { get; set; }
}