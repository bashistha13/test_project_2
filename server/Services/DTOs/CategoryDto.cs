namespace Product.Services.DTOs;

public record CategoryDto(int CategoryId, string CategoryName);
public record CreateCategoryDto(string CategoryName);