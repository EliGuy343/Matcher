using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class LikesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly ILikesRepository _likesRepositroy;
        public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
        {
            _userRepository = userRepository;
            _likesRepositroy = likesRepository;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username) 
        {
            var sourceUserId = User.GetUserId();
            var likedUser = await _userRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _likesRepositroy.GetUsersWithLikes(sourceUserId);

            if(likedUser == null)
                return NotFound();
            
            if(sourceUser.UserName == username)
                return BadRequest("You cannot like yourself");
            
            var userLike = await _likesRepositroy.GetUserLike(sourceUserId,
                likedUser.Id);

            if(userLike != null)
            {
                await _likesRepositroy.DeleteUserLike(sourceUserId, likedUser.Id);
            }
            else
            {
                userLike = new UserLike
                {
                    SourceUserId = sourceUserId,
                    LikedUserId = likedUser.Id
                };
                sourceUser.LikedUsers.Add(userLike);
            }
            if(await _userRepository.SaveAllAsync())
                return Ok();
            
            return BadRequest("Something went wrong..."); 
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetUsersLikes([FromQuery]LikesParams likesParams)
        {
            likesParams.UserId = User.GetUserId();
            var users = await _likesRepositroy.GetUsersLikes(likesParams);
            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, 
                users.TotalCount, users.TotalCount);
            return Ok(users);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult> getLikedUser(string username) {
            var sourceUserId = User.GetUserId();
            var likedUser = await _userRepository.GetUserByUsernameAsync(username);
            var userLike = await _likesRepositroy.GetUserLike(sourceUserId, likedUser.Id);
            if(userLike == null)
                return Ok(false);
            return Ok(true);
        }
    }
}