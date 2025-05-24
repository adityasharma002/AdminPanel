
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/authStore';

const deliveryAgents = ['Ramesh', 'Suresh', 'Priya'];

const CartPage = () => {
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const { user } = useAuthStore();

  const [customerName, setCustomerName] = useState(user?.username || '');
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [agent, setAgent] = useState('');
  const [showModal, setShowModal] = useState(false);

  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity);
    return sum + (isNaN(price) || isNaN(quantity) ? 0 : price * quantity);
  }, 0);

  const handleCheckout = () => {
    // Implement checkout logic here (e.g., API call)
    setShowModal(true);
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">🛒 Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <Alert variant="info">Your cart is currently empty.</Alert>
      ) : (
        <>
          <Row xs={1} md={2} className="g-4">
            {cart.map((item) => {
              const price = Number(item.price);
              const quantity = Number(item.quantity);
              const total = isNaN(price) || isNaN(quantity) ? 0 : price * quantity;

              return (
                <Col key={item.id} xs={12} sm={6} md={4} className="mb-4">
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
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid"
                          style={{ maxHeight: '80px', objectFit: 'contain' }}
                        />
                      </div>

                      <div className="flex-grow-1">
                        <h6 className="fw-semibold mb-1">{item.name}</h6>
                        <p className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                          Price: ₹{isNaN(price) ? 'N/A' : price}
                        </p>

                        <div className="d-flex align-items-center gap-2 mb-2">
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            -
                          </Button>
                          <span className="fw-semibold">{quantity}</span>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            +
                          </Button>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold" style={{ fontSize: '0.9rem' }}>
                            Total: ₹{total}
                          </span>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => removeFromCart(item.id)}
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
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    placeholder="Enter delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Delivery Agent</Form.Label>
                  <Form.Select value={agent} onChange={(e) => setAgent(e.target.value)}>
                    <option value="">Select an agent</option>
                    {deliveryAgents.map((a) => (
                      <option key={a}>{a}</option>
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
              disabled={!customerName || !address || !deliveryDate || !agent}
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
            <span style={{ fontSize: '1rem' }}>Order Assigned</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="py-2 small">
          <p className="mb-2">
            <strong>Customer:</strong> {customerName}
          </p>
          <p className="mb-2">
            <strong>Agent:</strong> {agent}
          </p>
          <p className="mb-0">
            <strong>Total:</strong> ₹{subtotal.toFixed(2)}
          </p>
        </Modal.Body>

        <Modal.Footer className="py-2">
          <Button variant="success" size="sm" onClick={() => setShowModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CartPage;
