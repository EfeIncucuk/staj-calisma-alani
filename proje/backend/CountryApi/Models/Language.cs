using System;

namespace CountryApi.Models
{
    public class Language
    {
        public long id { get; set; }

        public string Name { get; set; }
        public string Code { get; set; }
        public string EngName { get; set; }
        public string OrgName { get; set; }

        public int RecordStatus { get; set; }
    }
}