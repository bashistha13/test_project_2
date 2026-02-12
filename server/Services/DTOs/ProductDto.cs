using System.ComponentModel.DataAnnotations;

namespace Product.Services.DTOs;

// Used for READING data (GET)
public record ProductDto(
    int ProductId,
    string ProductName,
    string? Description,
    decimal Price,
    int Quantity,
    string CategoryName
);

// Used for CREATING data (POST)
public record CreateProductDto(
    [Required] string ProductName,
    string? Description,
    [Range(0.01, double.MaxValue)] decimal Price,
    [Range(0, int.MaxValue)] int Quantity,
    [Required] int CategoryId
);

// Used for UPDATING data (PUT)
public record UpdateProductDto(
    [Required] string ProductName,
    string? Description,
    [Range(0.01, double.MaxValue)] decimal Price,
    [Range(0, int.MaxValue)] int Quantity,
    [Required] int CategoryId
);

