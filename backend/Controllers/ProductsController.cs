using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Product.Infrastructure.Data;
using Product.Services.DTOs;
using Product.Services.Interfaces;
using System.Text;

namespace Product.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly AppDbContext _context;

    public ProductsController(IProductService productService, AppDbContext context)
    {
        _productService = productService;
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Where(p => !p.IsDeleted)
            .Select(p => new ProductDto(
                p.ProductId,
                p.ProductName,
                p.Description,
                p.Price,
                p.Quantity,
                p.Category != null ? p.Category.CategoryName : "Uncategorized"
            ))
            .ToListAsync();
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        if (product == null) return NotFound();
        return Ok(product);
    }

    // --- UPDATED: CLEAN TEMPLATE DOWNLOAD ---
    [HttpGet("template")]
    public IActionResult DownloadTemplate()
    {
        // 1. Headers Only (No example data)
        // 2. This creates columns in Excel so the user can start typing in Row 2 immediately.
        var csvHeader = "ProductName,Price,Quantity,CategoryName,Description";
        
        var bytes = Encoding.UTF8.GetBytes(csvHeader);
        return File(bytes, "text/csv", "product_import_template.csv");
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var createdProduct = await _productService.CreateProductAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = createdProduct.ProductId }, createdProduct);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
    {
        var updatedProduct = await _productService.UpdateProductAsync(id, dto);
        if (updatedProduct == null) return NotFound();
        return Ok(updatedProduct);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _productService.DeleteProductAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }

    // --- BULK IMPORT ---
    [Authorize(Roles = "Admin")]
    [HttpPost("import")]
    public async Task<IActionResult> ImportProducts(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Please upload a valid CSV file.");

        try
        {
            using var stream = file.OpenReadStream();
            int count = await _productService.BulkImportProductsAsync(stream);
            return Ok(new { message = $"Successfully imported {count} products." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}