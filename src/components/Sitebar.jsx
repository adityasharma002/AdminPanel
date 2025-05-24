import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sitebar = ({ closeSidebar }) => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clears token and user state
    navigate('/login'); // Redirect to login
    if (closeSidebar) closeSidebar(); // Close sidebar on mobile
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: 'bi-house-door-fill', exact: true },
    { to: '/categories', label: 'Categories', icon: 'bi-tags-fill' },
    { to: '/products', label: 'Products', icon: 'bi-box-seam' },
    { to: '/customer', label: 'Customers', icon: 'bi-box-seam' },
    { to: '/cart', label: 'Cart', icon: 'bi-truck' },
    { to: '/orders', label: 'Orders', icon: 'bi-card-checklist' },
  ];

  return (
    <div>
      {/* Close button for mobile */}
      <div className="d-flex justify-content-between align-items-center mb-3 d-md-none">
        <h2 className="fs-5 fw-bold">Admin Panel</h2>
        <button className="btn btn-outline-secondary btn-sm" onClick={closeSidebar}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      {/* Sidebar title for desktop */}
      <h2 className="sidebar-title d-none d-md-block fs-4 fw-bold mb-4">Admin Panel</h2>

      <ul className="nav flex-column">
        {navItems.map(({ to, label, icon, exact }) => (
          <li className="nav-item" key={label}>
            <NavLink
              to={to}
              end={exact}
              className={({ isActive }) => `sidebar-link nav-link d-flex align-items-center gap-2${isActive ? ' active fw-bold text-primary' : ''}`}
              onClick={closeSidebar}
            >
              <i className={`bi ${icon}`}></i> {label}
            </NavLink>
          </li>
        ))}

        <li className="nav-item mt-4">
          <button className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sitebar;
