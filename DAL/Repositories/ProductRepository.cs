using DAL.Models;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(DbContext context) : base(context)
        { }




        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public Product Delete(int Id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Product> GetAllProducts()
        {
            throw new NotImplementedException();
        }

        public Product GetProduct(int Id)
        {
            throw new NotImplementedException();
        }

        Product IProductRepository.Add(Product product)
        {
            throw new NotImplementedException();
        }

        Product IProductRepository.Update(Product productChanges)
        {
            throw new NotImplementedException();
        }
    }
}
