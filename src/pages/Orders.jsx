import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  CircularProgress,
  alpha,
  useMediaQuery,
  useTheme,
  Collapse,
  Stack, // Added Stack import
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useOrderStore from '../store/useOrderStore';

// Styled components for modern look
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  borderBottom: { xs: 'none', sm: `1px solid ${theme.palette.divider}` },
  padding: { xs: '8px 4px', sm: '16px' },
  fontSize: { xs: '0.75rem', sm: '0.875rem' },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.grey[100], 0.5),
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transition: 'background-color 0.3s ease',
  },
  borderBottom: { xs: `1px solid ${alpha(theme.palette.divider, 0.1)}`, sm: 'none' },
}));

const Orders = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    orders,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    sortKey,
    sortAsc,
    setSort,
    fetchOrders,
  } = useOrderStore();

  // State for loading and expanded rows
  const [loading, setLoading] = React.useState(true);
  const [expandedRows, setExpandedRows] = React.useState({});

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      await fetchOrders();
      setLoading(false);
    };
    loadOrders();
  }, [fetchOrders]);

  // Log orders to debug data
  useEffect(() => {
    console.log('Orders:', orders);
  }, [orders]);

  const getFilteredSortedOrders = () => {
    let filtered = [...orders];

    if (filterStatus) {
      console.log('Filter Status:', filterStatus);
      filtered = filtered.filter((o) => o.status.toLowerCase() === filterStatus.toLowerCase());
      console.log('Filtered Orders:', filtered);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.customerName.toLowerCase().includes(q) ||
          (o.deliveryBoy?.toLowerCase().includes(q)) ||
          o.id.toLowerCase().includes(q)
      );
    }

    if (sortKey) {
      filtered.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortAsc ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    }

    return filtered;
  };

  const filteredOrders = getFilteredSortedOrders();

  const handleSort = (key) => {
    setSort(key);
  };

  const handleExpandRow = (orderId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 4 }, maxWidth: '100%', overflowX: 'auto' }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold', 
          color: 'text.primary', 
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: '1.5rem', sm: '1.75rem' }
        }}
      >
        Orders
      </Typography>

      {/* Filter & Search Section */}
      <Grid 
        container 
        spacing={{ xs: 1, sm: 2 }} 
        sx={{ 
          mb: { xs: 2, sm: 3 },
          flexDirection: { xs: 'column', sm: 'row' }
        }}
      >
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Status
            </InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => {
                console.log('Selected Status:', e.target.value);
                setFilterStatus(e.target.value);
              }}
              label="Status"
              sx={{ 
                borderRadius: 2, 
                minWidth: { xs: 'auto', sm: 240 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Assigned">Assigned</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={8} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name, agent, or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Orders Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 2, sm: 4 } }}>
          <CircularProgress size={isMobile ? 30 : 40} />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table sx={{ minWidth: { xs: 'auto', sm: 650 } }}>
            <TableHead sx={{ display: { xs: 'none', sm: 'table-header-group' } }}>
              <TableRow>
                <StyledTableCell onClick={() => handleSort('id')} sx={{ cursor: 'pointer' }}>
                  Order ID {sortKey === 'id' && (sortAsc ? '↑' : '↓')}
                </StyledTableCell>
                <StyledTableCell>Customer</StyledTableCell>
                <StyledTableCell>Address</StyledTableCell>
                <StyledTableCell onClick={() => handleSort('deliveryDate')} sx={{ cursor: 'pointer' }}>
                  Delivery Date {sortKey === 'deliveryDate' && (sortAsc ? '↑' : '↓')}
                </StyledTableCell>
                <StyledTableCell>Total</StyledTableCell>
                <StyledTableCell onClick={() => handleSort('orderDate')} sx={{ cursor: 'pointer' }}>
                  Order Date {sortKey === 'orderDate' && (sortAsc ? '↑' : '↓')}
                </StyledTableCell>
                <StyledTableCell>Products</StyledTableCell>
                <StyledTableCell align="center">Quantity</StyledTableCell>
                <StyledTableCell>Delivery Boy</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Invoice</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => {
                // Process products for display: show up to 2 products, stacked vertically
                const visibleProducts = order.products.slice(0, 2);
                const extraProducts = order.products.length > 2 ? `+${order.products.length - 2} more` : '';

                // Process address for display (truncate if more than 5 words)
                const addressWords = order.address.split(' ');
                const displayAddress = addressWords.length > 5 
                  ? addressWords.slice(0, 5).join(' ') + '...' 
                  : order.address;

                return (
                  <React.Fragment key={order.id}>
                    <StyledTableRow
                      sx={{
                        display: { xs: 'flex', sm: 'table-row' },
                        flexDirection: { xs: 'column', sm: 'row' },
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
                            Order #{order.id}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleExpandRow(order.id)}
                          >
                            <ExpandMoreIcon
                              sx={{
                                transform: expandedRows[order.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                                fontSize: { xs: '1rem' },
                              }}
                            />
                          </IconButton>
                        </Stack>
                        <Typography
                          sx={{ display: { xs: 'none', sm: 'block' }, fontSize: { sm: '0.875rem' } }}
                        >
                          {order.id}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 1 } }}>
                        <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {order.customerName}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 1 }, display: { xs: 'none', sm: 'table-cell' } }}>
                        <Typography sx={{ fontSize: { sm: '0.875rem' } }}>
                          {displayAddress}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 1 }, display: { xs: 'none', sm: 'table-cell' } }}>
                        <Typography sx={{ fontSize: { sm: '0.875rem' } }}>
                          {order.deliveryDate}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 1 }, display: { xs: 'none', sm: 'table-cell' } }}>
                        <Typography sx={{ fontSize: { sm: '0.875rem' } }}>
                          ₹{order.totalAmount}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 1 }, display: { xs: 'none', sm: 'table-cell' } }}>
                        <Typography sx={{ fontSize: { sm: '0.875rem' } }}>
                          {order.orderDate}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 1 }, display: { xs: 'none', sm: 'table-cell' } }}>
                        <Box sx={{ maxWidth: 200, display: 'flex', flexDirection: 'column' }}>
                          {visibleProducts.map((p, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              sx={{ 
                                textOverflow: 'ellipsis', 
                                overflow: 'hidden',
                                fontSize: { sm: '0.75rem' }
                              }}
                            >
                              {`${p.name} (x${p.quantity})`}
                            </Typography>
                          ))}
                          {extraProducts && (
                            <Typography
                              variant="body2"
                              sx={{ color: 'primary.main', mt: 0.5, fontSize: { sm: '0.75rem' } }}
                            >
                              {extraProducts}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 1 }, display: { xs: 'none', sm: 'table-cell' } }}
                      >
                        <Typography variant="body2" sx={{ fontSize: { sm: '0.75rem' } }}>
                          {order.products.map((p) => p.quantity).join(', ')}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 1 }, display: { xs: 'none', sm: 'table-cell' } }}>
                        <Typography sx={{ fontSize: { sm: '0.875rem' } }}>
                          {order.deliveryBoy || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 1 } }}>
                        <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {order.status}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 1 }, display: { xs: 'none', sm: 'table-cell' } }}>
                        <IconButton
                          component={Link}
                          to={`/invoice/${order.id.replace('#', '')}`}
                          color="primary"
                          size="small"
                        >
                          <VisibilityIcon sx={{ fontSize: { sm: '1rem' } }} />
                        </IconButton>
                      </TableCell>
                    </StyledTableRow>
                    <TableRow sx={{ display: { xs: 'table-row', sm: 'none' } }}>
                      <TableCell sx={{ p: 0, borderBottom: 'none' }}>
                        <Collapse in={expandedRows[order.id]} timeout="auto">
                          <Box sx={{ p: 2, bgcolor: theme.palette.grey[100] }}>
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
                              {displayAddress}
                            </Typography>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ fontWeight: 600, mb: 1, fontSize: '0.75rem' }}
                            >
                              Delivery Date
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ mb: 1, fontSize: '0.75rem', color: 'text.secondary' }}
                            >
                              {order.deliveryDate}
                            </Typography>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ fontWeight: 600, mb: 1, fontSize: '0.75rem' }}
                            >
                              Total
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ mb: 1, fontSize: '0.75rem', color: 'text.secondary' }}
                            >
                              ₹{order.totalAmount}
                            </Typography>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ fontWeight: 600, mb: 1, fontSize: '0.75rem' }}
                            >
                              Order Date
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ mb: 1, fontSize: '0.75rem', color: 'text.secondary' }}
                            >
                              {order.orderDate}
                            </Typography>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ fontWeight: 600, mb: 1, fontSize: '0.75rem' }}
                            >
                              Products
                            </Typography>
                            <Box sx={{ mb: 1 }}>
                              {order.products.map((p, index) => (
                                <Typography
                                  key={index}
                                  variant="body2"
                                  sx={{ fontSize: '0.75rem', color: 'text.secondary' }}
                                >
                                  {`${p.name} (x${p.quantity})`}
                                </Typography>
                              ))}
                            </Box>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ fontWeight: 600, mb: 1, fontSize: '0.75rem' }}
                            >
                              Quantity
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ mb: 1, fontSize: '0.75rem', color: 'text.secondary' }}
                            >
                              {order.products.map((p) => p.quantity).join(', ')}
                            </Typography>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ fontWeight: 600, mb: 1, fontSize: '0.75rem' }}
                            >
                              Delivery Boy
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ mb: 1, fontSize: '0.75rem', color: 'text.secondary' }}
                            >
                              {order.deliveryBoy || '-'}
                            </Typography>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ fontWeight: 600, mb: 1, fontSize: '0.75rem' }}
                            >
                              Invoice
                            </Typography>
                            <IconButton
                              component={Link}
                              to={`/invoice/${order.id.replace('#', '')}`}
                              color="primary"
                              size="small"
                            >
                              <VisibilityIcon sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* No Orders Message */}
      {!loading && filteredOrders.length === 0 && (
        <Box sx={{ textAlign: 'center', py: { xs: 2, sm: 4 } }}>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            No orders found.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Orders;