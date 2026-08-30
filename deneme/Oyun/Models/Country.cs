using System;  

namespace Oyun.Models
{
    public class Country
    {
        public long Id{ get; set; }

        public string CountryName{ get; set; }
        public string CountryNameOriginal{ get; set; }
        public string CountryNameOfficial{ get; set; }

        public long? LanguageId { get; set; }
        public long? CurrencyId { get; set; }
        public int? RiskScore { get; set; }
        public int? PhoneCode { get; set; }
        public int? AccountingRegionCode { get; set; }

        public int RecordStatus { get; set; }
        public DateTime RecordCreateDate { get; set; }
        public DateTime? RecordUpdateDate { get; set; }


    }
}