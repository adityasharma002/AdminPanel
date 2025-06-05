import React from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Avatar,
  useTheme, alpha, Fade, Zoom, LinearProgress,
  IconButton, Tooltip, Stack, Chip, Container
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  CurrencyRupee as RupeeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon,
  Dashboard as DashboardIcon,
  Insights as InsightsIcon
} from '@mui/icons-material';
import useOrderStore from '../store/useOrderStore';

const StatCardsGrid = () => {
  const theme = useTheme();
  const orders = useOrderStore((state) => state.orders);

  // Define periods (last 30 days and previous 30 days)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Filter orders for current and previous periods
  const currentOrders = orders.filter((o) => new Date(o.orderDate) >= thirtyDaysAgo);
  const previousOrders = orders.filter(
    (o) => new Date(o.orderDate) >= sixtyDaysAgo && new Date(o.orderDate) < thirtyDaysAgo
  );

  // Calculate stats for current period
  const totalOrders = currentOrders.length;
  const delivered = currentOrders.filter((o) => o.status === 'Delivered').length;
  const pending = currentOrders.filter((o) => o.status === 'Pending').length;
  const revenue = currentOrders
    .filter((o) => o.status === 'Delivered')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Calculate stats for previous period
  const prevTotalOrders = previousOrders.length;
  const prevDelivered = previousOrders.filter((o) => o.status === 'Delivered').length;
  const prevPending = previousOrders.filter((o) => o.status === 'Pending').length;
  const prevRevenue = previousOrders
    .filter((o) => o.status === 'Delivered')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Calculate trends (percentage change)
  const calculateTrend = (current, previous) => {
    if (previous === 0) return { trend: '0%', trendUp: true }; // Avoid division by zero
    const change = ((current - previous) / previous) * 100;
    return {
      trend: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
      trendUp: change >= 0,
    };
  };

  const totalOrdersTrend = calculateTrend(totalOrders, prevTotalOrders);
  const deliveredTrend = calculateTrend(delivered, prevDelivered);
  const pendingTrend = calculateTrend(pending, prevPending);
  const revenueTrend = calculateTrend(revenue, prevRevenue);

  // Calculate percentages for progress bars
  const deliveryRate = totalOrders > 0 ? ((delivered / totalOrders) * 100).toFixed(1) : 0;
  const pendingRate = totalOrders > 0 ? ((pending / totalOrders) * 100).toFixed(1) : 0;

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      subtitle: 'All time orders',
      icon: CartIcon,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1),
      trend: totalOrdersTrend.trend,
      trendUp: totalOrdersTrend.trendUp,
      progress: Math.min((totalOrders / 100) * 100, 100),
    },
    {
      title: 'Delivered Orders',
      value: delivered,
      subtitle: `${deliveryRate}% completion rate`,
      icon: CheckCircleIcon,
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
      trend: deliveredTrend.trend,
      trendUp: deliveredTrend.trendUp,
      progress: parseFloat(deliveryRate),
    },
    {
      title: 'Pending Deliveries',
      value: pending,
      subtitle: `${pendingRate}% pending`,
      icon: ScheduleIcon,
      gradient: 'linear-gradient(135deg, #fcb045 0%, #fd1d1d 100%)',
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.1),
      trend: pendingTrend.trend,
      trendUp: pendingTrend.trendUp,
      progress: parseFloat(pendingRate),
    },
    {
      title: 'Revenue Generated',
      value: `₹${revenue.toLocaleString()}`,
      subtitle: 'Total earnings',
      icon: RupeeIcon,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      color: theme.palette.info.main,
      bgColor: alpha(theme.palette.info.main, 0.1),
      trend: revenueTrend.trend,
      trendUp: revenueTrend.trendUp,
      progress: Math.min((revenue / 100000) * 100, 100),
    },
  ];

  return (
    <Container maxWidth={false} sx={{ py: { xs: 2, md: 4 } }}>
      {/* Enhanced Header Section */}
      <Fade in timeout={600}>
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{ mb: 2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.main,
                  width: { xs: 36, sm: 40, md: 56 },
                  height: { xs: 36, sm: 40, md: 56 },
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                <DashboardIcon sx={{ fontSize: { xs: 18, sm: 20, md: 28 } }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    mb: 0.5,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
                  }}
                >
                  Dashboard Overview
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <InsightsIcon
                    sx={{
                      color: 'text.secondary',
                      fontSize: { xs: 14, sm: 16, md: 18 }
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}
                  >
                    Real-time insights and key metrics at a glance
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Fade>

      {/* Enhanced Stats Cards Grid */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ alignItems: 'stretch' }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Zoom in timeout={800 + index * 200}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  minHeight: { xs: 180, sm: 180, md: 220 },
                  width: { xs: '82vw', sm: '250px', md: '250px' },
                  borderRadius: { xs: 2, sm: 3, md: 4 },
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxSizing: 'border-box',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 60px ${alpha(stat.color, 0.15)}`,
                    '& .stat-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                    },
                    '& .gradient-bg': {
                      opacity: 0.12,
                    },
                  },
                }}
              >
                {/* Enhanced Gradient Background */}
                <Box
                  className="gradient-bg"
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    width: { xs: 60, sm: 80 },
                    height: { xs: 60, sm: 80 },
                    background: stat.gradient,
                    opacity: 0.06,
                    borderRadius: '50%',
                    transition: 'all 0.4s ease',
                  }}
                />

                <CardContent
                  sx={{
                    p: { xs: 1.5, sm: 2, md: 3 },
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Header */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mb: { xs: 1.5, sm: 2 } }}
                  >
                    <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} alignItems="center" sx={{ flex: 1 }}>
                      <Avatar
                        className="stat-icon"
                        sx={{
                          bgcolor: stat.bgColor,
                          color: stat.color,
                          width: { xs: 36, sm: 40, md: 48 },
                          height: { xs: 36, sm: 40, md: 48 },
                          transition: 'all 0.4s ease',
                        }}
                      >
                        <stat.icon sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
                      </Avatar>

                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 600,
                            fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            mb: 0.5,
                          }}
                        >
                          {stat.title}
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            color: 'text.primary',
                            lineHeight: 1.2,
                            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                          }}
                        >
                          {stat.value}
                        </Typography>
                      </Box>
                    </Stack>

                    <Tooltip title="More options">
                      <IconButton
                        size="small"
                        sx={{
                          opacity: 0.6,
                          '&:hover': {
                            opacity: 1,
                            bgcolor: alpha(stat.color, 0.1),
                          },
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  {/* Progress Bar */}
                  <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                    <LinearProgress
                      variant="determinate"
                      value={stat.progress}
                      sx={{
                        height: { xs: 3, sm: 4, md: 6 },
                        borderRadius: 3,
                        bgcolor: alpha(stat.color, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          background: stat.gradient,
                        },
                      }}
                    />
                  </Box>

                  {/* Footer */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                      }}
                    >
                      {stat.subtitle}
                    </Typography>

                    <Chip
                      icon={stat.trendUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
                      label={stat.trend}
                      size="small"
                      variant="filled"
                      sx={{
                        bgcolor: stat.trendUp
                          ? alpha(theme.palette.success.main, 0.1)
                          : alpha(theme.palette.error.main, 0.1),
                        color: stat.trendUp
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                        fontWeight: 700,
                        fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem' },
                        height: { xs: 18, sm: 20, md: 24 },
                        '& .MuiChip-icon': {
                          fontSize: { xs: 9, sm: 10, md: 12 },
                        },
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StatCardsGrid;