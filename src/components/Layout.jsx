import Sitebar from './Sitebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="d-flex min-vh-100 w-100">
      {/* Fixed-width sidebar */}
      <div className="sidebar bg-light border-end p-3">
        <Sitebar />
      </div>

      {/* Flexible content area */}
      <div className="flex-grow-1 p-4 bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
