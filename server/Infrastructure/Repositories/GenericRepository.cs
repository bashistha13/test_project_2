using Microsoft.EntityFrameworkCore;
using Product.Core.Interfaces;
using Product.Infrastructure.Data;

namespace Product.Infrastructure.Repositories;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public GenericRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }

    public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();
    
    public async Task<T?> GetByIdAsync(int id) => await _dbSet.FindAsync(id);
    
    public async Task AddAsync(T entity) => await _dbSet.AddAsync(entity);
    
    public Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _dbSet.FindAsync(id);
        if (entity != null)
        {
            _dbSet.Remove(entity);
        }
    }
}