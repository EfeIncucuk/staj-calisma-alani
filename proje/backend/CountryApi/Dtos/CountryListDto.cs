using System;

namespace CountryApi.Dtos
{
    public class CountryListDto
    {
        public long Id { get; set; }

        public string CountryName { get; set; }
        public string CountryNameOfficial { get; set; }
        public string CountryNameOriginal { get ; set; }

        public string Country2AlpCode { get; set; }
        public string Country3AlpCode { get; set; }

        public int CountryNumCode { get; set;}
        public string CurrencyName { get; set; }
        public string LanguageName { get; set; }
        public int? PhoneCode { get; set; }
        public int? RiskScore { get; set; }

        public int? AccountingRegionCode { get; set; }
        public string AccountingRegionDesc { get; set; }
    }
}