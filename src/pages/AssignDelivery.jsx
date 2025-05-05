import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';

const AssignDelivery = () => {
  const [showModal, setShowModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deliveryBoy, setDeliveryBoy] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [address, setAddress] = useState('');
  const [deliveries, setDeliveries] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('deliveries');
    if (saved) {
      setDeliveries(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  const handleAssign = () => {
    if (!productName || !quantity || !deliveryBoy || !deliveryDate || !address) {
      alert('Please fill all fields.');
      return;
    }

    const newDelivery = {
      id: Date.now(),
      productName,
      quantity,
      deliveryBoy,
      deliveryDate,
      address
    };

    setDeliveries([...deliveries, newDelivery]);
    setShowModal(false);

    // Reset form
    setProductName('');
    setQuantity('');
    setDeliveryBoy('');
    setDeliveryDate('');
    setAddress('');
  };

  const handleDelete = (id) => {
    const updated = deliveries.filter(d => d.id !== id);
    setDeliveries(updated);
  };

  return (
    <div className="container py-4">
      <h2 className="text-center fw-bold mb-4">Assign Delivery</h2>

      <div className="d-flex justify-content-end mb-3">
        <Button onClick={() => setShowModal(true)}>Assign Product</Button>
      </div>

      {deliveries.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Delivery Boy</th>
              <th>Date</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((d) => (
              <tr key={d.id}>
                <td>{d.productName}</td>
                <td>{d.quantity}</td>
                <td>{d.deliveryBoy}</td>
                <td>{d.deliveryDate}</td>
                <td>{d.address}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(d.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-muted text-center">No deliveries assigned yet.</p>
      )}

      {/* Modal for assigning product */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 2kg"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Delivery Boy</Form.Label>
              <Form.Control
                value={deliveryBoy}
                onChange={(e) => setDeliveryBoy(e.target.value)}
                placeholder="Enter delivery boy name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Delivery Date</Form.Label>
              <Form.Control
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Delivery Address</Form.Label>
              <Form.Control
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter delivery address"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign}>Assign</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssignDelivery;
