using Product.Core.Entities;
using Product.Core.Interfaces;
using Product.Services.DTOs;
using Product.Services.Interfaces;

namespace Product.Services.Implementations;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;

    public CategoryService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<CategoryEntity>> GetAllCategories()
    {
        // Use a Generic Repository method for CategoryEntity
        // Note: You might need to cast or add a specific repository property if Generic doesn't fit
        // But for now, we can use the generic one we made earlier via a new property or direct access
        // Ideally, add "public IGenericRepository<CategoryEntity> Categories { get; }" to IUnitOfWork
        return await _unitOfWork.Categories.GetAllAsync();
    }

    public async Task CreateCategory(CreateCategoryDto dto)
    {
        var category = new CategoryEntity
        {
            CategoryName = dto.CategoryName
        };

        await _unitOfWork.Categories.AddAsync(category);
        await _unitOfWork.CompleteAsync();
    }
}