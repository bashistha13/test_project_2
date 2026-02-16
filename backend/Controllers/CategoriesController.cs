using Microsoft.AspNetCore.Mvc;
using Product.Services.Interfaces;
using Product.Services.DTOs;

namespace Product.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _service;

    public CategoriesController(ICategoryService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllCategories());
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCategoryDto dto)
    {
        await _service.CreateCategory(dto);
        return Ok("Category Created");
    }
}