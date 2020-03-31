using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            _repo.Add(store);
            if (await _repo.SaveAll())
                return Ok(store);

            return BadRequest();
        }


        [HttpPost("StockEntry/{insertUserId}")]
        public async Task<IActionResult> StockEntry(int insertUserId, RetrofitStockEntryDto stockentryDto)
        {
            int inventOptypeid = (int)InventOpType.TypeEnum.StockEntry;

            var stkmvt = new RetrofitStockMvt
            {
                InventOpTypeId = inventOptypeid,
                MvtDate = stockentryDto.MvtDate,
                ToStoreId = stockentryDto.ToStoreId,
                UserId = insertUserId
            };
            _repo.Add(stkmvt);

            foreach (var product in stockentryDto.Products)
            {
                if (product.Qty != null)
                {
                    // Ajout invent Op
                    var retroInventOp = new RetrofitInventOp
                    {
                        ToStoreId = stockentryDto.ToStoreId,
                        OpDate = stockentryDto.MvtDate,
                        Qty = Convert.ToInt32(product.Qty),
                        ProductId = product.Id,
                        InventOpTypeId = inventOptypeid
                    };
                    _repo.Add(retroInventOp);

                    // Ajout invent Op - StockMvt
                    var stkmvtInventOp = new RetrofitStockMvtInventOp
                    {
                        RetrofitStockMvtId = stkmvt.Id,
                        RetrofitInventOpId = retroInventOp.Id
                    };
                    _repo.Add(stkmvtInventOp);

                    // Mise a jour de la quantité du store
                    var store = await _context.RetrofitStoreProducts.FirstOrDefaultAsync
                                                                    (a => a.ProductId == product.Id && a.RetrofitStoreId == stockentryDto.ToStoreId);
                    if (store != null)
                    {
                        store.Qty += Convert.ToInt32(product.Qty);
                        _repo.Update(store);
                    }
                    else
                    {
                        var newStore = new RetrofitStoreProduct
                        {
                            RetrofitStoreId = stockentryDto.ToStoreId,
                            ProductId = product.Id,
                            Qty = Convert.ToInt32(product.Qty)
                        };
                        _repo.Add(newStore);
                    }
                }
            }

            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }


        [HttpPost("StockTransfert/{insertUserId}")]
        public async Task<IActionResult> StockTransfert(int insertUserId, RetrofitStockEntryDto stocktransfertDto)
        {
            int inventOptypeid = (int)InventOpType.TypeEnum.StockTransfer;

            var stkmvt = new RetrofitStockMvt
            {
                InventOpTypeId = inventOptypeid,
                MvtDate = stocktransfertDto.MvtDate,
                ToStoreId = stocktransfertDto.ToStoreId,
                UserId = insertUserId
            };
            _repo.Add(stkmvt);

            foreach (var product in stocktransfertDto.Products)
            {
                if (product.NewQty != null)
                {
                    // Ajout invent Op
                    var retroInventOp = new RetrofitInventOp
                    {
                        ToStoreId = stocktransfertDto.ToStoreId,
                        FromStoreId = Convert.ToInt32(stocktransfertDto.FromStoreId),
                        OpDate = stocktransfertDto.MvtDate,
                        Qty = Convert.ToInt32(product.NewQty),
                        ProductId = product.Id,
                        InventOpTypeId = inventOptypeid
                    };
                    _repo.Add(retroInventOp);

                    // Ajout invent Op - StockMvt
                    var stkmvtInventOp = new RetrofitStockMvtInventOp
                    {
                        RetrofitStockMvtId = stkmvt.Id,
                        RetrofitInventOpId = retroInventOp.Id
                    };
                    _repo.Add(stkmvtInventOp);

                    var fromStore = await _context.RetrofitStoreProducts.FirstOrDefaultAsync(s => s.RetrofitStoreId == Convert.ToInt32(stocktransfertDto.FromStoreId) && s.ProductId == product.Id);
                    fromStore.Qty -= Convert.ToInt32(product.NewQty);
                    // Mise a jour de la quantité du store de destination
                    var store = await _context.RetrofitStoreProducts.FirstOrDefaultAsync
                                                                    (a => a.ProductId == product.Id && a.RetrofitStoreId == stocktransfertDto.ToStoreId);
                    if (store != null)
                    {
                        store.Qty += Convert.ToInt32(product.NewQty);
                        _repo.Update(store);
                    }
                    else
                    {
                        var newStore = new RetrofitStoreProduct
                        {
                            RetrofitStoreId = stocktransfertDto.ToStoreId,
                            ProductId = product.Id,
                            Qty = Convert.ToInt32(product.NewQty)
                        };
                        _repo.Add(newStore);
                    }
                }
            }

            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }


        [HttpPost("SingleStoreHistories")]
        public async Task<IActionResult> SingleStoreHistories(RetrofitHistoryDto searchModel)
        {
            var inventsOps = new List<RetrofitInventOp>();
            if (searchModel.StartDate != null && searchModel.EndDate != null)
                inventsOps = await _context.RetrofitInventOps.Include(s => s.Product)
                                                                    .Include(s => s.FromStore)
                                                                    .Include(s => s.ToStore)
                                                                    .Include(s => s.InventOpType)
                                                                    .Where(s => (s.FromStoreId == Convert.ToInt32(searchModel.StoreId) || s.ToStoreId == Convert.ToInt32(searchModel.StoreId))
                                                                    && s.OpDate >= searchModel.StartDate && s.OpDate <= searchModel.EndDate)
                                                                    .OrderBy(s => s.OpDate)
                                                                    .ToListAsync();

            if (searchModel.StartDate == null && searchModel.EndDate != null)
                inventsOps = await _context.RetrofitInventOps.Include(s => s.Product)
                                                                    .Include(s => s.FromStore)
                                                                    .Include(s => s.ToStore)
                                                                    .Include(s => s.InventOpType)
                                                                    .Where(s => (s.FromStoreId == Convert.ToInt32(searchModel.StoreId) || s.ToStoreId == Convert.ToInt32(searchModel.StoreId))
                                                                    && s.OpDate <= searchModel.EndDate)
                                                                    .OrderBy(s => s.OpDate)
                                                                    .ToListAsync();
            if (searchModel.StartDate != null && searchModel.EndDate == null)
                inventsOps = await _context.RetrofitInventOps.Include(s => s.Product)
                                                                    .Include(s => s.FromStore)
                                                                    .Include(s => s.ToStore)
                                                                    .Include(s => s.InventOpType)
                                                                    .Where(s => (s.FromStoreId == Convert.ToInt32(searchModel.StoreId) || s.ToStoreId == Convert.ToInt32(searchModel.StoreId))
                                                                    && s.OpDate >= searchModel.StartDate)
                                                                    .OrderBy(s => s.OpDate)
                                                                    .ToListAsync();
            if (searchModel.StartDate == null && searchModel.EndDate == null)
                inventsOps = await _context.RetrofitInventOps.Include(s => s.Product)
                                                                    .Include(s => s.FromStore)
                                                                    .Include(s => s.ToStore)
                                                                    .Include(s => s.InventOpType)
                                                                    .Where(s => (s.FromStoreId == Convert.ToInt32(searchModel.StoreId) || s.ToStoreId == Convert.ToInt32(searchModel.StoreId))
                                                                    )
                                                                    .OrderBy(s => s.OpDate)
                                                                    .ToListAsync();
            var inventOpsToReturn = _mapper.Map<IEnumerable<RetrofitInventOpDto>>(inventsOps);

            return Ok(inventOpsToReturn);
        }


        [HttpPost("MultiStoreHistories")]
        public async Task<IActionResult> MultiStoreHistories(RetrofitHistoryDto searchModel)
        {
            var inventsOps = new List<RetrofitInventOp>();
            if (searchModel.StartDate != null && searchModel.EndDate != null)
                inventsOps = await _context.RetrofitInventOps.Include(s => s.Product)
                                                                    .Include(s => s.FromStore)
                                                                    .Include(s => s.ToStore)
                                                                    .Include(s => s.InventOpType)
                                                                    .Where(s => (searchModel.StoreIds.Contains(s.FromStoreId) && searchModel.StoreIds.Contains(s.ToStoreId))
                                                                    && s.OpDate >= searchModel.StartDate && s.OpDate <= searchModel.EndDate)
                                                                    .OrderBy(s => s.OpDate)
                                                                    .ToListAsync();

            if (searchModel.StartDate == null && searchModel.EndDate != null)
                inventsOps = await _context.RetrofitInventOps.Include(s => s.Product)
                                                                    .Include(s => s.FromStore)
                                                                    .Include(s => s.ToStore)
                                                                    .Include(s => s.InventOpType)
                                                                    .Where(s => (searchModel.StoreIds.Contains(s.FromStoreId) && searchModel.StoreIds.Contains(s.ToStoreId))
                                                                    && s.OpDate <= searchModel.EndDate)
                                                                    .OrderBy(s => s.OpDate)
                                                                    .ToListAsync();
            if (searchModel.StartDate != null && searchModel.EndDate == null)
                inventsOps = await _context.RetrofitInventOps.Include(s => s.Product)
                                                                    .Include(s => s.FromStore)
                                                                    .Include(s => s.ToStore)
                                                                    .Include(s => s.InventOpType)
                                                                    .Where(s => (searchModel.StoreIds.Contains(s.FromStoreId) && searchModel.StoreIds.Contains(s.ToStoreId))
                                                                    && s.OpDate >= searchModel.StartDate)
                                                                    .OrderBy(s => s.OpDate)
                                                                    .ToListAsync();
            if (searchModel.StartDate == null && searchModel.EndDate == null)
                inventsOps = await _context.RetrofitInventOps.Include(s => s.Product)
                                                                    .Include(s => s.FromStore)
                                                                    .Include(s => s.ToStore)
                                                                    .Include(s => s.InventOpType)
                                                                    .Where(s => (searchModel.StoreIds.Contains(s.FromStoreId) && searchModel.StoreIds.Contains(s.ToStoreId))
                                                                    )
                                                                    .OrderBy(s => s.OpDate)
                                                                    .ToListAsync();

            var inventOpsToReturn = _mapper.Map<IEnumerable<RetrofitInventOpDto>>(inventsOps);

            return Ok(inventOpsToReturn);
        }

        [HttpPost("AddProduct/{productName}")]
        public async Task<IActionResult> AddProduct(string productName)
        {
            var product = new Product
            {
                Name = productName
            };
            _repo.Add(product);
            if (await _repo.SaveAll())
                return Ok(product);

            return BadRequest();
        }


        [HttpPost("UpdateProduct/{productId}/{productName}")]
        public async Task<IActionResult> UpdateProduct(int productId, string productName)
        {
            var product = await _context.Products.FirstOrDefaultAsync(a => a.Id == productId);
            if (product != null)
            {
                product.Name = productName;
                _repo.Update(product);
                if (await _repo.SaveAll())
                    return Ok(product);

                return BadRequest();
            }

            return NotFound();

        }






        [HttpPut("UpdateStore/{storeId}")]
        public async Task<IActionResult> UpdateStore(int storeId, NewStoreDto model)
        {
            var store = await _context.RetrofitStores.FirstOrDefaultAsync(a => a.Id == storeId);
            _mapper.Map(model, store);
            _repo.Update(store);
            if (await _repo.SaveAll())
                return Ok(store);

            return BadRequest();
        }

        [HttpGet("StoresList")]

        public async Task<IActionResult> StoresList()
        {
            var stores = await _context.RetrofitStores.OrderBy(a => a.Name).ToListAsync();
            var storesProducts = await _context.RetrofitStoreProducts.Include(a => a.Product).ToListAsync();
            var storesToreturn = new List<RetrofitStoreListDto>();
            foreach (var store in stores)
            {
                storesToreturn.Add(new RetrofitStoreListDto
                {
                    Id = store.Id,
                    Name = store.Name,
                    Color = store.Color,
                    Products = storesProducts.Where(a => a.RetrofitStoreId == store.Id).ToList()
                });
            }
            return Ok(storesToreturn);
        }

        [HttpGet("Stores")]
        public async Task<IActionResult> Stores()
        {
            var stores = await _context.RetrofitStores.OrderBy(a => a.Name).ToListAsync();
            return Ok(stores);
        }

        [HttpGet("ProductsDetails")]
        public async Task<IActionResult> ProductsDetails()
        {
            var prods = await _context.Products.OrderBy(a => a.Name).ToListAsync();
            var prodStoreList = await _context.RetrofitStoreProducts.Include(a => a.RetrofitStore).ToListAsync();
            var productsToReturn = new List<ProductListDto>();
            foreach (var product in prods)
            {
                var p = new ProductListDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Stores = new List<RetrofitStoreProduct>()
                };

                var prodStores = prodStoreList.Where(a => a.ProductId == product.Id);
                if (prodStores.Count() > 0)
                    p.Stores = prodStores.OrderBy(r => r.RetrofitStore.Name).ToList();
                productsToReturn.Add(p);
            }
            return Ok(productsToReturn);
        }



        [HttpGet("Products")]

        public async Task<IActionResult> Products()
        {
            var products = await _context.Products.OrderBy(p => p.Name).ToListAsync();
            return Ok(products);
        }


        [HttpGet("StoreProducts/{storeId}")]

        public async Task<IActionResult> StoreProducts(int storeId)
        {
            var storeprods = await _context.RetrofitStoreProducts.Include(s => s.Product).Where(s => s.RetrofitStoreId == storeId).ToListAsync();
            if (storeprods == null)
                return NotFound();

            var prodsToReturn = _mapper.Map<IEnumerable<ProductDto>>(storeprods);
            return Ok(prodsToReturn);
        }


    }
}