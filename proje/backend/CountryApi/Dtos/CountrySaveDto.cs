using System;
using System.ComponentModel.DataAnnotations;

namespace CountryApi.Dtos
{
    public class CountrySaveDto
    {
        [Required(ErrorMessage = "Country name is required.")]
        [StringLength(100)]
        public string CountryName { get; set; }
        [Required(ErrorMessage = "Official Country name is required.")]
        [StringLength(100)]
        public string CountryNameOfficial { get; set; }
        [Required(ErrorMessage = "Original Country name is required.")]
        [StringLength(100)]
        public string CountryNameOriginal { get ; set; }

        [Required]
        [StringLength(2, MinimumLength = 2)]
        public string Country2AlpCode { get; set; }
        [Required]
        [StringLength(3, MinimumLength = 3)]
        public string Country3AlpCode { get; set; }
        [Required]
        public int? CountryNumCode { get; set;}

        public long? CurrencyId { get; set; }
        public long? LanguageId { get; set; }
        public int? PhoneCode { get; set; }
        [Range(0, 100)]
        public int? RiskScore { get; set; }

        public int? AccountingRegionCode { get; set; }
        [StringLength(100)]
        public string AccountingRegionDesc { get; set; }
    }
}