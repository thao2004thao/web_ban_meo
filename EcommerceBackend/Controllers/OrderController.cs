using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        // DTO classes
        public class OrderDetailDto
        {
            public int ProductId { get; set; }
            public string ProductName { get; set; } = string.Empty;
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
        }

        public class OrderDto
        {
            public int OrderId { get; set; }
            public DateTime OrderDate { get; set; }
            public decimal TotalAmount { get; set; }
            public List<OrderDetailDto> Details { get; set; } = new();
        }

        // GET: api/orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            var dtos = await _context.Orders
                .Include(o => o.OrderDetails!)
                    .ThenInclude(od => od.Product)
                .Select(o => new OrderDto
                {
                    OrderId = o.OrderId,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    Details = o.OrderDetails!.Select(od => new OrderDetailDto
                    {
                        ProductId = od.ProductId,
                        ProductName = od.Product!.Name,
                        Quantity = od.Quantity,
                        UnitPrice = od.UnitPrice
                    }).ToList()
                })
                .ToListAsync();

            return Ok(dtos);
        }

        // GET: api/orders/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            var dto = await _context.Orders
                .Where(o => o.OrderId == id)
                .Include(o => o.OrderDetails!)
                    .ThenInclude(od => od.Product)
                .Select(o => new OrderDto
                {
                    OrderId = o.OrderId,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    Details = o.OrderDetails!.Select(od => new OrderDetailDto
                    {
                        ProductId = od.ProductId,
                        ProductName = od.Product!.Name,
                        Quantity = od.Quantity,
                        UnitPrice = od.UnitPrice
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (dto == null)
                return NotFound();

            return Ok(dto);
        }

        // POST: api/orders
        [HttpPost]
        public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CreateOrderRequest request)
        {
            if (!await _context.Users.AnyAsync(u => u.Id == request.UserId))
                return BadRequest("User không tồn tại.");

            var order = new Order
            {
                UserId = request.UserId,
                OrderDate = DateTime.Now,
                TotalAmount = request.TotalAmount
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            foreach (var d in request.Details)
            {
                _context.OrderDetails.Add(new OrderDetail
                {
                    OrderId = order.OrderId,
                    ProductId = d.ProductId,
                    Quantity = d.Quantity,
                    UnitPrice = d.UnitPrice
                });
            }
            await _context.SaveChangesAsync();

            // Build DTO to return
            var createdDto = new OrderDto
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Details = request.Details.Select(d => new OrderDetailDto
                {
                    ProductId = d.ProductId,
                    ProductName = _context.Products
                        .Where(p => p.Id == d.ProductId)
                        .Select(p => p.Name)
                        .FirstOrDefault() ?? string.Empty,
                    Quantity = d.Quantity,
                    UnitPrice = d.UnitPrice
                }).ToList()
            };

            return CreatedAtAction(nameof(GetOrder), new { id = order.OrderId }, createdDto);
        }

        // PUT: api/orders/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] UpdateOrderRequest request)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound();

            order.TotalAmount = request.TotalAmount;
            // If needed, update details similarly

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/orders/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails!)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null)
                return NotFound();

            _context.OrderDetails.RemoveRange(order.OrderDetails!);
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        public class OrderDto1
        {
            public int OrderId { get; set; }
            public string OrderDate { get; set; } = string.Empty; // changed from DateTime
            public decimal TotalAmount { get; set; }
            public List<OrderDetailDto> Details { get; set; } = new();
        }

        // GET: api/orders/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<OrderDto1>>> GetOrdersByUser(int userId)
        {
            if (!await _context.Users.AnyAsync(u => u.Id == userId))
                return NotFound($"User với id={userId} không tồn tại.");

            var dtos = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderDetails!)
                    .ThenInclude(od => od.Product)
                .Select(o => new OrderDto1
                {
                    OrderId = o.OrderId,
                    OrderDate = o.OrderDate.ToString("dd/MM/yyyy HH:mm"), // 👈 format date here
                    TotalAmount = o.TotalAmount,
                    Details = o.OrderDetails!.Select(od => new OrderDetailDto
                    {
                        ProductId = od.ProductId,
                        ProductName = od.Product!.Name,
                        Quantity = od.Quantity,
                        UnitPrice = od.UnitPrice
                    }).ToList()
                })
                .ToListAsync();

            return Ok(dtos);
        }

    }

    // Request DTOs remain unchanged
    public class CreateOrderRequest
    {
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public List<CreateOrderDetailRequest> Details { get; set; } = new();
    }

    public class CreateOrderDetailRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class UpdateOrderRequest
    {
        public decimal TotalAmount { get; set; }
    }
}
