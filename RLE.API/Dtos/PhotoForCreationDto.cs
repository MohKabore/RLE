using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace RLE.API.Dtos
{
    public class PhotoForCreationDto
    {
        public PhotoForCreationDto()
        {
            DateAdded = DateTime.Now;
        }
        
        public string Url { get; set; }
      //  public IFormFile? File { get; set; }
        public List<IFormFile> Photos { get; set; }

        public string Description { get; set; }
        public DateTime? DateAdded { get; set; }
        public string PublicId { get; set; }
    }
}