using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RLE.API.Data;
using RLE.API.Dtos;
using RLE.API.Models;

namespace RLE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RetrofitController : ControllerBase
    {
        private readonly IEducNotesRepository _repo;
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public RetrofitController(IEducNotesRepository repo, DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
            _repo = repo;
        }

        [HttpPost("AddStore")]
        public async Task<IActionResult> AddStore(NewStoreDto model)
        {
            var store = _mapper.Map<RetrofitStore>(model);
            _repo.Add(model);
            if (await _repo.SaveAll())
                return Ok(model);

            return BadRequest();
        }


    }
}