
namespace RLE.API.Dtos
{
    public class UserToCreateDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string[] Roles { get; set; }
    }
}