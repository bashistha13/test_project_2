using Microsoft.EntityFrameworkCore;
using Product.Infrastructure.Data;
using Product.Core.Interfaces;
using Product.Infrastructure.Repositories;
using Product.Services.Interfaces;
using Product.Services.Implementations;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. Database Connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. Dependency Injection (The "Glue")
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();




builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();






var app = builder.Build();

// 4. Configure Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();