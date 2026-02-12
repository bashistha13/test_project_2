using Product.Core.Entities;
using Product.Core.Interfaces;
using Product.Services.DTOs;
using Product.Services.Interfaces;

namespace Product.Services.Implementations;

public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;

    public ProductService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<ProductEntity>> GetAllProducts()
    {
        return await _unitOfWork.Products.GetAllAsync();
    }

    public async Task<ProductEntity?> GetProductById(int id)
    {
        return await _unitOfWork.Products.GetByIdAsync(id);
    }

    public async Task CreateProduct(ProductDto dto)
    {
        var product = new ProductEntity
        {
            ProductName = dto.ProductName,   // REQUIRED
            Description = dto.Description,
            Price = dto.Price,
            Quantity = dto.Quantity,
            CategoryId = dto.CategoryId
        };

        await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.CompleteAsync();
    }

    public async Task<bool> DeleteProduct(int id)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product == null)
        {
            return false;
        }

        await _unitOfWork.Products.DeleteAsync(id);
        await _unitOfWork.CompleteAsync();
        return true;
    }
}
