import React, { useState } from 'react';
import Sitebar from './Sitebar';
import { Outlet } from 'react-router-dom';
import './Layout.css'; // We'll define custom styles here

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="d-flex min-vh-100 w-100">
      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <Sitebar closeSidebar={closeSidebar} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="overlay d-md-none" onClick={closeSidebar}></div>
      )}

      {/* Main Content */}
      <div className="flex-grow-1 p-4 bg-white content-area">
        {/* Toggle button visible only on mobile */}
        <button
          className="btn btn-outline-secondary d-md-none mb-3"
          onClick={toggleSidebar}
        >
          <i className="bi bi-list"></i> Menu
        </button>

        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
