// Products.js

import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { MdOutlineShoppingCart } from 'react-icons/md'; // modern cart icon

const API_BASE = 'https://logistic-project-backend.onrender.com/api';

const gradientColors = [
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
];

const Products = () => {
  const { categoryId } = useParams();
  const location = useLocation();
  const isAllProductsPage = !categoryId;

  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [editProductId, setEditProductId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const endpoint = isAllProductsPage
        ? `${API_BASE}/products`
        : `${API_BASE}/products/category/${categoryId}`;
      const res = await axios.get(endpoint);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  const handleSave = async () => {
    if (!productName || !description || !price) return;

    try {
      if (isEditing) {
        await axios.put(`${API_BASE}/products/${editProductId}`, {
          productName,
          description,
          price,
          categoryId: parseInt(categoryId)
        });

        setProducts(prev =>
          prev.map(p =>
            p.productId === editProductId
              ? { ...p, productName, description, price }
              : p
          )
        );
      } else {
        const res = await axios.post(`${API_BASE}/products`, {
          productName,
          description,
          price,
          categoryId: parseInt(categoryId)
        });

        setProducts(prev => [...prev, res.data]);
      }

      setShowModal(false);
      setProductName('');
      setDescription('');
      setPrice('');
      setEditProductId(null);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/products/${id}`);
      setProducts(products.filter(p => p.productId !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const toggleQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] ? null : 1,
    }));
  };

  const updateQuantity = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col d-flex justify-content-between align-items-center">
          <h2 className="fw-bold m-0" style={{ fontSize: '2rem' }}>
            {isAllProductsPage
              ? 'Products'
              : `${location.state?.name || 'Category'} - Products`}
          </h2>

          {!isAllProductsPage && (
            <Button
              variant="primary"
              onClick={() => {
                setIsEditing(false);
                setProductName('');
                setDescription('');
                setPrice('');
                setShowModal(true);
              }}
              style={{
                borderRadius: '8px',
                padding: '8px 16px',
                background: 'linear-gradient(145deg, #4361ee, #3a56d4)',
                border: 'none',
              }}
            >
              + Add Product
            </Button>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-2">Loading products...</p>
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-5">
          <p>No products found.</p>
        </div>
      )}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {products.map((product, index) => (
          <div key={product.productId} className="col">
            <div
              className="card h-100 border-0"
              style={{
                cursor: 'pointer',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                background: gradientColors[index % gradientColors.length],
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                color: '#fff',
              }}
            >
              <div className="card-body d-flex flex-column align-items-center justify-content-center p-4" style={{ minHeight: '180px' }}>
                <div
                  className="icon-wrapper mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: 'inset 5px 5px 10px rgba(255,255,255,0.5), inset -5px -5px 10px rgba(255,255,255,0.3)',
                    color: '#fff',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                  }}
                >
                  {product.productName.slice(0, 2)}
                </div>
                <h5 className="fw-bold text-center mb-2">{product.productName}</h5>
                <p className="text-center fw-semibold m-0">₹ {product.price}</p>
              </div>

              <div className="card-footer bg-transparent d-flex justify-content-between align-items-center border-0 px-3 pb-3">
                {/* Unique Cart Button */}
                <div
                  onClick={() => toggleQuantity(product.productId)}
                  style={{
                    cursor: 'pointer',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: '0.3s ease',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  }}
                  className="cart-icon-button"
                >
                  <MdOutlineShoppingCart size={22} color="#fff" />
                </div>

                {/* Edit/Delete Buttons (only for category view) */}
                {!isAllProductsPage && (
                  <div className="d-flex">
                    <Button
                      size="sm"
                      variant="light"
                      className="me-2"
                      style={{
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.3)',
                        color: '#fff',
                        border: 'none',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                        setEditProductId(product.productId);
                        setProductName(product.productName);
                        setDescription(product.description);
                        setPrice(product.price);
                        setShowModal(true);
                      }}
                    >
                      <FaEdit /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      style={{
                        borderRadius: '8px',
                        background: 'rgba(255,0,0,0.3)',
                        color: '#fff',
                        border: 'none',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete ${product.productName}?`)) {
                          handleDelete(product.productId);
                        }
                      }}
                    >
                      <FaTrash /> Delete
                    </Button>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {quantities[product.productId] && (
                <div className="d-flex justify-content-center align-items-center pb-3">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => updateQuantity(product.productId, -1)}
                    style={{
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      margin: '0 8px',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                    }}
                  >
                    -
                  </Button>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {quantities[product.productId]}
                  </span>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => updateQuantity(product.productId, 1)}
                    style={{
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      margin: '0 8px',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                    }}
                  >
                    +
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {isEditing ? 'Update' : 'Add'} Product
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;
