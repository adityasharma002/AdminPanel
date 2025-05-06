// src/pages/InvoicePage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import useOrderStore from '../store/useOrderStore';
import { Table } from 'react-bootstrap';

const InvoicePage = () => {
  const { orderId } = useParams();
  const order = useOrderStore((state) =>
    state.orders.find((o) => o.id === orderId)
  );

  if (!order) return <div className="container py-4">Order not found.</div>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Invoice</h2>

      {/* Invoice Info */}
      <div className="mb-3">
        <strong>Invoice ID:</strong> {order.id}<br />
        <strong>Order Date:</strong> {order.orderDate}<br />
        <strong>Delivery Date:</strong> {order.deliveryDate}<br />
        <strong>Payment Status:</strong> {order.paymentStatus}<br />
        <strong>Status:</strong> {order.status}<br />
      </div>

      {/* Customer Info */}
      <div className="mb-4">
        <h5>Customer Info</h5>
        <strong>Name:</strong> {order.customerName}<br />
        <strong>Address:</strong> {order.address}<br />
        <strong>Delivery Boy:</strong> {order.deliveryBoy || 'Unassigned'}<br />
      </div>

      {/* Product Table */}
      <h5>Products</h5>
      <Table bordered>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Unit Price (₹)</th>
            <th>Subtotal (₹)</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((p, idx) => (
            <tr key={idx}>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              <td>{p.price}</td>
              <td>{p.quantity * p.price}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Total */}
      <div className="mt-3">
        <h5>Total: ₹{order.totalAmount}</h5>
      </div>

      <div className="mt-5 text-muted text-center">
        <p>Thank you for your purchase!</p>
      </div>
    </div>
  );
};

export default InvoicePage;
