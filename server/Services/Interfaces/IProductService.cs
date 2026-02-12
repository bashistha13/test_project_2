using Product.Core.Entities;
using Product.Services.DTOs;

namespace Product.Services.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductEntity>> GetAllProducts();
    Task<ProductEntity?> GetProductById(int id);
    Task CreateProduct(ProductDto dto);
    Task<bool> DeleteProduct(int id);
}