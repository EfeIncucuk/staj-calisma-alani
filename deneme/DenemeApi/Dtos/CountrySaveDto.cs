using System;
using System.ComponentModel.DataAnnotations;

namespace DenemeApi.Dtos
{
    public class CountrySaveDto
    {
        [Required(ErrorMessage = "Country name is required.")]
        [StringLength(200)]
        public string CountryName{ get; set; }
        public string CountryNameOriginal{ get; set; }
        public string CountryNameOfficial{ get; set; }

        public long? LanguageId{ get; set; }
        public long? CurrencyId{ get; set; }
        public int? RiskScore{ get; set; }
        public int? PhoneCode{ get; set; }
        public int? AccountingRegionCode{ get; set; }
    }
}