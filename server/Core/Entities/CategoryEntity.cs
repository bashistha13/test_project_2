using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Product.Core.Entities;

[Table("Category")] // Matches the singular table name in DBeaver
public class CategoryEntity
{
    [Key]
    public int CategoryId { get; set; } // Matches DB Column

    [Required]
    [MaxLength(100)]
    public required string CategoryName { get; set; } // Matches DB Column

    // Navigation Property
    public ICollection<ProductEntity> Products { get; set; } = new List<ProductEntity>();
}