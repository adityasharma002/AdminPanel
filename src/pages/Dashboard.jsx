import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
  Container,
  Stack,
  Avatar,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fade,
  Zoom,
  useMediaQuery,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  LocalShipping,
  PendingActions,
  CheckCircle,
  Schedule,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import useOrderStore from '../store/useOrderStore';
import StatCardsGrid from '../components/StatCardsGrid';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { 
    orders, 
    loading, 
    error, 
    fetchOrders, 
    getRecentOrders 
  } = useOrderStore();
  const [expandedRows, setExpandedRows] = React.useState({});

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const recentOrders = getRecentOrders();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return theme.palette.success.main;
      case 'pending':
        return theme.palette.warning.main;
      case 'cancelled':
        return theme.palette.error.main;
      case 'in transit':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle sx={{ fontSize: { xs: 14, sm: 16 } }} />;
      case 'pending':
        return <Schedule sx={{ fontSize: { xs: 14, sm: 16 } }} />;
      case 'in transit':
        return <LocalShipping sx={{ fontSize: { xs: 14, sm: 16 } }} />;
      default:
        return <PendingActions sx={{ fontSize: { xs: 14, sm: 16 } }} />;
    }
  };

  const handleExpandRow = (orderId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <Stack spacing={2} alignItems="center">
            <LinearProgress sx={{ width: { xs: 150, sm: 200 } }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Loading Dashboard...
            </Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
        <Card sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), border: `1px solid ${theme.palette.error.main}` }}>
          <CardContent>
            <Typography variant="h6" color="error" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Error Loading Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              {error}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Stats Cards Section */}
      <StatCardsGrid />

      {/* Recent Orders Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
        <Fade in timeout={1000}>
          <Card
            elevation={0}
            sx={{
              borderRadius: { xs: 2, sm: 4 },
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {/* Section Header */}
              <Box sx={{ p: { xs: 2, sm: 3 }, pb: { xs: 1, sm: 2 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        mb: 1,
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                      }}
                    >
                      Recent Orders
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      Latest orders and their current status
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      width: { xs: 36, sm: 48 },
                      height: { xs: 36, sm: 48 },
                    }}
                  >
                    <LocalShipping sx={{ fontSize: { xs: 20, sm: 24 } }} />
                  </Avatar>
                </Stack>
              </Box>

              {/* Orders Table */}
              <TableContainer>
                <Table sx={{ minWidth: { xs: 'auto', sm: 650 } }}>
                  <TableHead sx={{ display: { xs: 'none', sm: 'table-header-group' } }}>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                      <TableCell sx={{ fontWeight: 600, color: 'text.primary', fontSize: { sm: '0.875rem' } }}>
                        Order ID
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.primary', fontSize: { sm: '0.875rem' } }}>
                        Customer
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.primary', fontSize: { sm: '0.875rem' } }}>
                        Products
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.primary', fontSize: { sm: '0.875rem' } }}>
                        Amount
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.primary', fontSize: { sm: '0.875rem' } }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.primary', fontSize: { sm: '0.875rem' } }}>
                        Delivery Date
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order, index) => (
                      <React.Fragment key={order.id}>
                        <TableRow
                          sx={{
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.02),
                            },
                            transition: 'background-color 0.2s ease',
                            display: { xs: 'flex', sm: 'table-row' },
                            flexDirection: { xs: 'column', sm: 'row' },
                            borderBottom: { xs: `1px solid ${alpha(theme.palette.divider, 0.1)}`, sm: 'none' },
                            p: { xs: 2, sm: 0 },
                          }}
                        >
                          <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 2 } }}>
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
                                  }}
                                />
                              </IconButton>
                            </Stack>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                color: theme.palette.primary.main,
                                display: { xs: 'none', sm: 'block' },
                                fontSize: { sm: '0.875rem' },
                              }}
                            >
                              {order.id}
                            </Typography>
                          </TableCell>
                          
                          <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 2 } }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Avatar
                                sx={{
                                  width: { xs: 28, sm: 32 },
                                  height: { xs: 28, sm: 32 },
                                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                  color: theme.palette.secondary.main,
                                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                }}
                              >
                                {order.customerName?.charAt(0)?.toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography 
                                  variant="body2" 
                                  fontWeight={500}
                                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                  {order.customerName}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary"
                                  sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                                >
                                  {order.deliveryBoy || 'Unassigned'}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          
                          <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 2 }, display: { xs: 'none', sm: 'table-cell' } }}>
                            <Box>
                              {order.products?.slice(0, 2).map((product, idx) => (
                                <Typography
                                  key={idx}
                                  variant="caption"
                                  sx={{
                                    display: 'block',
                                    color: 'text.secondary',
                                    fontSize: { sm: '0.75rem' },
                                  }}
                                >
                                  {product.name} (×{product.quantity})
                                </Typography>
                              ))}
                              {order.products?.length > 2 && (
                                <Typography 
                                  variant="caption" 
                                  color="primary"
                                  sx={{ fontSize: { sm: '0.75rem' } }}
                                >
                                  +{order.products.length - 2} more
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          
                          <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 2 } }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                color: theme.palette.success.main,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              }}
                            >
                              ₹{order.totalAmount?.toLocaleString() || '0'}
                            </Typography>
                          </TableCell>
                          
                          <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 2 } }}>
                            <Chip
                              icon={getStatusIcon(order.status)}
                              label={order.status}
                              size="small"
                              sx={{
                                bgcolor: alpha(getStatusColor(order.status), 0.1),
                                color: getStatusColor(order.status),
                                fontWeight: 600,
                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                '& .MuiChip-icon': {
                                  color: 'inherit',
                                },
                              }}
                            />
                          </TableCell>
                          
                          <TableCell sx={{ borderBottom: { xs: 'none', sm: 'inherit' }, p: { xs: 0.5, sm: 2 }, display: { xs: 'none', sm: 'table-cell' } }}>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ fontSize: { sm: '0.875rem' } }}
                            >
                              {order.deliveryDate ? 
                                new Date(order.deliveryDate).toLocaleDateString() : 
                                'Not set'
                              }
                            </Typography>
                          </TableCell>
                        </TableRow>
                        
                        {/* Mobile Expanded Content */}
                        <TableRow sx={{ display: { xs: 'table-row', sm: 'none' } }}>
                          <TableCell sx={{ p: 0, borderBottom: 'none' }}>
                            <Collapse in={expandedRows[order.id]} timeout="auto">
                              <Box sx={{ p: 2, bgcolor: alpha(theme.palette.grey[100], 0.5) }}>
                                <Typography 
                                  variant="subtitle2" 
                                  sx={{ fontWeight: 600, mb: 1, fontSize: '0.75rem' }}
                                >
                                  Products
                                </Typography>
                                {order.products?.map((product, idx) => (
                                  <Typography
                                    key={idx}
                                    variant="caption"
                                    sx={{
                                      display: 'block',
                                      color: 'text.secondary',
                                      fontSize: '0.65rem',
                                      mb: 0.5,
                                    }}
                                  >
                                    {product.name} (×{product.quantity})
                                  </Typography>
                                ))}
                                <Typography 
                                  variant="subtitle2" 
                                  sx={{ fontWeight: 600, mt: 1, mb: 1, fontSize: '0.75rem' }}
                                >
                                  Delivery Date
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary"
                                  sx={{ fontSize: '0.65rem' }}
                                >
                                  {order.deliveryDate ? 
                                    new Date(order.deliveryDate).toLocaleDateString() : 
                                    'Not set'
                                  }
                                </Typography>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {recentOrders.length === 0 && (
                <Box sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center' }}>
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                  >
                    No Recent Orders
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Orders will appear here once you start receiving them.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default Dashboard;