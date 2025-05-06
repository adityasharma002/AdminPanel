import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import useCategoriesStore from '../store/categoriesStore';

const Categories = () => {
  const { categories, addCategory, deleteCategory } = useCategoriesStore();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const navigate = useNavigate();

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAddCategory = async () => {
    if (!categoryName || !categoryImage) return;

    const base64Image = await convertToBase64(categoryImage);
    const newCategory = {
      id: Date.now(),
      name: categoryName,
      image: base64Image,
    };

    addCategory(newCategory);
    setCategoryName('');
    setCategoryImage(null);
    setShowCategoryModal(false);
  };

  return (
    <div className="container py-4">
      <h2 className="text-center fw-bold mb-4">Categories</h2>
      <div className="d-flex flex-wrap gap-4 justify-content-center">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="card shadow category-card"
            style={{ width: '220px', cursor: 'pointer', position: 'relative' }}
            onClick={() => navigate(`/products/${cat.id}`, { state: cat })}
          >
            <img
              src={cat.image}
              alt={cat.name}
              style={{
                height: '140px',
                objectFit: 'cover',
                borderTopLeftRadius: '0.5rem',
                borderTopRightRadius: '0.5rem',
              }}
              className="card-img-top"
            />
            <div className="card-body text-center">
              <h6 className="card-title mb-2 fw-semibold">{cat.name}</h6>
              <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                <Button size="sm" variant="light">
                  <FaEdit />
                </Button>
                <Button
                  size="sm"
                  variant="light"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCategory(cat.id);
                  }}
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="light"
          className="d-flex align-items-center justify-content-center shadow"
          style={{ width: '80px', height: '80px', fontSize: '2rem' }}
          onClick={() => setShowCategoryModal(true)}
        >
          +
        </Button>
      </div>

      {/* Add Category Modal */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              placeholder="Enter name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Category Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setCategoryImage(e.target.files[0])}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddCategory}>Add</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Categories;
