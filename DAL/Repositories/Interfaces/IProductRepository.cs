using DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        Product GetProduct(int Id);
        IEnumerable<Product> GetAllProducts();
        Product Add(Product product);
        Product Update(Product productChanges);
        Product Delete(int Id);
    }
}
