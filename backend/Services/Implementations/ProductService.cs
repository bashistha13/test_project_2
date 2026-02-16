using Microsoft.EntityFrameworkCore;
using Product.Core.Entities;
using Product.Core.Interfaces;
using Product.Infrastructure.Data;
using Product.Services.DTOs;
using Product.Services.Interfaces;

namespace Product.Services.Implementations;

public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly AppDbContext _context;

    public ProductService(IUnitOfWork unitOfWork, AppDbContext context)
    {
        _unitOfWork = unitOfWork;
        _context = context;
    }

    public async Task<IEnumerable<ProductEntity>> GetAllProductsAsync() => await _unitOfWork.Products.GetAllAsync();
    public async Task<ProductEntity?> GetProductByIdAsync(int id) => await _unitOfWork.Products.GetByIdAsync(id);

    public async Task<ProductEntity> CreateProductAsync(CreateProductDto dto)
    {
        if (dto.Price <= 0) throw new ArgumentException("Price must be greater than zero.");
        
        var product = new ProductEntity
        {
            ProductName = dto.ProductName,
            Description = dto.Description,
            Price = dto.Price,
            Quantity = dto.Quantity,
            CategoryId = dto.CategoryId,
            IsDeleted = false
        };

        await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.CompleteAsync();
        return product;
    }

    public async Task<ProductEntity?> UpdateProductAsync(int id, UpdateProductDto dto)
    {
        var existing = await _unitOfWork.Products.GetByIdAsync(id);
        if (existing == null) return null;

        existing.ProductName = dto.ProductName;
        existing.Description = dto.Description;
        existing.Price = dto.Price;
        existing.Quantity = dto.Quantity;
        existing.CategoryId = dto.CategoryId;

        _unitOfWork.Products.Update(existing);
        await _unitOfWork.CompleteAsync();
        return existing;
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product == null) return false;
        
        // Soft delete using raw SQL
        await _context.Database.ExecuteSqlRawAsync("UPDATE Products SET IsDeleted = 1 WHERE ProductId = {0}", id);
        return true;
    }

    // --- BULK IMPORT LOGIC ---
    public async Task<int> BulkImportProductsAsync(Stream fileStream)
    {
        using var reader = new StreamReader(fileStream);
        var productsToAdd = new List<ProductEntity>();
        
        // FIX 1: Use plural 'Categories'
        var categories = await _context.Categories.ToListAsync();
        
        int count = 0;
        bool isHeader = true;

        while (!reader.EndOfStream)
        {
            var line = await reader.ReadLineAsync();
            if (string.IsNullOrWhiteSpace(line)) continue;

            // Skip Header Row
            if (isHeader)
            {
                isHeader = false;
                continue; 
            }

            // Simple CSV Split
            var values = line.Split(',');
            if (values.Length < 4) continue; // Skip invalid rows

            string name = values[0].Trim();
            if (!decimal.TryParse(values[1], out decimal price)) price = 0;
            if (!int.TryParse(values[2], out int quantity)) quantity = 0;
            string categoryName = values[3].Trim();
            string description = values.Length > 4 ? values[4].Trim() : "";

            // Find Category ID
            var category = categories.FirstOrDefault(c => c.CategoryName.Equals(categoryName, StringComparison.OrdinalIgnoreCase));
            
            int categoryId;
            if (category != null)
            {
                categoryId = category.CategoryId;
            }
            else
            {
                // Create new category on the fly if it doesn't exist
                var newCat = new CategoryEntity { CategoryName = categoryName };
                
                // FIX 2: Use plural 'Categories'
                _context.Categories.Add(newCat);
                await _context.SaveChangesAsync(); 
                
                categories.Add(newCat); // Add to local cache
                categoryId = newCat.CategoryId;
            }

            // Create Product
            var product = new ProductEntity
            {
                ProductName = name,
                Price = price,
                Quantity = quantity,
                CategoryId = categoryId,
                Description = description,
                IsDeleted = false
            };

            productsToAdd.Add(product);
            count++;
        }

        // Bulk Save
        if (productsToAdd.Any())
        {
            await _context.Products.AddRangeAsync(productsToAdd);
            await _unitOfWork.CompleteAsync();
        }

        return count;
    }
}