using Product.Core.Entities;
using Product.Services.DTOs;

namespace Product.Services.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryEntity>> GetAllCategories();
    Task CreateCategory(CreateCategoryDto dto);
}