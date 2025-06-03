import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Avatar,
  Chip,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as DeliveryIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  DateRange as DateIcon,
  CheckCircle as CheckIcon,
  ShoppingBag as BagIcon
} from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify'; // Added react-toastify imports
import 'react-toastify/dist/ReactToastify.css'; // Added CSS import for react-toastify
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/authStore';
import useCustomerStore from '../store/customerStore';
import { useAssignDeliveryStore } from '../store/assignDeliveryStore';

const API_BASE = 'https://logistic-project-backend.onrender.com/api';

const Cart = () => {
  // Store hooks
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getCartItems = useCartStore((state) => state.getCartItems);
  const isLoading = useCartStore((state) => state.isLoading);
  const error = useCartStore((state) => state.error);
  const clearError = useCartStore((state) => state.clearError);
  const { assignDelivery } = useAssignDeliveryStore();
  const { customers, fetchCustomers } = useCustomerStore();
  const clearCart = useCartStore((state) => state.clearCart);

  // State
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAgents, setDeliveryAgents] = useState([]);
  const { token, user } = useAuthStore();
  const [customerName, setCustomerName] = useState(user?.username || '');
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [agent, setAgent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Effects
  useEffect(() => {
    if (token) {
      getCartItems();
      fetchCustomers();
    }
  }, [token, getCartItems, fetchCustomers]);

  useEffect(() => {
    return () => {
      if (error) {
        clearError();
      }
    };
  }, [error, clearError]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/deliveryboys`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        setDeliveryAgents(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error('Failed to fetch delivery agents:', err);
        setDeliveryAgents([]);
      }
    };
    if (token) {
      fetchAgents();
    }
  }, [token]);

  // Calculations
  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);

  // Handlers
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
      toast.error('Please fill in all delivery details before proceeding.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      toast.error('Please enter a valid email address.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    if (!/^\d{10}$/.test(customerPhone)) {
      toast.error('Please enter a valid 10-digit phone number.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    setShowModal(true);
  };

  const handleConfirmOrder = async () => {
    setIsCheckoutLoading(true);
    const payload = {
      cartItems: cart.map((item) => ({
        cartItemId: item.cartItemId
      })),
      deliveryBoyId: Number(agent),
      customerName,
      customerNumber: customerPhone,
      customerEmail,
      deliveryDate: new Date(deliveryDate).toISOString(),
      status: 'ASSIGNED',
      deliveryAddress: address,
    };

    try {
      await assignDelivery(payload);
      try {
        await clearCart();
        console.log('Cart cleared successfully after order placement');
      } catch (clearError) {
        console.warn('Cart clear failed, but order was placed successfully:', clearError);
      }
      setCustomerName(user?.username || '');
      setCustomerEmail('');
      setCustomerPhone('');
      setAddress('');
      setDeliveryDate('');
      setAgent('');
      setShowModal(false);
      toast.success('Order assigned successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      console.error('Failed to place order:', err);
      toast.error('Failed to place order. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        flexDirection="column"
      >
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
          Loading your cart...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <ShoppingCartIcon sx={{ fontSize: 28, color: 'primary.main', mr: 1 }} />
        <Typography variant="h4" fontWeight="600" color="text.primary">
          Shopping Cart
        </Typography>
        <Chip
          label={`${cart.length} ${cart.length === 1 ? 'item' : 'items'}`}
          size="small"
          sx={{ ml: 2 }}
        />
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="warning"
          onClose={clearError}
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {cart.length === 0 ? (
        <Paper
          elevation={1}
          sx={{
            p: 6,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <BagIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start shopping to add items to your cart
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Cart Items Table */}
          <Paper elevation={1} sx={{ mb: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Total</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map((item, index) => {
                    const uniqueKey = `${item.productId}-${index}`;
                    const price = Number(item.price) || 0;
                    const quantity = Number(item.quantity) || 0;
                    const total = price * quantity;

                    return (
                      <TableRow key={uniqueKey} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                              src={item.image}
                              sx={{
                                width: 50,
                                height: 50,
                                bgcolor: 'primary.light'
                              }}
                            >
                              {(item.name || item.productName || 'P').slice(0, 2)}
                            </Avatar>
                            <Typography variant="body1" fontWeight="500">
                              {item.name || item.productName || 'Unknown Product'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body1">
                            ₹{price.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateQuantity(item.productId, -1)}
                              disabled={quantity <= 1}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center' }}>
                              {quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateQuantity(item.productId, 1)}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body1" fontWeight="600">
                            ₹{total.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Remove item">
                            <IconButton
                              onClick={() => handleRemove(item.productId)}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Delivery Assignment */}
          <Card elevation={1} sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <DeliveryIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" fontWeight="600">
                  Delivery Details
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Customer</InputLabel>
                    <Select
                      value={customerName}
                      label="Customer"
                      onChange={(e) => {
                        const selected = e.target.value;
                        setCustomerName(selected);
                        const customer = customers.find(c => c.customerName === selected);
                        if (customer) {
                          setAddress(customer.address);
                          setCustomerEmail(customer.email);
                          setCustomerPhone(customer.contactNumber);
                        }
                      }}
                    >
                      {customers.map((cust) => (
                        <MenuItem key={cust.customerId || cust.id} value={cust.customerName}>
                          {cust.customerName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    error={customerEmail && !/\S+@\S+\.\S+/.test(customerEmail)}
                    helperText={customerEmail && !/\S+@\S+\.\S+/.test(customerEmail) ? "Invalid email format" : ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    error={customerPhone && !/^\d{10}$/.test(customerPhone)}
                    helperText={customerPhone && !/^\d{10}$/.test(customerPhone) ? "Enter a valid 10-digit phone number" : ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Delivery Date"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Delivery Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Delivery Agent</InputLabel>
                    <Select
                      value={agent}
                      label="Delivery Agent"
                      onChange={(e) => setAgent(e.target.value)}
                    >
                      {deliveryAgents.map((d) => (
                        <MenuItem key={d.userId} value={d.userId}>
                          {d.username}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Checkout Section */}
          <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Box>
                <Typography variant="h5" fontWeight="600" color="primary.main">
                  Total: ₹{subtotal.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {cart.length} items in cart
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={handleCheckout}
                disabled={!customerName || !address || !deliveryDate || !agent || cart.length === 0 || isCheckoutLoading}
                startIcon={isCheckoutLoading ? <CircularProgress size={20} /> : <CheckIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  minWidth: 160
                }}
              >
                {isCheckoutLoading ? 'Processing...' : 'Assign Order'}
              </Button>
            </Stack>
          </Paper>
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <CheckIcon color="success" />
            <Typography variant="h6">Confirm Order</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1" fontWeight="500">Customer:</Typography>
              <Typography variant="body1">{customerName}</Typography>
            </Box>
            <Divider />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1" fontWeight="500">Agent:</Typography>
              <Typography variant="body1">
                {deliveryAgents.find(a => a.userId == agent)?.username || agent}
              </Typography>
            </Box>
            <Divider />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1" fontWeight="500">Delivery Date:</Typography>
              <Typography variant="body1">{deliveryDate}</Typography>
            </Box>
            <Divider />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Typography variant="body1" fontWeight="500">Address:</Typography>
              <Typography variant="body1" textAlign="right" sx={{ maxWidth: '60%' }}>
                {address}
              </Typography>
            </Box>
            <Divider />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" fontWeight="600">Total:</Typography>
              <Typography variant="h6" fontWeight="600" color="success.main">
                ₹{subtotal.toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowModal(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmOrder}
            variant="contained"
            disabled={isCheckoutLoading}
            startIcon={isCheckoutLoading ? <CircularProgress size={16} /> : null}
          >
            {isCheckoutLoading ? 'Processing...' : 'Confirm Order'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add ToastContainer for react-toastify */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ top: '80px' }} // Adjusts the top position to avoid overlapping with the header
        toastStyle={{ zIndex: 10000 }} // Ensures the toast is above the header
      />
    </Container>
  );
};

export default Cart;