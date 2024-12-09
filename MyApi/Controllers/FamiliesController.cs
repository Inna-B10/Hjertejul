using Microsoft.AspNetCore.Mvc;
using MyAPI.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace MyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FamiliesController : ControllerBase
    {
        private static List<Family> _families = new List<Family>();

        public FamiliesController()
    
        {
            try 
            {
                // Korrekt filbane for families.json
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "families.json");
                
                // Les inn innholdet fra JSON-filen
                var jsonData = System.IO.File.ReadAllText(filePath);
                // Debug line, to check if the JSON data was correctly handled
                Console.WriteLine("JSON-data lastet inn: " + jsonData); // Log JSON dataen
                
                // Deserialiser JSON-dataen til en liste med familier
                _families = JsonSerializer.Deserialize<List<Family>>(jsonData, new JsonSerializerOptions 
                {
                    PropertyNameCaseInsensitive = true
                }) ?? new List<Family>();

                // Debug line, to check if the JSON is correctly deserialized (JSON Bug fixed by PropertyNameCaseInsensitive)
                // Console.WriteLine($"HEISANN DU! _families er lastet med {_families.Count} familier!");

                if (_families.Count == 0)
                {
                    Console.WriteLine("_families er tom! Sjekk om JSON-filen er gyldig og at den har innhold.");
                }
                else 
                {
                    Console.WriteLine($"_families er lastet med {_families.Count} familier!");
                }
            }
            catch (Exception ex) 
            {
                Console.WriteLine($"Feil ved lasting av families.json: {ex.Message}");
                _families = new List<Family>();
            }
        }

        // GET /api/families
        [HttpGet]
        public ActionResult<IEnumerable<Family>> GetFamilies()
        {
            return Ok(_families);
        }

        // GET /api/families/{id}
        [HttpGet("{id}")]
        public ActionResult<Family> GetFamilyById(int id)
        {
            var family = _families.FirstOrDefault(f => f.Id == id);
            if (family == null) 
                return NotFound(new { message = $"Family with ID {id} not found" });
                
            return Ok(family);
        }

        // POST /api/families
        [HttpPost]
        public ActionResult<Family> CreateFamily(Family family)
        {
            if (family == null) 
                return BadRequest(new { message = "Invalid family data" });

            // Hvis listen er tom, starter ID med 1
            family.Id = _families.Count > 0 ? _families.Max(f => f.Id) + 1 : 1;

            _families.Add(family);

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "families.json");
            System.IO.File.WriteAllText(filePath, JsonSerializer.Serialize(_families, new JsonSerializerOptions { WriteIndented = true }));

            return CreatedAtAction(nameof(GetFamilyById), new { id = family.Id }, family);
        }

        // PUT /api/families/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateFamily(int id, Family updatedFamily)
        {
            if (updatedFamily == null) 
                return BadRequest(new { message = "Invalid family data" });

            var family = _families.FirstOrDefault(f => f.Id == id);
            if (family == null) 
                return NotFound(new { message = $"Family with ID {id} not found" });

            // Oppdater familiedataene
            family.Surname = updatedFamily.Surname ?? family.Surname;
            family.Title = updatedFamily.Title ?? family.Title;
            family.Description = updatedFamily.Description ?? family.Description;
            family.TotalPeople = updatedFamily.TotalPeople;
            family.Children = updatedFamily.Children;
            family.ChildGroup = updatedFamily.ChildGroup ?? family.ChildGroup;
            family.Allergies = updatedFamily.Allergies ?? family.Allergies;
            family.FoodPref = updatedFamily.FoodPref ?? family.FoodPref;
            family.OtherTraits = updatedFamily.OtherTraits ?? family.OtherTraits;
            family.Image = updatedFamily.Image ?? family.Image;

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "families.json");
            System.IO.File.WriteAllText(filePath, JsonSerializer.Serialize(_families, new JsonSerializerOptions { WriteIndented = true }));

            return NoContent();
        }

        // DELETE /api/families/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteFamily(int id)
        {
            var family = _families.FirstOrDefault(f => f.Id == id);
            if (family == null) 
                return NotFound(new { message = $"Family with ID {id} not found" });

            _families.Remove(family);

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "families.json");
            System.IO.File.WriteAllText(filePath, JsonSerializer.Serialize(_families, new JsonSerializerOptions { WriteIndented = true }));

            return NoContent();
        }
    }
}
