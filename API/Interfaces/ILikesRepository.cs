using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<UserLike> GetUserLike(int SourceUserId, int LikedUserId);
        Task<AppUser> GetUsersWithLikes(int userId);
        Task<Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry<UserLike>> DeleteUserLike(int SourceUserId, int LikedUserId);
        Task<IEnumerable<LikeDto>> GetUsersLikes(string predicate, int userId); 
    
    }
}