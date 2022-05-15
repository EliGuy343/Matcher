using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using API.Helpers;

namespace API.Data
{
    public class LikesRepository : ILikesRepository 
    {
        private readonly DataContext _context;
        public LikesRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<UserLike> GetUserLike(int SourceUserId, int LikedUserId)
        {
            return await _context.Likes.FindAsync(SourceUserId, LikedUserId);
        }
        public async Task<Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry<UserLike>> DeleteUserLike(int SourceUserId, int LikedUserId)
        {
            var like = await _context.Likes.FindAsync(SourceUserId, LikedUserId);
            return _context.Likes.Remove(like);
        }
        public async Task<PagedList<LikeDto>> GetUsersLikes(LikesParams likesParams)
        {
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
            var likes = _context.Likes.AsQueryable();
            if(likesParams.Predicate == "liked")
            {
                likes = likes.Where(like =>
                    like.SourceUserId == likesParams.UserId);
                users = likes.Select(like => like.LikedUser);
            }
            if(likesParams.Predicate == "likedBy")
            {
                likes = likes.Where(like => 
                    like.LikedUserId == likesParams.UserId);
                users = likes.Select(like => like.SourceUser);
            }
            var likedUsers = users.Select(user => new LikeDto
            {
                UserName = user.UserName,
                DisplayName = user.DisplayName,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
                City = user.City,
                Id = likesParams.UserId
            });
            return await PagedList<LikeDto>.CreateAsync(likedUsers,
                likesParams.PageNumber, likesParams.PageSize);
        }

        public async Task<AppUser> GetUsersWithLikes(int userId)
        {
            return await _context.Users
                .Include(x => x.LikedUsers)
                .FirstOrDefaultAsync(x => x.Id == userId);
        }
    }
}