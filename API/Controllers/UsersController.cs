using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController    
    {
        private readonly IPhotoService _photoService;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public UsersController(IUserRepository userRepository,
            IMapper mapper, IPhotoService photoService) 
        {
            _photoService = photoService;
            _userRepository = userRepository;
            _mapper = mapper;
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> getUsers() =>
            Ok(await _userRepository.GetMembersAsync());
        
        
        [HttpGet("{username}",Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> getUser(string username) =>
            await _userRepository.GetMemberAsync(username);
        
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto) 
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            _mapper.Map(memberUpdateDto, user);
            _userRepository.update(user);
            
            if(await _userRepository.SaveAllAsync())
                return NoContent();
            
            return BadRequest("Failed to update User"); 
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            var result = await _photoService.AddPhotoAsync(file);
            if(result.Error != null)
                return BadRequest(result.Error.Message);
            
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };
            if(user.Photos.Count == 0)
                photo.IsMain = true;

            user.Photos.Add(photo);
            if(await _userRepository.SaveAllAsync())
            {
                return CreatedAtRoute("GetUser", 
                    new {username = user.UserName},_mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Problem adding photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId) {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(x=> x.Id == photoId);
            if(photo.IsMain)
                return BadRequest("this is already your main photo");
            
            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            if (currentMain != null)
                currentMain.IsMain = false;

            photo.IsMain = true;

            if(await _userRepository.SaveAllAsync())
                return NoContent();
            
            return BadRequest("Failed to set main photo");
            

        }
    }
}