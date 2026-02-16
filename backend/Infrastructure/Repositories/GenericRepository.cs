using Microsoft.EntityFrameworkCore;
using Product.Core.Interfaces;
using Product.Infrastructure.Data;

namespace Product.Infrastructure.Repositories;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    protected readonly AppDbContext _context;
    internal DbSet<T> _dbSet;

    public GenericRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task<T?> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
    }

    // Matches the interface: Update
    public void Update(T entity)
    {
        _dbSet.Update(entity);
    }

    // Matches the interface: Delete
    public void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }
}