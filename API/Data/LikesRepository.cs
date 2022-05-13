using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;

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
        public async Task<IEnumerable<LikeDto>> GetUsersLikes(string predicate, int userId)
        {
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
            var likes = _context.Likes.AsQueryable();
            if(predicate == "liked")
            {
                likes = likes.Where(like => like.SourceUserId == userId);
                users = likes.Select(like => like.LikedUser);
            }
            if(predicate == "likedBy")
            {
                likes = likes.Where(like => like.LikedUserId == userId);
                users = likes.Select(like => like.SourceUser);
            }
            return await users.Select(user => new LikeDto
            {
                UserName = user.UserName,
                DisplayName = user.DisplayName,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
                City = user.City,
                Id = userId
            }).ToListAsync();
        }

        public async Task<AppUser> GetUsersWithLikes(int userId)
        {
            return await _context.Users
                .Include(x => x.LikedUsers)
                .FirstOrDefaultAsync(x => x.Id == userId);
        }
    }
}