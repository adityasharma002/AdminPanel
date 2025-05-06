import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import useProductStore from '../store/productStore';
import useCartStore from '../store/useCartStore';

const Products = () => {
  const { categoryId } = useParams();
  const { state: categoryFromNav } = useLocation();

  const { allProducts, updateCategoryProducts } = useProductStore();
  const [currentProducts, setCurrentProducts] = useState([]);
  const [category, setCategory] = useState(categoryFromNav || null);

  const [showModal, setShowModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const cartItems = useCartStore((state) => state.cart);

  useEffect(() => {
    if (categoryId) {
      setCurrentProducts(allProducts[categoryId] || []);
    } else {
      const combined = Object.values(allProducts).flat();
      setCurrentProducts(combined);
    }
  }, [allProducts, categoryId]);

  const handleAddOrEditProduct = () => {
    if (!productName || !productPrice || (!productImage && !editId)) return;

    const imageUrl = productImage
      ? URL.createObjectURL(productImage)
      : currentProducts.find((p) => p.id === editId)?.image;

    const newProduct = {
      id: editId || Date.now(),
      name: productName,
      price: parseFloat(productPrice),
      image: imageUrl,
      categoryId: categoryId || 'global',
    };

    const updatedList = editId
      ? currentProducts.map((p) => (p.id === editId ? newProduct : p))
      : [...currentProducts, newProduct];

    const key = categoryId || 'global';
    updateCategoryProducts(key, updatedList);

    setProductName('');
    setProductPrice('');
    setProductImage(null);
    setEditId(null);
    setShowModal(false);
  };

  const handleEdit = (product) => {
    setProductName(product.name);
    setProductPrice(product.price);
    setEditId(product.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const filtered = currentProducts.filter((p) => p.id !== id);
    const key = categoryId || 'global';
    updateCategoryProducts(key, filtered);
  };

  const updateCart = (product, action) => {
    if (action === 'inc') {
      addToCart(product);
    } else {
      updateQuantity(product.id, -1);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold text-center mb-4">
        {categoryId ? `${category?.name || 'Category'} - Products` : 'All Products'}
      </h3>

      <div className="d-flex flex-wrap gap-4 justify-content-center">
        {currentProducts.map((prod) => {
          const inCartQty = cartItems.find((i) => i.id === prod.id)?.quantity || 0;

          return (
            <div key={prod.id} className="card shadow position-relative" style={{ width: '200px' }}>
              <img
                src={prod.image}
                alt={prod.name}
                style={{
                  height: '130px',
                  objectFit: 'cover',
                  borderTopLeftRadius: '0.5rem',
                  borderTopRightRadius: '0.5rem',
                }}
                className="card-img-top"
              />
              <div className="card-body text-center p-2">
                <h6 className="mb-1 fw-semibold">{prod.name}</h6>
                <small className="text-muted">₹{prod.price.toFixed(2)}</small>
                <div className="mt-2">
                  {inCartQty === 0 ? (
                    <Button
                      size="sm"
                      variant="warning"
                      className="rounded-pill px-3"
                      onClick={() => updateCart(prod, 'inc')}
                    >
                      Add
                    </Button>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center gap-2 border rounded-pill py-1 px-2 bg-light">
                      <Button size="sm" variant="link" onClick={() => updateCart(prod, 'dec')}>
                        <FaTrash />
                      </Button>
                      <span>{inCartQty}</span>
                      <Button size="sm" variant="link" onClick={() => updateCart(prod, 'inc')}>
                        <FaPlus />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                <Button size="sm" variant="light" onClick={() => handleEdit(prod)}>
                  <FaEdit />
                </Button>
                <Button size="sm" variant="light" onClick={() => handleDelete(prod.id)}>
                  <FaTrash />
                </Button>
              </div>
            </div>
          );
        })}

        <Button
          variant="light"
          className="d-flex align-items-center justify-content-center shadow"
          style={{ width: '80px', height: '80px', fontSize: '1.5rem' }}
          onClick={() => {
            setEditId(null);
            setProductName('');
            setProductPrice('');
            setProductImage(null);
            setShowModal(true);
          }}
        >
          <FaPlus />
        </Button>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Product Price (₹)</Form.Label>
            <Form.Control
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>{editId ? 'Change Image (optional)' : 'Product Image'}</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setProductImage(e.target.files[0])}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleAddOrEditProduct}>{editId ? 'Update' : 'Add'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;
