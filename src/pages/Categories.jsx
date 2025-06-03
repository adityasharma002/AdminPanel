import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Button, CardContent, Grid, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, IconButton,
  Paper, Stack, Chip, useTheme, alpha, CircularProgress, InputAdornment
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Category as CategoryIcon, Close as CloseIcon,
  Visibility as ViewIcon, Business as BusinessIcon,
  CloudUpload as CloudUploadIcon, Image as ImageIcon,
  Search as SearchIcon, Clear as ClearIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CardDesign from '../components/CardDesign';

const API_BASE = 'https://logistic-project-backend.onrender.com/api/categories';

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(6),
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  maxWidth: '600px',
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.grey[300],
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.grey[50],
      borderColor: theme.palette.grey[400],
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.common.white,
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}`,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: theme.spacing(1.75),
    fontSize: '15px',
  },
  '& .MuiInputLabel-outlined': {
    fontSize: '15px',
    transform: 'translate(14px, 14px) scale(1)',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -8px) scale(0.75)',
    },
  },
  '& .MuiInputAdornment-root': {
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  width: '32px',
  height: '32px',
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[200]}`,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  }
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: '500',
  padding: theme.spacing(0.75, 2),
  fontSize: '14px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  }
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: '500',
  padding: theme.spacing(0.5, 1.5),
  fontSize: '13px',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[200]}`,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    borderColor: theme.palette.grey[300],
  }
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme.palette.grey[200]}`,
  }
}));

const EmptyStateContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6, 4),
  textAlign: 'center',
  borderRadius: '16px',
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[200]}`,
  boxShadow: 'none',
}));

const LoaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh',
  opacity: 1,
  transition: 'opacity 0.3s ease-in-out',
  '&.fade-out': {
    opacity: 0,
  },
}));

const ImageUploadContainer = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.grey[300]}`,
  borderRadius: '12px',
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: theme.palette.grey[50],
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  '&.dragover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  }
}));

const PreviewImage = styled('img')({
  width: '100%',
  maxHeight: '200px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginTop: '16px',
});

