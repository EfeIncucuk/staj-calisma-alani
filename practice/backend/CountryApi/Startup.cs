using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace CountryApi
{
    // .NET Core 3.1'de uygulama yapilandirmasi bu iki metotta yasar.
    // (Daha yeni .NET surumlerinde Startup.cs kaldirildi ve her sey
    //  Program.cs icine tasindi. Internette buldugun orneklerin cogu
    //  o yeni bicimde olacak - kafan karismasin, sende bu bicim gecerli.)
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // Buraya SERVIS kayitlari yazilir.
        // Kendi servislerini eklerken ornek:
        //     services.AddScoped<ICountryService, CountryService>();
        //     services.AddScoped<ICountryRepository, CountryRepository>();
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            // Swagger: yazdigin her ucu otomatik olarak tarayicida
            // denenebilir hale getirir. http://localhost:5000/swagger
            //
            // Faydasi: Country uclarini yazarken henuz ekran olmadan
            // POST/PUT/DELETE deneyebilir, gonderdigin JSON'i ve donen
            // cevabi gorebilirsin. Postman kurmana gerek kalmaz.
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "CountryApi", Version = "v1" });
            });

            // React gelistirme sunucusu farkli bir portta calisiyor (5173).
            // Tarayici, farkli porttan gelen istekleri varsayilan olarak
            // engeller; bu politika o engeli kaldiriyor.
            services.AddCors(options =>
            {
                options.AddPolicy("frontend", policy => policy
                    .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod());
            });
        }

        // Buraya ISTEK HATTI (middleware) sirasi yazilir. Sira onemlidir.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                // Hata olustugunda tarayicida tam yigin izini gosterir.
                app.UseDeveloperExceptionPage();

                // Swagger arayuzu sadece gelistirme ortaminda acik.
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CountryApi v1"));
            }

            app.UseRouting();
            app.UseCors("frontend");
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
