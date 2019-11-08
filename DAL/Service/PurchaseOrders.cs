using DAL.Models;
using DAL.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Service
{
    public class PurchaseOrders
    {
        private readonly IUnitOfWork _uow;
        private readonly IRepository<Order> _repo;

        public PurchaseOrders(IUnitOfWork unit, IRepository<Order> repo)
        {
            _uow = unit;
            _repo = repo;
        }

        public void GetPurchaseOrders(Order order)
        {
            _repo.Add(order);
            _uow.Commit();
        }
    }
}
