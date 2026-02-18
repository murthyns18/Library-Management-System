using LMS.Common;
using LMS.Filters;
using LMS.Models;
using Microsoft.AspNetCore.ResponseCompression;
using Serilog;
using Serilog.Events;
using System.IO.Compression;



WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();


// Bind API URL
builder.Configuration
       .GetSection("API")
       .Bind(AppSettings.APIDetails);


// Configure session
builder.Services.AddSession(options =>
{
    options.Cookie.Name = "LMS";
    options.IdleTimeout = TimeSpan.FromMinutes(120);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});


//Compression Configuration
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});

builder.Services.Configure<BrotliCompressionProviderOptions>(options =>
{
    options.Level = CompressionLevel.Fastest;
});

builder.Services.Configure<GzipCompressionProviderOptions>(options =>
{
    options.Level = CompressionLevel.Fastest;
});

//OnExceptionAttribute globally
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add<OnExceptionAttribute>();
});
builder.Services.AddScoped<OnExceptionAttribute>();


//session di
builder.Services.AddScoped<SessionAuthorizeFilter>();

builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add<SessionAuthorizeFilter>();
});


//DI ActionFilter
builder.Services.AddScoped<EncryptedActionParameterFilter>();


//Serilog configuraiton
string logDirectory = @"C:\Errors";

if (!Directory.Exists(logDirectory))
{
    Directory.CreateDirectory(logDirectory);
}

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Error)
    .MinimumLevel.Override("System", LogEventLevel.Error)
    .WriteTo.Async(a => a.File(
        path: Path.Combine(logDirectory, "log-.txt"),
        rollingInterval: RollingInterval.Day,
        shared: true,
        outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff} {Level:u3}]{NewLine}{Message:lj}",
        fileSizeLimitBytes: 2147483648,
        retainedFileCountLimit: 7
    ))
    .CreateLogger();

builder.Host.UseSerilog();

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseSession();
app.UseAuthorization();

app.MapStaticAssets();
//app.UseResponseCompression();
app.MapControllerRoute(
    name: "default",
    //pattern: "{controller=Home}/{action=Index}/{id?}")
    pattern: "{controller=Login}/{action=Login}/{id?}")
    .WithStaticAssets();


app.Run();
