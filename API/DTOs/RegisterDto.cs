using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string UserName {get; set;}
        [Required]
        [MinLength(8,
            ErrorMessage = "Password should be at least 8 characters long")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$",
            ErrorMessage ="Password must contain a lower case letter,"
                +"an upper case letter and a number")]
        public string Password {get; set;}
    }
}