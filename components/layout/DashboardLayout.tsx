import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DashboardSidebar: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center p-3 my-1 rounded-md transition-colors ${
            isActive
                ? 'bg-green-800 text-white'
                : 'text-gray-700 hover:bg-green-100 hover:text-green-900'
        }`;

    return (
        <aside className="w-64 bg-white p-4 shadow-lg flex flex-col">
            <div className="mb-8 text-center">
                <Link to="/" className="text-2xl font-bold text-green-800">
                    سوق الفلاح
                </Link>
            </div>
            <nav className="flex-grow">
                <NavLink to="/dashboard/overview" className={navLinkClasses}>
                    نظرة عامة
                </NavLink>
                <NavLink to="/dashboard/products" className={navLinkClasses}>
                    المنتجات
                </NavLink>
                <NavLink to="/dashboard/settings" className={navLinkClasses}>
                    إعدادات المتجر
                </NavLink>
                <NavLink to="/dashboard/subscription" className={navLinkClasses}>
                    الاشتراك
                </NavLink>
                <NavLink to="/dashboard/invoices" className={navLinkClasses}>
                    الفواتير
                </NavLink>
            </nav>
            <div className="mt-auto">
                 <button onClick={handleLogout} className="w-full text-right p-3 rounded-md text-gray-700 hover:bg-red-100 hover:text-red-700 transition-colors">
                    تسجيل الخروج
                </button>
            </div>
        </aside>
    );
};


const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100" dir="rtl">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
