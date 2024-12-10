var builder = WebApplication.CreateBuilder(args);

// Legg til CORS-politikk for å tillate forespørsler fra Swagger
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin() // Tillat alle domener
              .AllowAnyHeader() // Tillat alle HTTP-overskrifter
              .AllowAnyMethod(); // Tillat alle metoder (GET, POST, PUT, DELETE)
    });
});

// Legg til de vanlige tjenestene (controllers og swagger)
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Aktiver CORS for hele appen
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MyAPI v1");
        c.RoutePrefix = string.Empty; // Åpne Swagger på rot-URL
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
