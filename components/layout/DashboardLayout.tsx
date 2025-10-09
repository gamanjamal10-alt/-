import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DashboardSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClasses = "flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-md transition-colors";
  const activeLinkClasses = "bg-gray-700 font-bold";

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col fixed top-0 right-0">
      <div className="px-6 py-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-sm text-gray-300">{user?.email}</p>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        <NavLink to="/dashboard/overview" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>نظرة عامة</NavLink>
        <NavLink to="/dashboard/products" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>إدارة المنتجات</NavLink>
        <NavLink to="/dashboard/settings" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>إعدادات المتجر</NavLink>
        <NavLink to="/dashboard/subscription" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>الاشتراك</NavLink>
        <NavLink to="/dashboard/invoices" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>الفواتير</NavLink>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <NavLink to="/" className={linkClasses}>العودة للموقع</NavLink>
        <button onClick={handleLogout} className={`${linkClasses} w-full text-right`}>تسجيل الخروج</button>
      </div>
    </div>
  );
};

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex bg-gray-100">
      <DashboardSidebar />
      <main className="flex-1 p-8 mr-64">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;