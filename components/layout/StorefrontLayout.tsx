import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const StorefrontHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate('/dashboard');
  }

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-gray-800">
          سوق الفلاح
        </Link>
        <div className="flex items-center space-x-4 space-x-reverse">
          {user ? (
            <>
              <button onClick={handleDashboardClick} className="px-4 py-2 text-gray-700 font-semibold rounded-md hover:bg-gray-100">لوحة التحكم</button>
              <button onClick={logout} className="px-4 py-2 text-gray-600 font-semibold rounded-md hover:bg-gray-100">تسجيل الخروج</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-gray-700 font-semibold rounded-md hover:bg-gray-100">تسجيل الدخول</Link>
              <Link to="/register" className="px-4 py-2 bg-gray-800 text-white font-bold rounded-md hover:bg-gray-900">
                ابدأ متجرك
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

const StorefrontFooter: React.FC = () => {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="container mx-auto px-6 py-8 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} سوق الفلاح. كل الحقوق محفوظة.</p>
        <p className="mt-2">منصة لربط الفلاحين والتجار الجزائريين.</p>
      </div>
    </footer>
  );
};

const StorefrontLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <StorefrontHeader />
      <main className="flex-grow container mx-auto px-6 py-8">
        <Outlet />
      </main>
      <StorefrontFooter />
    </div>
  );
};

export default StorefrontLayout;