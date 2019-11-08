using DAL.Repositories.Interfaces;
using System;

namespace DAL
{
    public interface IUnitOfWork : IDisposable
    {
        ICustomerRepository Customers { get; }
        IProductRepository Products { get; }
        IOrdersRepository Orders { get; }

        int SaveChanges();
        void Commit();
    }
}
