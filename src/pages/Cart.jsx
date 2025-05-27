import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Alert, Modal } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/authStore';

const API_BASE = 'https://logistic-project-backend.onrender.com/api';
const deliveryAgents = ['Ramesh', 'Suresh', 'Priya'];

const Cart = () => {
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getCartItems = useCartStore((state) => state.getCartItems);
  const isLoading = useCartStore((state) => state.isLoading);
  const error = useCartStore((state) => state.error);
  const clearError = useCartStore((state) => state.clearError);
  
  const { token, user } = useAuthStore();

  const [customerName, setCustomerName] = useState(user?.username || '');
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [agent, setAgent] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Load cart items when component mounts
  useEffect(() => {
    if (token) {
      getCartItems();
    }
  }, [token, getCartItems]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        clearError();
      }
    };
  }, [error, clearError]);

  // Calculate subtotal with better error handling
  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);

  const handleUpdateQuantity = async (productId, delta) => {
    try {
      await updateQuantity(productId, delta);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleCheckout = () => {
    if (!customerName || !address || !deliveryDate || !agent) {
      alert('Please fill in all delivery details before proceeding.');
      return;
    }
    setShowModal(true);
  };

  const handleConfirmOrder = () => {
    // Here you would typically send the order to your backend
    console.log('Order confirmed:', {
      customerName,
      address,
      deliveryDate,
      agent,
      items: cart,
      total: subtotal
    });
   
    // Reset form and close modal
    setCustomerName(user?.username || '');
    setAddress('');
    setDeliveryDate('');
    setAgent('');
    setShowModal(false);
   
    // Show success message
    alert('Order placed successfully!');
  };

  if (isLoading) {
    return (
      <div className="container py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-2">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">🛒 Your Shopping Cart</h2>
      
      {error && (
        <Alert variant="warning" dismissible onClose={clearError}>
          {error}
        </Alert>
      )}

      {cart.length === 0 ? (
        <Alert variant="info">Your cart is currently empty.</Alert>
      ) : (
        <>
          <Row xs={1} md={2} className="g-4">
            {cart.map((item, index) => {
              // Use combination of productId and index to ensure unique keys
              const uniqueKey = `${item.productId}-${index}`;
              const price = Number(item.price) || 0;
              const quantity = Number(item.quantity) || 0;
              const total = price * quantity;

              return (
                <Col key={uniqueKey} xs={12} sm={6} md={4} className="mb-4">
                  <Card className="shadow-sm border-0 h-100 p-2">
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          background: '#f8f9fa',
                          width: '100px',
                          height: '100px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          marginRight: '1rem',
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          color: '#6c757d'
                        }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || item.productName}
                            className="img-fluid"
                            style={{ maxHeight: '80px', objectFit: 'contain' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <span>{(item.name || item.productName || 'P').slice(0, 2)}</span>
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-semibold mb-1">
                          {item.name || item.productName || 'Unknown Product'}
                        </h6>
                        <p className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                          Price: ₹{price.toFixed(2)}
                        </p>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => handleUpdateQuantity(item.productId, -1)}
                            disabled={quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="fw-semibold">{quantity}</span>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => handleUpdateQuantity(item.productId, 1)}
                          >
                            +
                          </Button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold" style={{ fontSize: '0.9rem' }}>
                            Total: ₹{total.toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleRemove(item.productId)}
                            title="Remove"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>

          <Card className="mt-4 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-3">🚚 Assign Delivery</h5>
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Customer Name</Form.Label>
                      <Form.Control
                        placeholder="Enter name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Delivery Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Enter delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Delivery Agent</Form.Label>
                  <Form.Select 
                    value={agent} 
                    onChange={(e) => setAgent(e.target.value)}
                    required
                  >
                    <option value="">Select an agent</option>
                    {deliveryAgents.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4 className="fw-bold">Subtotal: ₹{subtotal.toFixed(2)}</h4>
            <Button
              size="lg"
              variant="success"
              onClick={handleCheckout}
              disabled={!customerName || !address || !deliveryDate || !agent || cart.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered dialogClassName="modal-sm">
        <Modal.Header closeButton className="py-2">
          <Modal.Title className="d-flex align-items-center gap-2">
            <span className="text-success">✅</span>
            <span style={{ fontSize: '1rem' }}>Order Confirmation</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-2 small">
          <p className="mb-2">
            <strong>Customer:</strong> {customerName}
          </p>
          <p className="mb-2">
            <strong>Agent:</strong> {agent}
          </p>
          <p className="mb-2">
            <strong>Delivery Date:</strong> {deliveryDate}
          </p>
          <p className="mb-2">
            <strong>Address:</strong> {address}
          </p>
          <p className="mb-0">
            <strong>Total:</strong> ₹{subtotal.toFixed(2)}
          </p>
        </Modal.Body>
        <Modal.Footer className="py-2">
          <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" size="sm" onClick={handleConfirmOrder}>
            Confirm Order
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cart;