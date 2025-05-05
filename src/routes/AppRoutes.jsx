import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Categories from '../pages/Categories';
import Products from '../pages/Products'; // Used for both all products and category-specific
import AssignDelivery from '../pages/AssignDelivery';
import Orders from '../pages/Orders';
import Invoices from '../pages/Invoices';
import Cart from '../pages/Cart';

const AppRoutes = () => {
  const isLoggedIn = true; // Replace with actual auth logic

  return (
    <Routes>
      {!isLoggedIn ? (
        <>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          {/* Layout Routes with sidebar */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} /> {/* ✅ All Products */}
            <Route path="assign-delivery" element={<AssignDelivery />} />
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<Orders />} />
            <Route path="invoices" element={<Invoices />} />
          </Route>

          {/* Standalone route for selected category's products */}
          <Route path="/products/:categoryId" element={<Products />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
