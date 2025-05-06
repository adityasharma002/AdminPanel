import { NavLink } from 'react-router-dom';

const Sitebar = () => {
  return (
    <div>
      <h2 className="sidebar-title">Admin Panel</h2>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <i className="bi bi-house-door-fill"></i> Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/categories" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <i className="bi bi-tags-fill"></i> Categories
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/products" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <i className="bi bi-box-seam"></i> Products
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/cart" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <i className="bi bi-truck"></i> Cart
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/orders" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <i className="bi bi-card-checklist"></i> Orders
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/invoices" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <i className="bi bi-file-earmark-text-fill"></i> Invoices
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sitebar;
