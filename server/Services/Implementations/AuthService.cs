using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net; 
using Product.Core.Entities;
using Product.Core.Interfaces;
using Product.Services.DTOs;
using Product.Services.Interfaces;

namespace Product.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration; // To read the Secret Key

    public AuthService(IUnitOfWork unitOfWork, IConfiguration configuration)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        if (await _unitOfWork.Users.UserExistsAsync(dto.Email))
            throw new Exception("User with this email already exists.");

        // 1. Hash the password
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        // 2. Create User Entity
        var user = new UserEntity
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = passwordHash,
            Role = dto.Role 
        };

        // 3. Save to DB
        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.CompleteAsync();

        // 4. Generate Token immediately so they don't have to login again
        return GenerateTokenResponse(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        // 1. Find User
        var user = await _unitOfWork.Users.GetByEmailAsync(dto.Email);
        if (user == null) throw new Exception("Invalid Credentials");

        // 2. Verify Password Hash
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
        if (!isPasswordValid) throw new Exception("Invalid Credentials");

        // 3. Generate Token
        return GenerateTokenResponse(user);
    }

    private AuthResponseDto GenerateTokenResponse(UserEntity user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        // Get secret key from appsettings.json
        var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Secret"]!);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role) // Vital for [Authorize(Roles="Admin")]
            }),
            Expires = DateTime.UtcNow.AddDays(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return new AuthResponseDto(tokenHandler.WriteToken(token), user.Username, user.Role);
    }
}