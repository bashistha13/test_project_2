using Product.Core.Entities;
using Product.Services.DTOs;

namespace Product.Services.Interfaces;

public interface IProductService
{
    // Existing Read Methods
    Task<IEnumerable<ProductEntity>> GetAllProductsAsync();
    Task<ProductEntity?> GetProductByIdAsync(int id);

    // --- NEW ADMIN METHODS ---
    Task<ProductEntity> CreateProductAsync(CreateProductDto dto);
    Task<ProductEntity?> UpdateProductAsync(int id, UpdateProductDto dto);
    Task<bool> DeleteProductAsync(int id);
}