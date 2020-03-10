using System.Globalization;
using System.Text;
using AutoMapper;
using RLE.API.Data;
using RLE.API.Helpers;
using RLE.API.Models;
using RLE.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace RLE.API
{
    public class Startup
    {
        // private readonly DataContext _context;

        // private readonly IEmailSender _emailSender;
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            StaticConfig = configuration;
            // _emailSender = emailSender;
        }

        public IConfiguration Configuration { get; }
        // public IEmailSender _emailSender { get; private set; }
        public static IConfiguration StaticConfig { get; private set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(Options => Options.UseSqlServer(Configuration
                .GetConnectionString("DefaultConnection")));

            // services.AddDefaultIdentity<IdentityUser>(config =>
            // {
            //     config.SignIn.RequireConfirmedEmail = true;
            // });

            IdentityBuilder builder = services.AddIdentityCore<User>(opt =>
            {
                opt.Password.RequireDigit = false;
                opt.Password.RequiredLength = 4;
                opt.Password.RequireNonAlphanumeric = false;
                opt.Password.RequireUppercase = false;

                // opt.TokenValidationParameters = new TokenValidationParameters
                // {
                //     ValidateIssuerSigningKey = true,
                //     IssuerSigningKey = key,
                //     ValidateAudience = false,
                //     ValidateIssuer = false,
                //     ValidateLifetime = true,
                //     ClockSkew = TimeSpan.Zero
                // };
            });

            builder = new IdentityBuilder(builder.UserType, typeof(Role), builder.Services);
            builder.AddEntityFrameworkStores<DataContext>();
            builder.AddRoleValidator<RoleValidator<Role>>();
            builder.AddRoleManager<RoleManager<Role>>();
            builder.AddSignInManager<SignInManager<User>>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(Options =>
                {
                    Options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII
                            .GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
                options.AddPolicy("ModeratePhotoRole", policy => policy.RequireRole("Admin", "Moderator"));
                options.AddPolicy("VipOnly", policy => policy.RequireRole("VIP"));
            });

            // requires
            // using Microsoft.AspNetCore.Identity.UI.Services;
            // using WebPWrecover.Services;
            services.AddTransient<IEmailSender, EmailSender>();
            services.Configure<AuthMessageSenderOptions>(Configuration);

            services.AddMvc(options =>
                {
                    var policy = new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .Build();
                    options.Filters.Add(new AuthorizeFilter(policy));
                }
            )
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                .AddJsonOptions(opt =>
                {
                    opt.SerializerSettings.ReferenceLoopHandling =
                        Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                });

            //services.BuildServiceProvider().GetService<DataContext>().Database.Migrate();
            services.AddCors();
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));
            //Mapper.Reset();
            services.AddAutoMapper(typeof(IEducNotesRepository).Assembly);
            services.AddTransient<Seed>();
            // services.AddScoped<IDatingRepository, DatingRepository>();
            services.AddScoped<IEducNotesRepository, EducNotesRepository>();
            services.AddScoped<LogUserActivity>();
        }

        //  This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, DataContext dataContext)
        {
            var cultureInfo = new CultureInfo("fr-FR");
            cultureInfo.NumberFormat.CurrencySymbol = "F";

            CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
            CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

            if (env.IsDevelopment())
            {
                // app.UseDeveloperExceptionPage();
                //app.UseDeveloperExceptionPage();
                app.UseExceptionHandler(builder =>
                {
                    builder.Run(async context =>
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                        var error = context.Features.Get<IExceptionHandlerFeature>();
                        // dataContext.
                        //  var exception = error.Error;
                        if (error != null)
                        {
                            if (error != null)
                            {
                                var err = $"<h1>Error: {error.Error.Message}</h1>{error.Error.Source}<hr />{context.Request.Path}<br />";
                                err += $"QueryString: {context.Request.QueryString}<hr />";

                                err += $"Stack Trace<hr />{error.Error.StackTrace.Replace(Environment.NewLine, "<br />")}";
                                if (error.Error.InnerException != null)
                                    err +=
                                        $"Inner Exception<hr />{error.Error.InnerException?.Message.Replace(Environment.NewLine, "<br />")}";
                                // This bit here to check for a form collection!
                                if (context.Request.HasFormContentType && context.Request.Form.Any())
                                {
                                    err += "<table border=\"1\"><tr><td colspan=\"2\">Form collection:</td></tr>";
                                    foreach (var form in context.Request.Form)
                                    {
                                        err += $"<tr><td>{form.Key}</td><td>{form.Value}</td></tr>";
                                    }
                                    err += "</table>";
                                }
                                dataContext.Add (
                                    new Email {
                                        Content = err,
                                        Subject = "Error"
                                    }
                                );
                                dataContext.SaveChanges();
                                //  await   _emailSender.SendEmailAsync("mhkabore@gmail.com", "CMP v2 error", err);
                                // context.Response.Redirect("/Home/Error?r=" +
                                //                             System.Net.WebUtility.UrlEncode(context.Request.Path + "?" +
                                //                                                             context.Request.QueryString));
                            }

                            context.Response.AddApplicationError(error.Error.Message);
                            await context.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });
            }
            else
            {
                //app.UseDeveloperExceptionPage();
                // app.UseExceptionHandler(builder => {
                //     builder.Run(async context => {
                //         context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                //         var error = context.Features.Get<IExceptionHandlerFeature>();
                //         if(error != null)
                //         {
                //             context.Response.AddApplicationError(error.Error.Message);
                //             await context.Response.WriteAsync(error.Error.Message);
                //         }
                //     });
                // });
                app.UseHsts();
            }
            app.UseDeveloperExceptionPage();
            app.UseHttpsRedirection();
            // seeder.SeedUsers();
            //    app.UseCors(x => x.WithOrigins("http://localhost:4200")
            //         .AllowAnyHeader().AllowAnyMethod().AllowCredentials());
            app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            app.UseAuthentication();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseMvc();
            app.UseMvc(routes =>
            {
                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { Controller = "Fallback", Action = "Index" }
                );
            });

        }
    }
}
