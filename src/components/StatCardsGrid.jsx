import React from 'react';
import useOrderStore from '../store/useOrderStore';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
      gradient: 'linear-gradient(to right, #e0c3fc, #8ec5fc)',
    },
    {
      title: 'Delivered Orders',
      value: delivered,
      icon: 'bi-check-circle-fill',
      gradient: 'linear-gradient(to right, #d9f99d, #a7f3d0)',
    },
    {
      title: 'Pending Deliveries',
      value: pending,
      icon: 'bi-hourglass-split',
      gradient: 'linear-gradient(to right, #fef08a, #fcd34d)',
    },
    {
      title: 'Revenue Generated',
      value: `₹${revenue.toLocaleString()}`,
      icon: 'bi-currency-rupee',
      gradient: 'linear-gradient(to right, #bae6fd, #a5f3fc)',
    },
  ];

  return (
    <div className="container my-4">
      <h2
        className="mb-4 fw-bold"
        style={{
          fontSize: '1.8rem',
          color: '#1f2937',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '0.5rem',
        }}
      >
        <i className="bi bi-speedometer2 me-2 text-primary" />
        Dashboard Overview
      </h2>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {stats.map((stat, index) => (
          <div className="col" key={index}>
            <div
              className="card shadow h-100 border-0"
              style={{
                background: stat.gradient,
                borderRadius: '1rem',
                color: '#1f2937',
              }}
            >
              <div className="card-body d-flex align-items-center gap-3 py-4 px-4">
                <i
                  className={`bi ${stat.icon}`}
                  style={{ fontSize: '2.5rem', color: '#374151' }}
                ></i>
                <div>
                  <h6 className="fw-semibold mb-1">{stat.title}</h6>
                  <h3 className="fw-bold mb-0">{stat.value}</h3>
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
