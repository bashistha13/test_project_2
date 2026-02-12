namespace Product.Services.DTOs;

public record ProductDto(
    string ProductName,   // Changed from Name
    string? Description,
    decimal Price,
    int Quantity,         // Changed from StockQuantity
    int CategoryId
);
