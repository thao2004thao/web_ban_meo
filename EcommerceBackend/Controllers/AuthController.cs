using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;


[ApiController]
[Route("api/auth")]
public class AuthController : Controller{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config){
        _config = config;
        _context = context;
    }

    //[HttpGet("hash-password")]
    //public IActionResult HashPassword([FromQuery] string plainText)
    //{
    //    string hashed = BCrypt.Net.BCrypt.HashPassword(plainText);
    //    return Ok(new { HashedPassword = hashed });
    //}

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // Kiểm tra Username đã tồn tại
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username);
        if (existingUser != null)
        {
            return BadRequest(new { message = "Username already exists." });
        }

        // Mã hóa mật khẩu
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Tạo user mới
        var user = new User
        {
            Username = request.Username,
            Password = hashedPassword,
            FullName = request.FullName,
            Role = request.Role,
            Phone = request.Phone,
            IsActive = true,
            CreatAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User registered successfully." });
    }


    //API đăng nhập
    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] LoginRequest request){
        var user = await _context.Users
            .FirstOrDefaultAsync(
                u => u.Username == request.Username);
        String hashPassword = BCrypt.Net.BCrypt
                .HashPassword(request.Password);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            return Unauthorized();
        
        //Tạo token cho phiên đăng nhập
        var token = GenerateJwtToken(user);

        //Trả về thông tin người dùng và token
        return Ok(new {Token = token, User = user});

    }

    //Phương thức tạo token
    private String GenerateJwtToken(User user){
        var jwtKey = _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT key chưa được cấu hình");
        var securityKey = new 
            SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(
            securityKey, SecurityAlgorithms.HmacSha256);
        
        var claims = new[]{
            new Claim(JwtRegisteredClaimNames.Sub, 
                user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role)
        };
        Console.WriteLine("----- Claims: " + String.Join(", ", claims.Select(c => c.Type + ": " + c.Value)));
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(
                    Convert.ToDouble(_config["Jwt:ExpiryInMinutes"])),
            signingCredentials: credentials
        );

        // Console.WriteLine("Issuer: " + _config["Jwt:Issuer"]);
        // Console.WriteLine("Audience: " + _config["Jwt:Audience"]);
        // Console.WriteLine("ExpiryInMinutes: " + _config["Jwt:ExpiryInMinutes"]);

        return new JwtSecurityTokenHandler()
                    .WriteToken(token);

    }
}

public class LoginRequest{
    public String Username { get; set; }
    public String Password { get; set; }
}

public class RegisterRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
    public string FullName { get; set; }
    public string Role { get; set; }
    public string Phone { get; set; }
}
