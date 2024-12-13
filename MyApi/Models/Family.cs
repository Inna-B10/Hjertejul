using System.ComponentModel.DataAnnotations;

namespace MyAPI.Models
{
    // Models for data-handling JSON categories, added errorhandling and validation to protect JSON from junk-input 
    public class Family
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Surname is required")]
        [MaxLength(50, ErrorMessage = "Surname cannot exceed 50 characters")]
        public string Surname { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = string.Empty;
        [MaxLength(1000, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }
        [Range(1, 20, ErrorMessage = "TotalPeople must be between 1 and 20")]
        public int TotalPeople { get; set; }
        // Children Removed by frontend request
        // public bool Children { get; set; }
        public List<string>? ChildGroup { get; set; }
        public List<string>? Allergies { get; set; }
        public List<string>? FoodPref { get; set; }
        public List<string>? OtherTraits { get; set; }
        public string? Image { get; set; }
    }
}
