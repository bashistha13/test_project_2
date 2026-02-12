using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Product.Core.Entities; // Needed for return types
using Product.Services.DTOs;
using Product.Services.Interfaces;

namespace Product.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    // GET: api/products (Public)
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _productService.GetAllProductsAsync();
        return Ok(products);
    }

    // GET: api/products/5 (Public)
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        if (product == null) return NotFound();
        return Ok(product);
    }

    // --- ADMIN ONLY ENDPOINTS ---

    // POST: api/products
    [Authorize(Roles = "Admin")] 
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var createdProduct = await _productService.CreateProductAsync(dto);
        
        // Returns 201 Created
        return CreatedAtAction(nameof(GetById), new { id = createdProduct.ProductId }, createdProduct);
    }

    // PUT: api/products/5
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var updatedProduct = await _productService.UpdateProductAsync(id, dto);
        
        if (updatedProduct == null) return NotFound(new { message = $"Product with ID {id} not found." });

        return Ok(updatedProduct);
    }

    // DELETE: api/products/5
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _productService.DeleteProductAsync(id);
        
        if (!success) return NotFound(new { message = $"Product with ID {id} not found." });

        return NoContent(); // 204 No Content (Standard for Delete)
    }
}