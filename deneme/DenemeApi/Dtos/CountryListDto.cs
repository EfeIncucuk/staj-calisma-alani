using System;

namespace DenemeApi.Dtos
{
    public class CountryListDto
    {
        public long Id{ get; set; }
        public string CountryName{ get; set; }
        public string LanguageName{ get; set; }
        public string CurrencyName{ get; set; }
        public int? PhoneCode{ get; set; }
        public int? RiskScore{ get; set; }
    }
}