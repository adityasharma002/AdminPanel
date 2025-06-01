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
  Fade,
  Slide,
  Zoom,
  Backdrop,
  useTheme,
  alpha,
  FormControl,
  InputLabel,
  Select,
  Fab,
  Badge,
  Tooltip
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
import { styled } from '@mui/material/styles';

import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/authStore';
import useCustomerStore from '../store/customerStore';
import { useAssignDeliveryStore } from '../store/assignDeliveryStore';

const API_BASE = 'https://logistic-project-backend.onrender.com/api';

// Styled components for modern UI
const GradientCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: 8,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  }
}));

const ProductCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  background: theme.palette.background.paper,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
  }
}));

const GlassmorphismDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 8,
    background: `rgba(255, 255, 255, 0.95)`,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.1)}`,
  }
}));

const ModernFab = styled(Fab)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
    transform: 'scale(1.1)',
  },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const Cart = () => {
  const theme = useTheme();
  
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
      alert('Please fill in all delivery details before proceeding.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!/^\d{10}$/.test(customerPhone)) {
      alert('Please enter a valid 10-digit phone number.');
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
      alert('Order placed successfully! Your cart has been cleared.');
    } catch (err) {
      console.error('Failed to place order:', err);
      alert('Failed to place order. Please try again.');
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
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Loading your cart...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={4}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
          <ShoppingCartIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Shopping Cart
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </Typography>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Fade in={!!error}>
          <Alert 
            severity="warning" 
            onClose={clearError}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {error}
          </Alert>
        </Fade>
      )}

      {cart.length === 0 ? (
        <Zoom in={cart.length === 0}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 6, 
              textAlign: 'center', 
              borderRadius: 8,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, mx: 'auto', mb: 2 }}>
              <BagIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" gutterBottom fontWeight="medium">
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Start shopping to add items to your cart
            </Typography>
          </Paper>
        </Zoom>
      ) : (
        <>
          {/* Cart Items */}
          {/* Cart Items */}
<Grid container spacing={3} mb={4}>
  {cart.map((item, index) => {
    const uniqueKey = `${item.productId}-${index}`;
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const total = price * quantity;

    return (
      <Grid item xs={12} sm={6} md={4} key={uniqueKey}>
        <Slide in={true} direction="up" timeout={300 + index * 100}>
          <ProductCard>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="flex-start" gap={2}>
                <Avatar
                  src={item.image}
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  {(item.name || item.productName || 'P').slice(0, 2)}
                </Avatar>
                
                <Box flex={1}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {item.name || item.productName || 'Unknown Product'}
                  </Typography>
                  
                  <Chip 
                    label={`₹${price.toFixed(2)}`}
                    color="primary"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <IconButton 
                      size="small"
                      onClick={() => handleUpdateQuantity(item.productId, -1)}
                      disabled={quantity <= 1}
                      sx={{ 
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    
                    <Typography variant="h6" fontWeight="bold" mx={2}>
                      {quantity}
                    </Typography>
                    
                    <IconButton 
                      size="small"
                      onClick={() => handleUpdateQuantity(item.productId, 1)}
                      sx={{ 
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.2) }
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      ₹{total.toFixed(2)}
                    </Typography>
                    
                    <Tooltip title="Remove item">
                      <IconButton 
                        onClick={() => handleRemove(item.productId)}
                        color="error"
                        sx={{ 
                          '&:hover': { 
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </ProductCard>
        </Slide>
      </Grid>
    );
  })}
</Grid>

          {/* Delivery Assignment */}
          <GradientCard sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <DeliveryIcon />
                </Avatar>
                <Typography variant="h5" fontWeight="bold">
                  Delivery Assignment
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ minHeight: 48, minWidth: 300 }}>
                    <InputLabel id="customer-label">Customer</InputLabel>
                    <Select
                      labelId="customer-label"
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
                      sx={{ borderRadius: 2, height: 48 }}
                    >
                      {customers.map((cust) => (
                        <MenuItem key={cust.customerId || cust.id} value={cust.customerName}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <PersonIcon fontSize="small" />
                            {cust.customerName}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    helperText={customerEmail && !/\S+@\S+\.\S+/.test(customerEmail) ? "Invalid email format" : ""}
                    error={customerEmail && !/\S+@\S+\.\S+/.test(customerEmail)}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, height: 48 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    helperText={customerPhone && !/^\d{10}$/.test(customerPhone) ? "Enter a valid 10-digit phone number" : ""}
                    error={customerPhone && !/^\d{10}$/.test(customerPhone)}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, height: 48 } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    multiline
                    rows={2}
                    helperText="Enter the delivery address"
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, minHeight: 60 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Delivery Date"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                    InputProps={{
                      startAdornment: <DateIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, height: 48 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ minHeight: 48, minWidth: 300 }}>
                    <InputLabel id="agent-label">Delivery Agent</InputLabel>
                    <Select
                      labelId="agent-label"
                      value={agent}
                      label="Delivery Agent"
                      onChange={(e) => setAgent(e.target.value)}
                      sx={{ borderRadius: 2, height: 48 }}
                    >
                      {deliveryAgents.map((d) => (
                        <MenuItem key={d.userId} value={d.userId}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <DeliveryIcon fontSize="small" />
                            {d.username}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </GradientCard>

          {/* Checkout Section */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              borderRadius: 8,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.light, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3}>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  Total: ₹{subtotal.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Including all items in your cart
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                size="large"
                onClick={handleCheckout}
                disabled={!customerName || !address || !deliveryDate || !agent || cart.length === 0 || isCheckoutLoading}
                startIcon={<CheckIcon />}
                sx={{ 
                  px: 5, 
                  py: 2.5, 
                  borderRadius: 3,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.primary.dark} 100%)`,
                    transform: 'scale(1.05)',
                    boxShadow: theme.shadows[12]
                  },
                  '&:disabled': {
                    background: alpha(theme.palette.grey[500], 0.5),
                    color: theme.palette.grey[300],
                    boxShadow: 'none'
                  }
                }}
              >
                {isCheckoutLoading ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
              </Button>
            </Stack>
          </Paper>
        </>
      )}

      {/* Confirmation Dialog */}
      <GlassmorphismDialog
        open={showModal}
        onClose={() => setShowModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Avatar sx={{ bgcolor: 'success.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
            <CheckIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            Order Confirmation
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1" fontWeight="medium">Customer:</Typography>
              <Typography variant="body1">{customerName}</Typography>
            </Box>
            <Divider />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1" fontWeight="medium">Agent:</Typography>
              <Typography variant="body1">
                {deliveryAgents.find(a => a.userId == agent)?.username || agent}
              </Typography>
            </Box>
            <Divider />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1" fontWeight="medium">Delivery Date:</Typography>
              <Typography variant="body1">{deliveryDate}</Typography>
            </Box>
            <Divider />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1" fontWeight="medium">Address:</Typography>
              <Typography variant="body1" textAlign="right" sx={{ maxWidth: '60%' }}>
                {address}
              </Typography>
            </Box>
            <Divider />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" fontWeight="bold">Total:</Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                ₹{subtotal.toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setShowModal(false)}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmOrder}
            variant="contained"
            disabled={isCheckoutLoading}
            sx={{ 
              borderRadius: 2, 
              px: 3,
              background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
            }}
          >
            {isCheckoutLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Order'}
          </Button>
        </DialogActions>
      </GlassmorphismDialog>
    </Container>
  );
};

export default Cart;