import React from 'react';
import useOrderStore from '../store/useOrderStore';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ensure this is loaded

const StatCardsGrid = () => {
  const orders = useOrderStore((state) => state.orders);

  const totalOrders = orders.length;
  const delivered = orders.filter((o) => o.status === 'Delivered').length;
  const pending = orders.filter((o) => o.status === 'Pending').length;
  const revenue = orders
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: 'bi-cart-fill',
      bgColor: '#eef2ff',
    },
    {
      title: 'Delivered Orders',
      value: delivered,
      icon: 'bi-check-circle-fill',
      bgColor: '#e6ffed',
    },
    {
      title: 'Pending Deliveries',
      value: pending,
      icon: 'bi-hourglass-split',
      bgColor: '#fffbe6',
    },
    {
      title: 'Revenue Generated',
      value: `₹${revenue.toLocaleString()}`,
      icon: 'bi-currency-rupee',
      bgColor: '#e6f7ff',
    },
  ];

  return (
    <div className="container my-4">
      <h2 className="mb-4 fw-bold">Dashboard Overview</h2>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {stats.map((stat, index) => (
          <div className="col" key={index}>
            <div
              className="card shadow-sm h-100"
              style={{ backgroundColor: stat.bgColor }}
            >
              <div className="card-body d-flex align-items-center gap-3">
                <i
                  className={`bi ${stat.icon}`}
                  style={{ fontSize: '2rem', color: '#4b5563' }}
                ></i>
                <div>
                  <h5 className="card-title fw-semibold mb-1">
                    {stat.title}
                  </h5>
                  <p className="card-text display-6 fw-bold mb-0">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatCardsGrid;