const Categories = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE);
      const categoriesData = response.data.map(category => ({
        id: category.categoryId,
        name: category.categoryName,
        imageUrl: category.imageUrl
      }));
      setCategories(categoriesData);
      setSearchTerm('');
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('categoryName', categoryName);
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      if (isEditing) {
        const response = await axios.put(`${API_BASE}/${editCategoryId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        setCategories(prev =>
          prev.map(cat =>
            cat.id === editCategoryId 
              ? { 
                  ...cat, 
                  name: categoryName,
                  imageUrl: response.data.imageUrl || cat.imageUrl
                } 
              : cat
          )
        );
      } else {
        const response = await axios.post(`${API_BASE}/category`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const newCategory = {
          id: response.data.categoryId,
          name: response.data.categoryName,
          imageUrl: response.data.imageUrl
        };
        setCategories(prev => [...prev, newCategory]);
      }
      
      handleModalClose();
    } catch (err) {
      console.error('Error saving category:', err);
      alert(`Error saving category: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
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

  const handleModalClose = () => {
    setShowModal(false);
    setCategoryName('');
    setSelectedImage(null);
    setPreviewUrl('');
    setIsEditing(false);
    setEditCategoryId(null);
  };

  const handleViewProducts = (categoryId, categoryName) => {
    navigate(`/products/${categoryId}`, {
      state: { id: categoryId, name: categoryName }
    });
  };

  const handleEditCategory = (category) => {
    setIsEditing(true);
    setEditCategoryId(category.id);
    setCategoryName(category.name || '');
    setPreviewUrl(category.imageUrl || '');
    setSelectedImage(null);
    setShowModal(true);
  };

  return (
    <PageContainer maxWidth="xl">
      <HeaderContainer>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography
              variant="h4"
              fontWeight="600"
              color="text.primary"
              sx={{ mb: 0.5, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
            >
              Categories
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: '15px' }}
            >
              Organize and manage your product categories with images
            </Typography>
          </Box>
          <SearchBar
            label="Search Categories"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'grey.500' }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchTerm('')} edge="end">
                    <ClearIcon sx={{ color: 'grey.500' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <PrimaryButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setIsEditing(false);
            setCategoryName('');
            setSelectedImage(null);
            setPreviewUrl('');
            setShowModal(true);
          }}
          sx={{ minWidth: '140px', flexShrink: 0 }}
        >
          Add Category
        </PrimaryButton>
      </HeaderContainer>

      {loading && (
        <LoaderContainer>
          <CircularProgress size={60} thickness={4} />
        </LoaderContainer>
      )}

      {!loading && filteredCategories.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Chip
            icon={<BusinessIcon />}
            label={`${filteredCategories.length} ${filteredCategories.length === 1 ? 'Category' : 'Categories'}`}
            variant="outlined"
            sx={{
              borderColor: 'grey.300',
              backgroundColor: 'grey.50',
              '& .MuiChip-label': { fontWeight: '500' }
            }}
          />
        </Box>
      )}

      {!loading && filteredCategories.length === 0 && (
        <EmptyStateContainer>
          <CategoryIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" fontWeight="500" color="text.primary" gutterBottom>
            {searchTerm ? 'No matching categories found' : 'No categories yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm ? 'Try a different search term' : 'Create your first category to start organizing products'}
          </Typography>
          {!searchTerm && (
            <PrimaryButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setIsEditing(false);
                setCategoryName('');
                setSelectedImage(null);
                setPreviewUrl('');
                setShowModal(true);
              }}
            >
              Create Category
            </PrimaryButton>
          )}
        </EmptyStateContainer>
      )}

      {!loading && filteredCategories.length > 0 && (
        <Grid container spacing={3} justifyContent="center">
          {filteredCategories.map((cat) => (
            <Grid item key={cat.id}>
              <CardDesign
                imageUrl={cat.imageUrl}
                placeholderText="No Image"
                placeholderIcon={<ImageIcon sx={{ fontSize: 36, mb: 1 }} />}
                actions={
                  <>
                    <Typography variant="caption" color="text.secondary">
                      Manage
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <ActionIconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCategory(cat);
                        }}
                      >
                        <EditIcon sx={{ fontSize: '16px' }} />
                      </ActionIconButton>
                      <ActionIconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete "${cat.name}"?`)) {
                            handleDelete(cat.id);
                          }
                        }}
                        sx={{
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                            borderColor: theme.palette.error.main,
                            color: theme.palette.error.main,
                          }
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: '16px' }} />
                      </ActionIconButton>
                    </Stack>
                  </>
                }
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography
                    variant="h6"
                    fontWeight="500"
                    color="text.primary"
                    sx={{
                      mb: 0.5,
                      fontSize: '15px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: '12px', mb: 1.5 }}
                  >
                    Product category
                  </Typography>
                  <SecondaryButton
                    fullWidth
                    startIcon={<ViewIcon sx={{ fontSize: '16px' }} />}
                    onClick={() => handleViewProducts(cat.id, cat.name)}
                  >
                    View Products
                  </SecondaryButton>
                </CardContent>
              </CardDesign>
            </Grid>
          ))}
        </Grid>
      )}

      <StyledDialog
        open={showModal}
        onClose={handleModalClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight="500">
              {isEditing ? 'Edit Category' : 'Create New Category'}
            </Typography>
            <IconButton
              onClick={handleModalClose}
              size="small"
              sx={{ color: 'grey.500' }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            variant="outlined"
            size="medium"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              }
            }}
          />

          <Typography variant="subtitle2" color="text.primary" sx={{ mb: 2 }}>
            Category Image
          </Typography>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
            id="image-upload"
          />

          <ImageUploadContainer
            onClick={() => document.getElementById('image-upload').click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {previewUrl ? (
              <Box>
                <PreviewImage src={previewUrl} alt="Preview" />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Click to change image
                </Typography>
              </Box>
            ) : (
              <Box>
                <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="body1" color="text.primary" gutterBottom>
                  Click to upload or drag and drop
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PNG, JPG, JPEG up to 10MB
                </Typography>
              </Box>
            )}
          </ImageUploadContainer>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
          <Button
            onClick={handleModalClose}
            variant="outlined"
            disabled={uploading}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              borderColor: 'grey.300',
              color: 'text.primary',
            }}
          >
            Cancel
          </Button>
          <PrimaryButton
            onClick={handleSaveCategory}
            variant="contained"
            disabled={!categoryName.trim() || uploading}
          >
            {uploading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
          </PrimaryButton>
        </DialogActions>
      </StyledDialog>
    </PageContainer>
  );
};

export default Categories;