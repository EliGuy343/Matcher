using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;

        public AccountController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AppUser>> Register(RegisterDto registerDto)
        {
            if(await UserExists(registerDto.UserName))
                return BadRequest("Username is already taken"); 
            if(registerDto.Password.Length < 8)
                return BadRequest("Password should be at least 8 characters long");
            if(!registerDto.Password.All(char.IsDigit))
                return BadRequest("Password should have at least one number");
            if(!registerDto.Password.All(char.IsLetter))
                return BadRequest("Password should have at least one letter");
            
            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                UserName = registerDto.UserName.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key

            };

            _context.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }
        private async Task<bool> UserExists(string username) => 
            await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
    }
}