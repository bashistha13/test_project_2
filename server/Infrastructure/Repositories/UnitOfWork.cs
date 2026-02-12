using Product.Core.Interfaces;
using Product.Core.Entities;
using Product.Infrastructure.Data;

namespace Product.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    public IGenericRepository<ProductEntity> Products { get; private set; }
    public IGenericRepository<CategoryEntity> Categories { get; private set; } 

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Products = new GenericRepository<ProductEntity>(_context);
        Categories = new GenericRepository<CategoryEntity>(_context); // <--- ADD THIS
    }
    public async Task<int> CompleteAsync() => await _context.SaveChangesAsync();
    
    public void Dispose() => _context.Dispose();
}