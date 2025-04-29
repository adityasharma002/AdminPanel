import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Categories from '../pages/Categories';
import Products from '../pages/Products';
import AssignDelivery from '../pages/AssignDelivery';
import Orders from '../pages/Orders';
import Invoices from '../pages/Invoices';

const AppRoutes = () => {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <Routes>
      {/* Always show Layout with sidebar */}
      <Route path="/" element={<Layout />}>
        {/* If not logged in → show Login on all pages */}
        {!isLoggedIn ? (
          <>
            <Route index element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="assign-delivery" element={<AssignDelivery />} />
            <Route path="orders" element={<Orders />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
