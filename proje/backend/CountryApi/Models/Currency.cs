using System;

namespace CountryApi.Models
{
    public class Currency
    {
        public long Id { get; set; }

        public string CurrencyAlphaCode { get; set; }
        public string CurrencyNumericCode { get; set; }
        public string CurrencyName { get; set; }
        public int RecordStatus { get; set; }
    }
}