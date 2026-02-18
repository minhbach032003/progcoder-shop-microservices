var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
    {
        policy.WithOrigins("http://localhost:4001")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowNextJs");

app.MapGet("/api/products", () =>
{
    return new[]
    {
        new Product(1, "iPhone 15 Pro", "Latest iPhone with A17 Pro chip", 1199.99m, 50, "Electronics", "https://placehold.co/200x200"),
        new Product(2, "MacBook Pro 14\"", "M3 Pro chip, 18GB RAM", 2399.99m, 25, "Electronics", "https://placehold.co/200x200"),
        new Product(3, "AirPods Pro 2", "Active Noise Cancellation", 249.99m, 100, "Accessories", "https://placehold.co/200x200"),
        new Product(4, "iPad Air", "M1 chip, 10.9-inch display", 599.99m, 35, "Electronics", "https://placehold.co/200x200"),
        new Product(5, "Apple Watch Ultra 2", "Titanium case, 49mm", 799.99m, 20, "Wearables", "https://placehold.co/200x200"),
    };
})
.WithName("GetProducts")
.WithTags("Products");

app.MapGet("/api/products/{id}", (int id) =>
{
    var products = new[]
    {
        new Product(1, "iPhone 15 Pro", "Latest iPhone with A17 Pro chip", 1199.99m, 50, "Electronics", "https://placehold.co/200x200"),
        new Product(2, "MacBook Pro 14\"", "M3 Pro chip, 18GB RAM", 2399.99m, 25, "Electronics", "https://placehold.co/200x200"),
        new Product(3, "AirPods Pro 2", "Active Noise Cancellation", 249.99m, 100, "Accessories", "https://placehold.co/200x200"),
        new Product(4, "iPad Air", "M1 chip, 10.9-inch display", 599.99m, 35, "Electronics", "https://placehold.co/200x200"),
        new Product(5, "Apple Watch Ultra 2", "Titanium case, 49mm", 799.99m, 20, "Wearables", "https://placehold.co/200x200"),
    };
    return products.FirstOrDefault(p => p.Id == id) is { } product ? Results.Ok(product) : Results.NotFound();
})
.WithName("GetProduct")
.WithTags("Products");

app.MapGet("/api/orders", () =>
{
    return new[]
    {
        new Order(1001, "John Doe", "john@email.com", 1439.98m, "Completed", DateTime.Now.AddDays(-5)),
        new Order(1002, "Jane Smith", "jane@email.com", 599.99m, "Processing", DateTime.Now.AddDays(-3)),
        new Order(1003, "Bob Wilson", "bob@email.com", 2649.98m, "Shipped", DateTime.Now.AddDays(-2)),
        new Order(1004, "Alice Brown", "alice@email.com", 249.99m, "Pending", DateTime.Now.AddDays(-1)),
        new Order(1005, "Charlie Davis", "charlie@email.com", 799.99m, "Completed", DateTime.Now),
    };
})
.WithName("GetOrders")
.WithTags("Orders");

app.MapGet("/api/customers", () =>
{
    return new[]
    {
        new Customer(1, "John Doe", "john@email.com", "+1-555-0101", 15, 5250.00m, DateTime.Now.AddMonths(-6)),
        new Customer(2, "Jane Smith", "jane@email.com", "+1-555-0102", 8, 3200.00m, DateTime.Now.AddMonths(-4)),
        new Customer(3, "Bob Wilson", "bob@email.com", "+1-555-0103", 22, 8500.00m, DateTime.Now.AddMonths(-8)),
        new Customer(4, "Alice Brown", "alice@email.com", "+1-555-0104", 5, 1500.00m, DateTime.Now.AddMonths(-2)),
        new Customer(5, "Charlie Davis", "charlie@email.com", "+1-555-0105", 12, 4100.00m, DateTime.Now.AddMonths(-5)),
    };
})
.WithName("GetCustomers")
.WithTags("Customers");

app.MapGet("/api/dashboard/statistics", () =>
{
    return new DashboardStatistics(
        TotalRevenue: 125750.00m,
        TotalOrders: 1248,
        TotalCustomers: 356,
        TotalProducts: 89,
        RevenueGrowth: 12.5,
        OrdersGrowth: 8.3,
        CustomersGrowth: 15.2
    );
})
.WithName("GetDashboardStatistics")
.WithTags("Dashboard");

app.MapGet("/api/dashboard/revenue-chart", () =>
{
    var random = new Random(42);
    return Enumerable.Range(0, 12).Select(i =>
    {
        var month = DateTime.Now.AddMonths(-11 + i).ToString("MMM");
        return new ChartDataPoint(month, random.Next(8000, 15000));
    }).ToArray();
})
.WithName("GetRevenueChart")
.WithTags("Dashboard");

app.MapGet("/api/dashboard/top-products", () =>
{
    return new[]
    {
        new TopProduct("iPhone 15 Pro", 245, 293975.55m),
        new TopProduct("MacBook Pro 14\"", 189, 453400.11m),
        new TopProduct("AirPods Pro 2", 456, 113975.44m),
        new TopProduct("iPad Air", 178, 106798.22m),
        new TopProduct("Apple Watch Ultra 2", 134, 107198.66m),
    };
})
.WithName("GetTopProducts")
.WithTags("Dashboard");

app.Run();

record Product(int Id, string Name, string Description, decimal Price, int Stock, string Category, string ImageUrl);
record Order(int Id, string CustomerName, string CustomerEmail, decimal Total, string Status, DateTime CreatedAt);
record Customer(int Id, string Name, string Email, string Phone, int OrdersCount, decimal TotalSpent, DateTime JoinedAt);
record DashboardStatistics(decimal TotalRevenue, int TotalOrders, int TotalCustomers, int TotalProducts, double RevenueGrowth, double OrdersGrowth, double CustomersGrowth);
record ChartDataPoint(string Label, int Value);
record TopProduct(string Name, int SoldCount, decimal Revenue);
