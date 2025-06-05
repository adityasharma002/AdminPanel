import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  IconButton,
  Stack,
  Divider,
  useMediaQuery,
  useTheme,
  Collapse,
} from '@mui/material';
import { Add, Edit, Delete, PersonAdd, Email, Phone, LocationOn, Close, ExpandMore } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCustomerStore from '../store/customerStore';

const Customer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { customers, fetchCustomers, addCustomer, updateCustomer, deleteCustomer } = useCustomerStore();
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    contactNumber: '',
    address: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCustomers();
      } catch (error) {
        toast.error('Failed to fetch customers. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    };
    fetchData();
  }, [fetchCustomers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.email || !form.contactNumber || !form.address) {
      toast.error('Please fill in all required fields.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      if (editMode && editingCustomerId) {
        await updateCustomer(editingCustomerId, form);
        toast.success('Customer updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        await addCustomer(form);
        toast.success('Customer added successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      setForm({ customerName: '', email: '', contactNumber: '', address: '' });
      setEditMode(false);
      setEditingCustomerId(null);
      setOpenModal(false);
    } catch (error) {
      toast.error('Failed to save customer. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleEdit = (customer) => {
    setForm({
      customerName: customer.customerName,
      email: customer.email,
      contactNumber: customer.contactNumber,
      address: customer.address,
    });
    setEditingCustomerId(customer.customerId);
    setEditMode(true);
    setOpenModal(true);
    toast.info(`Editing customer "${customer.customerName}"`, {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const handleDelete = (id) => {
    setCustomerToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCustomer(customerToDelete);
      setDeleteConfirmOpen(false);
      setCustomerToDelete(null);
      toast.success('Customer deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      setDeleteConfirmOpen(false);
      toast.error('Failed to delete customer. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleExpandRow = (customerId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [customerId]: !prev[customerId],
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 5 } }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: { xs: 2, sm: 4 },
          gap: { xs: 2, sm: 0 }
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 500,
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          👥 Customers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => {
            setForm({ customerName: '', email: '', contactNumber: '', address: '' });
            setEditMode(false);
            setEditingCustomerId(null);
            setOpenModal(true);
          }}
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.5 }
          }}
        >
          Add Customer
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        {(!Array.isArray(customers) || customers.length === 0) ? (
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center" 
            sx={{ 
              py: { xs: 2, sm: 3 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            No customers yet.
          </Typography>
        ) : (
          <Table sx={{ minWidth: { xs: 'auto', sm: 650 } }}>
            <TableHead sx={{ display: { xs: 'none', sm: 'table-header-group' } }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { sm: '0.875rem' } }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { sm: '0.875rem' } }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { sm: '0.875rem' } }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { sm: '0.875rem' } }}>Address</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { sm: '0.875rem' }, width: { sm: 120 } }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <React.Fragment key={customer.customerId}>
                  <TableRow
                    hover
                    sx={{
                      display: { xs: 'flex', sm: 'table-row' },
                      flexDirection: { xs: 'column', sm: 'row' },
                      borderBottom: { xs: `1px solid ${theme.palette.divider}`, sm: 'none' },
                      p: { xs: 1, sm: 0 },
                    }}
                  >
                    <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 1 } }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ display: { xs: 'flex', sm: 'none' } }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                            fontSize: { xs: '0.875rem' },
                          }}
                        >
                          {customer.customerName}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleExpandRow(customer.customerId)}
                        >
                          <ExpandMore
                            sx={{
                              transform: expandedRows[customer.customerId] ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s ease',
                              fontSize: { xs: '1rem' },
                            }}
                          />
                        </IconButton>
                      </Stack>
                      <Typography
                        sx={{
                          display: { xs: 'none', sm: 'block' },
                          fontSize: { sm: '0.875rem' },
                        }}
                      >
                        {customer.customerName}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 1 } }}>
                      <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {customer.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 1 }, display: { xs: 'none', sm: 'table-cell' } }}>
                      <Typography sx={{ fontSize: { sm: '0.875rem' } }}>
                        {customer.contactNumber}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 1 }, display: { xs: 'none', sm: 'table-cell' } }}>
                      <Typography sx={{ fontSize: { sm: '0.875rem' } }}>
                        {customer.address}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 1 }, display: { xs: 'none', sm: 'table-cell' } }}>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(customer)}
                          size="small"
                        >
                          <Edit sx={{ fontSize: { sm: '1rem' } }} />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(customer.customerId)}
                          size="small"
                        >
                          <Delete sx={{ fontSize: { sm: '1rem' } }} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ display: { xs: 'table-row', sm: 'none' } }}>
                    <TableCell sx={{ p: 0, borderBottom: 'none' }}>
                      <Collapse in={expandedRows[customer.customerId]} timeout="auto">
                        <Box sx={{ p: 2, bgcolor: theme.palette.grey[100] }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ fontWeight: 600, mb: 1, fontSize: '0.75rem' }}
                          >
                            Phone
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ mb: 1, fontSize: '0.75rem', color: 'text.secondary' }}
                          >
                            {customer.contactNumber}
                          </Typography>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ fontWeight: 600, mb: 1, fontSize: '0.75rem' }}
                          >
                            Address
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ mb: 1, fontSize: '0.75rem', color: 'text.secondary' }}
                          >
                            {customer.address}
                          </Typography>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ fontWeight: 600, mb: 1, fontSize: '0.75rem' }}
                          >
                            Actions
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              color="primary"
                              onClick={() => handleEdit(customer)}
                              size="small"
                            >
                              <Edit sx={{ fontSize: '1rem' }} />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(customer.customerId)}
                              size="small"
                            >
                              <Delete sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Stack>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="customer-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400, md: 500 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: { xs: 2, sm: 4 },
            borderRadius: 2,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: { xs: 2, sm: 3 } }}>
            <Typography 
              id="customer-modal-title" 
              variant="h6" 
              component="h2"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              {editMode ? 'Edit Customer' : 'Add New Customer'}
            </Typography>
            <IconButton
              onClick={() => setOpenModal(false)}
              size="small"
              sx={{ color: 'grey.500' }}
            >
              <Close sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
            </IconButton>
          </Stack>
          <form onSubmit={handleSubmit}>
            <Stack spacing={{ xs: 2, sm: 3 }}>
              <TextField
                label="Name"
                name="customerName"
                value={form.customerName}
                onChange={handleInputChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: <PersonAdd sx={{ mr: 1, color: 'text.secondary', fontSize: { xs: '1rem', sm: '1.25rem' } }} />,
                }}
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleInputChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary', fontSize: { xs: '1rem', sm: '1.25rem' } }} />,
                }}
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              />
              <TextField
                label="Phone"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleInputChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary', fontSize: { xs: '1rem', sm: '1.25rem' } }} />,
                }}
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              />
              <TextField
                label="Address"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary', fontSize: { xs: '1rem', sm: '1.25rem' } }} />,
                }}
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              />
            </Stack>
            <Divider sx={{ my: { xs: 2, sm: 3 } }} />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => setOpenModal(false)}
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {editMode ? 'Update' : 'Add'} Customer
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>

      <Modal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="delete-confirm-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: { xs: 2, sm: 4 },
            borderRadius: 2,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: { xs: 2, sm: 3 } }}>
            <Typography 
              id="delete-confirm-modal-title" 
              variant="h6" 
              component="h2"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Confirm Deletion
            </Typography>
            <IconButton
              onClick={() => setDeleteConfirmOpen(false)}
              size="small"
              sx={{ color: 'grey.500' }}
            >
              <Close sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
            </IconButton>
          </Stack>
          <Typography 
            variant="body1" 
            color="text.primary" 
            sx={{ 
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Are you sure you want to delete this customer? This action cannot be undone.
          </Typography>
          <Divider sx={{ my: { xs: 2, sm: 3 } }} />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => setDeleteConfirmOpen(false)}
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={confirmDelete}
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ 
          top: { xs: '60px', sm: '80px' },
          width: { xs: '90%', sm: 'auto' },
          maxWidth: { xs: '300px', sm: '400px' }
        }}
        toastStyle={{ 
          zIndex: 10000,
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}
      />
    </Container>
  );
};

export default Customer;