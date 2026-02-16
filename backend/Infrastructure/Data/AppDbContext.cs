using Microsoft.EntityFrameworkCore;
using Product.Core.Entities;

namespace Product.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) 
        : base(options)
    {
    }

    // ==========================
    // DB TABLES
    // ==========================
    public DbSet<ProductEntity> Products { get; set; }
    public DbSet<CategoryEntity> Categories { get; set; }
    public DbSet<UserEntity> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ==========================
        // CATEGORY CONFIGURATION
        // ==========================
        modelBuilder.Entity<CategoryEntity>(entity =>
        {
            entity.ToTable("category"); // Map to lowercase SQL table

            entity.HasKey(e => e.CategoryId);

            entity.Property(e => e.CategoryName)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.HasIndex(e => e.CategoryName)
                  .IsUnique();
        });

        // ==========================
        // PRODUCT CONFIGURATION
        // ==========================
        modelBuilder.Entity<ProductEntity>(entity =>
        {
            entity.ToTable("products");

            entity.HasKey(e => e.ProductId);

            entity.Property(e => e.ProductName)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(e => e.Description)
                  .HasMaxLength(500);

            entity.Property(e => e.Quantity)
                  .IsRequired();

            entity.Property(e => e.Price)
                  .HasColumnType("decimal(18,2)")
                  .IsRequired();

            // 🔥 GLOBAL SOFT DELETE FILTER
            entity.HasQueryFilter(p => !p.IsDeleted);

            // Relationship: Product -> Category
            entity.HasOne(p => p.Category)
                  .WithMany(c => c.Products)
                  .HasForeignKey(p => p.CategoryId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ==========================
        // USER CONFIGURATION
        // ==========================
        modelBuilder.Entity<UserEntity>(entity =>
        {
            entity.ToTable("users");

            entity.HasKey(u => u.UserId);

            entity.Property(u => u.Username)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(u => u.Email)
                  .IsRequired()
                  .HasMaxLength(150);

            entity.HasIndex(u => u.Email)
                  .IsUnique();

            entity.HasIndex(u => u.Username)
                  .IsUnique();
        });
    }
}
