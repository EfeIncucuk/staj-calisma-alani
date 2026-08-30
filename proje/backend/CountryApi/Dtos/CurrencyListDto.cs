using System;

namespace CountryApi.Dtos
{
    public class CurrencyListDto
    {
        public long Id { get; set; }

        public string CurrencyAlphaCode { get; set; }
        public string CurrencyName { get; set; }
    }
}