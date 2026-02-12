namespace Product.Core.Interfaces;
using Product.Core.Entities;
using Product.Core.Interfaces;


public interface IUnitOfWork : IDisposable
{
    IGenericRepository<ProductEntity> Products { get; }
    IGenericRepository<CategoryEntity> Categories { get; }
    Task<int> CompleteAsync();
}