import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

const StorefrontHeader: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    return (
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-green-800">
                    سوق الفلاح
                </Link>
                <div className="flex items-center space-x-4 space-x-reverse">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-gray-600 hover:text-green-800 font-semibold">لوحة التحكم</Link>
                            <Button onClick={handleLogout} variant="secondary" size="sm">تسجيل الخروج</Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-green-800 font-semibold">تسجيل الدخول</Link>
                            <Link to="/register">
                                <Button size="sm">إنشاء متجر</Button>
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
            <div className="container mx-auto px-6 py-4 text-center text-gray-600">
                <p>&copy; {new Date().getFullYear()} سوق الفلاح. جميع الحقوق محفوظة.</p>
            </div>
        </footer>
    );
};

const StorefrontLayout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans" dir="rtl">
            <StorefrontHeader />
            <main className="flex-grow container mx-auto px-6 py-8">
                <Outlet />
            </main>
            <StorefrontFooter />
        </div>
    );
};

export default StorefrontLayout;
