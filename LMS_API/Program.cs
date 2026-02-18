
using LMS_API.Interfaces;
using LMS_API.Repositories;
using LMS_API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;

namespace WEBAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {

            //string conn ="Server=.;Database=LMS;Trusted_Connection=True;TrustServerCertificate=True";

            //string encrypted = AesEncryptionHelper.Encrypt(conn);

            //Console.WriteLine("Encrypted value:");
            //Console.WriteLine(encrypted);

            WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();


            //Swagger Configuration
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            //CORS configuration
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("DefaultCorsPolicy", policy =>
                {
                    policy
                        .AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });


            string encryptedConn = builder.Configuration.GetConnectionString("DefaultConnection");

            //DB connection  -- decrypt
            string connectionString = AesEncryptionHelper.Decrypt(encryptedConn);

            //DI

            //Book
            builder.Services.AddScoped<IBookRepository>( m => new BookRepository(connectionString));
            //Category
            builder.Services.AddScoped<ICategoryRepository>(m => new CategoryRepository(connectionString));
            //Publisher
            builder.Services.AddScoped<IPublisherRepository>(m => new PublisherRepository(connectionString));
            //User
            builder.Services.AddHttpContextAccessor();

            builder.Services.AddScoped<IUserRepository>(sp =>
                new UserRepository(
                    connectionString,
                    sp.GetRequiredService<IHttpContextAccessor>()
                )
            );

            //Role
            builder.Services.AddScoped<IRoleRepository>(m => new RoleRepository(connectionString));
            builder.Services.AddScoped<ILoanRepository>(m => new LoanRepository(connectionString));
            builder.Services.AddScoped<IMenuRepository>(m => new MenuRepository(connectionString));
            builder.Services.AddScoped<IMenuPermissionRepository>(m => new MenuPermissionRepository(connectionString));


            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("JWT:Key").Value)),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });


            //swagger configuration
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(option =>
            {
                option.SwaggerDoc("v1", new OpenApiInfo { Title = "Web API", Version = "v1" });

                // Add Bearer token authentication
                option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter a valid token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });

                // Define security requirements
                option.AddSecurityRequirement(document => new OpenApiSecurityRequirement
                {
                    [new OpenApiSecuritySchemeReference(JwtBearerDefaults.AuthenticationScheme, document)] = []
                });
            });

            WebApplication app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("DefaultCorsPolicy");


            // Redirect root to Swagger
            app.Use(async (context, next) =>
            {
                if (context.Request.Path == "/")
                {
                    context.Response.Redirect("/swagger");
                    return;
                }
                await next();
            });

            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
