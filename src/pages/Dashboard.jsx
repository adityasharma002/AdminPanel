import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Box
} from '@mui/material';
import StatCardsGrid from '../components/StatCardsGrid';
import useOrderStore from '../store/useOrderStore';

const Dashboard = () => {
  const getRecentOrders = useOrderStore((state) => state.getRecentOrders);
  const recentOrders = getRecentOrders();

  return (
    <Box p={{ xs: 2, sm: 4 }}>
      {/* Stat Cards */}
      <StatCardsGrid />

      {/* Recent Orders */}
      <Box mt={6}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            color: '#1f2937',
            borderBottom: '2px solid #f1f5f9',
            pb: 1,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <i className="bi bi-receipt-cutoff text-secondary" />
          Recent Orders
        </Typography>

        {/* Responsive Table */}
        <Box sx={{ overflowX: 'auto' }}>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Order ID</strong></TableCell>
                  <TableCell><strong>Product</strong></TableCell>
                  <TableCell><strong>Delivery Boy</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.products.map(p => p.name).join(', ')}</TableCell>
                    <TableCell>{order.deliveryBoy || 'Unassigned'}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          backgroundColor:
                            order.status === 'Delivered'
                              ? '#d1fae5'
                              : order.status === 'Pending'
                              ? '#fef3c7'
                              : '#fee2e2',
                          color:
                            order.status === 'Delivered'
                              ? '#065f46'
                              : order.status === 'Pending'
                              ? '#92400e'
                              : '#991b1b',
                        }}
                      >
                        {order.status}
                      </Box>
                    </TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
