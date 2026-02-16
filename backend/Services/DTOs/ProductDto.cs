using System.ComponentModel.DataAnnotations;

namespace Product.Services.DTOs;

public record ProductDto(
    int ProductId,
    string ProductName,
    string? Description,
    decimal Price,
    int Quantity,
    string CategoryName
);

public record CreateProductDto(
    [Required] string ProductName,
    string? Description,
    
    // VALIDATION: Price MUST be at least 0.01
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")] 
    decimal Price,
    
    // VALIDATION: Quantity must be positive or zero
    [Range(0, int.MaxValue, ErrorMessage = "Quantity cannot be negative")] 
    int Quantity,
    
    [Required] int CategoryId
);

public record UpdateProductDto(
    [Required] string ProductName,
    string? Description,
    
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")] 
    decimal Price,
    
    [Range(0, int.MaxValue, ErrorMessage = "Quantity cannot be negative")] 
    int Quantity,
    
    [Required] int CategoryId
);