using Product.Core.Entities;
using Product.Services.DTOs;

namespace Product.Services.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductEntity>> GetAllProductsAsync();
    Task<ProductEntity?> GetProductByIdAsync(int id);
    Task<ProductEntity> CreateProductAsync(CreateProductDto dto);
    Task<ProductEntity?> UpdateProductAsync(int id, UpdateProductDto dto);
    Task<bool> DeleteProductAsync(int id);
    
    // --- NEW IMPORT METHOD ---
    // Returns the number of products successfully imported
    Task<int> BulkImportProductsAsync(Stream fileStream);
}