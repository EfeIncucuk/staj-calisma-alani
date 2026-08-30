using System;
using Oyun.Models;
using System.Collections.Generic;
using System.Linq;

namespace Oyun
{
    class Program
    {
        static void Main(string[] args)
        {
            List<Country> Countries = new List<Country>();

            Country c = new Country();
            c.Id = 1;
            c.CountryName = "Turkey";
            c.RecordStatus = 1;
            Countries.Add(c);
           
            Countries.Add(new Country
            {
                Id = 2,
                CountryName = "England",
                RecordStatus = 1,
            });

            Countries.Add(new Country { Id = 3, CountryName = "Greece", RecordStatus = -1});

            List<Country> actives = Countries
                .Where(k => k.RecordStatus == 1)
                .ToList();
            
            bool İsTurkey = Countries
                .Any(k => k.CountryName == "Turkey");

            foreach (var Country in actives)
            {
                Console.WriteLine(Country.Id);
                Console.WriteLine(Country.CountryName);
            }
        }
    }
}
