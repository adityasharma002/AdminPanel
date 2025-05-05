import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

const sampleCart = [
  { id: 1, name: 'Fresh Onion, 1kg', price: 24, quantity: 2 },
  { id: 2, name: 'Tomato, 1kg', price: 18, quantity: 1 },
];

const deliveryAgents = ['Ramesh', 'Suresh', 'Priya'];

const Cart = () => {
  const [cart, setCart] = useState(sampleCart);
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [agent, setAgent] = useState('');

  const updateQuantity = (id, delta) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCart(updated);
  };

  const handleDelete = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    alert(`Order placed for ${customerName}!\nDeliver to: ${address}\nDate: ${deliveryDate}\nAgent: ${agent}`);
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Cart ({cart.length} items)</h3>

      {cart.map((item) => (
        <div key={item.id} className="d-flex align-items-center border p-3 mb-3">
          <div style={{ width: '100px', height: '100px', background: '#eee' }} />
          <div className="ms-3 flex-grow-1">
            <h5>{item.name}</h5>
            <div className="d-flex align-items-center gap-2">
              <Button variant="light" onClick={() => updateQuantity(item.id, -1)}>-</Button>
              <span>{item.quantity}</span>
              <Button variant="light" onClick={() => updateQuantity(item.id, 1)}>+</Button>
              <Button variant="link" onClick={() => handleDelete(item.id)} className="text-danger">
                <Trash />
              </Button>
            </div>
          </div>
          <div className="fw-bold">₹{item.price * item.quantity}</div>
        </div>
      ))}

      <div className="border p-3 mb-4">
        <h5>Assign Delivery</h5>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Delivery Address</Form.Label>
            <Form.Control
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Delivery Date</Form.Label>
            <Form.Control
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Delivery Agent</Form.Label>
            <Form.Select value={agent} onChange={(e) => setAgent(e.target.value)}>
              <option value="">Select agent</option>
              {deliveryAgents.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </div>

      <h4 className="mb-3">Subtotal: ₹{subtotal}</h4>
      <Button
        onClick={handleCheckout}
        disabled={!customerName || !address || !deliveryDate || !agent}
      >
        Checkout
      </Button>
    </div>
  );
};

export default Cart;
