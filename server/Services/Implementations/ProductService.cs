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

    public async Task<IEnumerable<ProductEntity>> GetAllProductsAsync()
    {
        return await _unitOfWork.Products.GetAllAsync();
    }

    public async Task<ProductEntity?> GetProductByIdAsync(int id)
    {
        return await _unitOfWork.Products.GetByIdAsync(id);
    }

    // --- CREATE (Admin) ---
    public async Task<ProductEntity> CreateProductAsync(CreateProductDto dto)
    {
        var product = new ProductEntity
        {
            ProductName = dto.ProductName,
            Description = dto.Description,
            Price = dto.Price,
            Quantity = dto.Quantity,
            CategoryId = dto.CategoryId
        };

        await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.CompleteAsync();
        
        return product;
    }

    // --- UPDATE (Admin) ---
    public async Task<ProductEntity?> UpdateProductAsync(int id, UpdateProductDto dto)
    {
        var existingProduct = await _unitOfWork.Products.GetByIdAsync(id);
        
        if (existingProduct == null) return null;

        // Map the new values to the existing entity
        existingProduct.ProductName = dto.ProductName;
        existingProduct.Description = dto.Description;
        existingProduct.Price = dto.Price;
        existingProduct.Quantity = dto.Quantity;
        existingProduct.CategoryId = dto.CategoryId;

        _unitOfWork.Products.Update(existingProduct);
        await _unitOfWork.CompleteAsync();

        return existingProduct;
    }

    // --- DELETE (Admin) ---
    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        
        if (product == null) return false;

        _unitOfWork.Products.Delete(product);
        await _unitOfWork.CompleteAsync();
        
        return true;
    }
}