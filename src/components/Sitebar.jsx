import { Link } from 'react-router-dom';

const Sitebar = () => {
  return (
    <div>
      <h2 className="sidebar-title">Admin Panel</h2>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/" className="sidebar-link">
            <i className="bi bi-house-door-fill"></i> Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/categories" className="sidebar-link">
            <i className="bi bi-tags-fill"></i> Categories
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/products" className="sidebar-link">
            <i className="bi bi-box-seam"></i> Products
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/assign-delivery" className="sidebar-link">
            <i className="bi bi-truck"></i> Assign Delivery
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/orders" className="sidebar-link">
            <i className="bi bi-card-checklist"></i> Orders
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/invoices" className="sidebar-link">
            <i className="bi bi-file-earmark-text-fill"></i> Invoices
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sitebar;
