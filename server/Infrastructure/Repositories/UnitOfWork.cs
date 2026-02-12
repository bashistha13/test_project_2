using Product.Core.Interfaces;
using Product.Core.Entities;
using Product.Infrastructure.Data;

namespace Product.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public IGenericRepository<ProductEntity> Products { get; private set; }
    public IGenericRepository<CategoryEntity> Categories { get; private set; }
    public IUserRepository Users { get; private set; } // <--- NEW

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Products = new GenericRepository<ProductEntity>(_context);
        Categories = new GenericRepository<CategoryEntity>(_context);
        Users = new UserRepository(_context); // <--- NEW
    }

    public async Task<int> CompleteAsync() => await _context.SaveChangesAsync();
    public void Dispose() => _context.Dispose();
}