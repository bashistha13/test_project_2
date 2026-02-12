using Product.Core.Entities;

namespace Product.Core.Interfaces;

public interface IUserRepository : IGenericRepository<UserEntity>
{
    Task<UserEntity?> GetByEmailAsync(string email);
    Task<bool> UserExistsAsync(string email);
}