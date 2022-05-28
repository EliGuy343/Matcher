using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IMapper _mapper;
        public ITokenService _tokenService; 
        
        public AccountController(
            UserManager<AppUser> userManager,  
            SignInManager<AppUser> signInManager,
            ITokenService tokenService,
            IMapper mapper)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(
            RegisterDto registerDto)
        {
            if(await UserExists(registerDto.UserName))
                return BadRequest("Username is already taken"); 

            var user = _mapper.Map<AppUser>(registerDto); 
            user.UserName = registerDto.UserName.ToLower();
            
            var result = await _userManager.CreateAsync(user,
                registerDto.Password);
            if(!result.Succeeded)
                return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "member");
            if(!roleResult.Succeeded)
                return BadRequest(result.Errors);
            
            return new UserDto
            {
                UserName = user.UserName,
                Token = await _tokenService.CreateToken(user),
                DisplayName = user.DisplayName,
                Gender = user.Gender
            };
        }
        
        [HttpPost("login-user")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto) 
        {
            var user = await _userManager.Users
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(user=>
                    user.UserName==loginDto.UserName.ToLower());

            var result = await _signInManager.CheckPasswordSignInAsync(
                user, loginDto.Password, false);

            if(!result.Succeeded) 
                return Unauthorized("Invalid Username");
            
            return new UserDto
            {
                UserName = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                DisplayName = user.DisplayName,
                Gender = user.Gender
            };

            
        }
        private async Task<bool> UserExists(string username) => 
            await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        
        
    }
}