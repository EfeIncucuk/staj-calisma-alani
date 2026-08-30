using System;

namespace CountryApi.Models
{
    public class Country
    {
        public long Id { get; set; }

        public string CountryName { get; set; }
        public string CountryNameOfficial { get; set; }
        public string CountryNameOriginal { get ; set; }

        public string Country2AlpCode { get; set; }
        public string Country3AlpCode { get; set; }

        public int CountryNumCode { get; set;}
        public long? CurrencyId { get; set; }
        public long? LanguageId { get; set; }
        public int? PhoneCode { get; set; }
        public int? RiskScore { get; set; }

        public int? AccountingRegionCode { get; set; }
        public string AccountingRegionDesc { get; set; }

        public int RecordCreateUser { get; set; }
        public DateTime RecordCreateDate { get; set; }
        public DateTime? RecordUpdateDate { get; set; }

        public int RecordStatus { get; set; }
    }
}