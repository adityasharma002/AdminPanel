import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';

const API_BASE = 'https://logistic-project-backend.onrender.com/api/categories';

const gradientColors = [
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  

  const getCategoryInitials = (category) => {
    return category.name?.substring(0, 2).toUpperCase() || '';
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE);
      const apiData = response.data;

      const categoriesData = apiData.map(category => ({
        id: category.categoryId,
        name: category.categoryName
      }));

      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveCategory = async () => {
    if (!categoryName) return;

    try {
      if (isEditing) {
        await axios.put(`${API_BASE}/${editCategoryId}`, {
          categoryName: categoryName
        });

        setCategories(prev =>
          prev.map(cat =>
            cat.id === editCategoryId ? { ...cat, name: categoryName } : cat
          )
        );
      } else {
        const response = await axios.post(API_BASE, {
          categoryName: categoryName
        });

        const newCategory = response.data;
        const newCategoryId = newCategory.categoryId;

        if (newCategoryId !== undefined && newCategoryId !== null) {
          const categoryToAdd = {
            id: newCategoryId,
            name: categoryName
          };
          setCategories(prev => [...prev, categoryToAdd]);
        }
      }

      setShowModal(false);
      setCategoryName('');
      setIsEditing(false);
      setEditCategoryId(null);
    } catch (err) {
      console.error('Error saving category:', err);
      alert(`Error saving category: ${err.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Error deleting category. Please try again.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold m-0" style={{ fontSize: '2rem' }}>Categories</h2>

            <Button
              variant="primary"
              onClick={() => {
                setIsEditing(false);
                setCategoryName('');
                setShowModal(true);
              }}
              className="d-flex align-items-center"
              style={{
                borderRadius: '8px',
                padding: '8px 16px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                background: 'linear-gradient(145deg, #4361ee, #3a56d4)',
                border: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
              }}
            >
              + Add Category
            </Button>
          </div>

          <div className="bg-light p-2 px-3 rounded-3 mb-4">
            <p className="text-muted m-0">
              <small>Manage your product categories to organize inventory efficiently</small>
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading categories...</p>
        </div>
      )}

      {!loading && categories.length === 0 && (
        <div className="text-center py-5">
          <p>No categories found. Add a new category to get started.</p>
        </div>
      )}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {categories.map((cat, index) => (
          <div key={cat.id} className="col">
            <div
              className="card h-100 border-0"
              onClick={() => navigate(`/products/${cat.id}`, { state: cat })}
              style={{
                cursor: 'pointer',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                background: gradientColors[index % gradientColors.length],
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                color: '#fff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
              }}
            >
              <div className="card-body d-flex flex-column align-items-center justify-content-center p-4" style={{ minHeight: '180px' }}>
                <div
                  className="icon-wrapper mb-4 d-flex align-items-center justify-content-center"
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
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  {getCategoryInitials(cat)}
                </div>
                <h4 className="card-title text-center fw-bold mb-1" style={{ color: '#fff' }}>
                  {cat.name}
                </h4>
              </div>
              <div className="card-footer bg-transparent d-flex justify-content-end border-0 pt-0 pb-3 px-3">
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
                    setEditCategoryId(cat.id);
                    setCategoryName(cat.name || '');
                    setShowModal(true);
                  }}
                >
                  <FaEdit style={{ marginRight: '5px' }} /> Edit
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
                    if (window.confirm(`Are you sure you want to delete "${cat.name}"?`)) {
                      handleDelete(cat.id);
                    }
                  }}
                >
                  <FaTrash style={{ marginRight: '5px' }} /> Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: '1px solid #f0f0f0' }}>
          <Modal.Title>{isEditing ? 'Edit Category' : 'Add New Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                style={{
                  borderRadius: '8px',
                  padding: '12px 15px',
                  border: '1px solid #e0e0e0',
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '1px solid #f0f0f0' }}>
          <Button variant="light" onClick={() => setShowModal(false)} style={{ borderRadius: '8px' }}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveCategory}
            style={{
              borderRadius: '8px',
              padding: '8px 16px',
              background: 'linear-gradient(145deg, #4361ee, #3a56d4)',
              border: 'none',
            }}
          >
            {isEditing ? 'Update' : 'Add'} Category
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Categories;
